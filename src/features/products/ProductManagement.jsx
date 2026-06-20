import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Button from '../../components/Button'
import Image from '../../components/Image'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateCategory,
  updateProduct,
} from './productSlice'

const initialCategoryForm = {
  name: '',
}

const initialProductForm = {
  name: '',
  category_id: '',
  price: '',
  stock: '',
  description: '',
  image: null,
  existingImage: '',
}

function ProductManagement() {
  const dispatch = useAppDispatch()
  const { categories, items: products, status, error } = useAppSelector((state) => state.products)

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [productForm, setProductForm] = useState(initialProductForm)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingProductId, setEditingProductId] = useState(null)
  const fileInputRef = useRef(null)

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: String(category.id), label: category.name })),
    [categories],
  )

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryForm)
    setEditingCategoryId(null)
  }

  const resetProductForm = () => {
    setProductForm(initialProductForm)
    setEditingProductId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmitCategory = (event) => {
    event.preventDefault()

    if (editingCategoryId) {
      dispatch(updateCategory({ id: editingCategoryId, payload: categoryForm }))
    } else {
      dispatch(createCategory(categoryForm))
    }

    resetCategoryForm()
  }

  const handleSubmitProduct = (event) => {
    event.preventDefault()

    const payload = new FormData()
    payload.append('name', productForm.name)
    payload.append('category_id', String(productForm.category_id))
    payload.append('price', String(productForm.price))
    payload.append('stock', String(productForm.stock))

    if (productForm.image instanceof File) {
      payload.append('image', productForm.image)
    }

    if (editingProductId) {
      dispatch(updateProduct({ id: editingProductId, payload }))
    } else {
      dispatch(createProduct(payload))
    }

    resetProductForm()
  }

  return (
    <main className="page-stack">
      <section className="hero-panel landing-hero">
        <div>
          <span className="eyebrow">Product Management</span>
          <h1>CRUD Category dan Product</h1>
          <p>
            Halaman ini khusus admin. Menghapus kategori akan sekaligus menghapus produk
            yang masih memakai kategori tersebut.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="secondary">Kembali ke Dashboard</Button>
        </Link>
      </section>

      <section className="management-grid">
        <article className="panel">
          <div className="section-head">
            <h2>{editingCategoryId ? 'Edit Category' : 'Tambah Category'}</h2>
            <p className="muted-text">Kelola kategori produk toko.</p>
            {status === 'loading' ? <p className="muted-text">Memuat data...</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
          </div>

          <form className="form-layout" onSubmit={handleSubmitCategory}>
            <label className="form-row">
              <span>Nama Kategori</span>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(event) =>
                  setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>

            <div className="inline-actions">
              <Button type="submit">
                {editingCategoryId ? 'Update Category' : 'Tambah Category'}
              </Button>
              {editingCategoryId ? (
                <Button type="button" variant="secondary" onClick={resetCategoryForm}>
                  Batal
                </Button>
              ) : null}
            </div>
          </form>

          <div className="management-list">
            {categories.map((category) => (
              <article key={category.id} className="management-card">
                <div>
                  <strong>{category.name}</strong>
                  <p>{category.description}</p>
                </div>
                <div className="inline-actions">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(category.id)
                      setCategoryForm({
                        name: category.name,
                        description: category.description,
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    onClick={() => dispatch(deleteCategory(category.id))}
                  >
                    Hapus
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <h2>{editingProductId ? 'Edit Product' : 'Tambah Product'}</h2>
            <p className="muted-text">Kelola data produk dan relasinya ke kategori.</p>
          </div>

          <form className="form-layout" onSubmit={handleSubmitProduct} encType="multipart/form-data">
            <label className="form-row">
              <span>Nama Produk</span>
              <input
                type="text"
                value={productForm.name}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
            </label>

            <label className="form-row">
              <span>Kategori</span>
              <select
                value={productForm.category_id}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, category_id: event.target.value }))
                }
                required
              >
                <option value="">Pilih kategori</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-row">
              <span>Harga</span>
              <input
                type="number"
                min="0"
                value={productForm.price}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, price: event.target.value }))
                }
                required
              />
            </label>

            <label className="form-row">
              <span>Stok</span>
              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(event) =>
                  setProductForm((prev) => ({ ...prev, stock: event.target.value }))
                }
                required
              />
            </label>

            <label htmlFor="image" className="form-row">
              <span>Image</span>
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) =>
                  setProductForm((prev) => ({
                    ...prev,
                    image: event.target.files?.[0] || null,
                  }))
                }
              />
              {productForm.image ? <p className="muted-text">File dipilih: {productForm.image.name}</p> : null}
              {editingProductId && productForm.existingImage ? (
                <div>
                  <p className="muted-text">Gambar saat ini</p>
                  <Image src={productForm.existingImage} alt={productForm.name} />
                </div>
              ) : null}
            </label>

            <div className="inline-actions">
              <Button type="submit">
                {editingProductId ? 'Update Product' : 'Tambah Product'}
              </Button>
              {editingProductId ? (
                <Button type="button" variant="secondary" onClick={resetProductForm}>
                  Batal
                </Button>
              ) : null}
            </div>
          </form>

          <div className="management-list">
            {products.map((product) => {
              const category = product.category.name

              return (
                <article key={product.id} className="management-card">
                  <div>
                    <Image src={product.image} alt={product.name} />
                    <strong>{product.name}</strong>
                    <p>{category || '-'}</p>
                    <p>Harga: Rp {product.price.toLocaleString('id-ID')}</p>
                    <p>Stok: {product.stock}</p>
                    <p>{product.description}</p>
                  </div>
                  <div className="inline-actions">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        setEditingProductId(product.id)
                        setProductForm({
                          name: product.name,
                          category_id: String(product.category_id),
                          price: String(product.price),
                          stock: String(product.stock),
                          description: product.description || '',
                          image: null,
                          existingImage: product.image || '',
                        })
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => dispatch(deleteProduct(product.id))}
                    >
                      Hapus
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </article>
      </section>
    </main>
  )
}

export default ProductManagement