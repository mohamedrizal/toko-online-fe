import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useSearchParams } from 'react-router-dom'
import { Box, Flex, Text, Button as ChakraButton, Input, Textarea, VStack, HStack, Spinner } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import DataTable from '../../components/DataTable'
import Image from '../../components/Image'
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
} from './productSlice'

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
  const [searchParams] = useSearchParams()
  const { categories, items: products, meta, status, error } = useAppSelector((state) => state.products)

  const [productForm, setProductForm] = useState(initialProductForm)
  const [editingProductId, setEditingProductId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const [categoryFilter, setCategoryFilter] = useState('')
  const fileInputRef = useRef(null)

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: String(category.id), label: category.name })),
    [categories],
  )

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Sync search query if URL changes (from global search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    setSearchQuery(urlSearch)
    setDebouncedSearch(urlSearch)
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, categoryFilter])

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, search: debouncedSearch, category_id: categoryFilter }))
  }, [dispatch, currentPage, debouncedSearch, categoryFilter])

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        confirmButtonColor: '#3182CE'
      })
    }
  }, [error])

  const resetProductForm = () => {
    setProductForm(initialProductForm)
    setEditingProductId(null)
    setIsModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (product) => {
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
    setIsModalOpen(true)
  }

  const handleSubmitProduct = async (event) => {
    event.preventDefault()
    const payload = new FormData()
    payload.append('name', productForm.name)
    payload.append('category_id', String(productForm.category_id))
    payload.append('price', String(productForm.price))
    payload.append('stock', String(productForm.stock))
    payload.append('description', productForm.description)

    if (productForm.image instanceof File) {
      payload.append('image', productForm.image)
    }

    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      if (editingProductId) {
        await dispatch(updateProduct({ id: editingProductId, payload })).unwrap()
      } else {
        await dispatch(createProduct(payload)).unwrap()
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: editingProductId ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false
      })
      resetProductForm()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err || 'Terjadi kesalahan saat menyimpan produk'
      })
    }
  }

  const handleDeleteProduct = (id, name) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Produk "${name}" akan dihapus permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Menghapus...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        })
        try {
          await dispatch(deleteProduct(id)).unwrap()
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Produk berhasil dihapus.',
            timer: 1500,
            showConfirmButton: false
          })
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err || 'Terjadi kesalahan saat menghapus produk.'
          })
        }
      }
    })
  }

  const columns = [
    {
      header: 'No',
      render: (_, __, rowIndex) => (currentPage - 1) * 10 + rowIndex + 1
    },
    { 
      header: 'Image', 
      render: (row) => (
        <Box w="50px" h="50px" borderRadius="md" overflow="hidden">
          <Image src={row.image} alt={row.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        </Box>
      ) 
    },
    { header: 'Nama Produk', accessor: 'name' },
    { header: 'Kategori', render: (row) => row.category?.name || '-' },
    { header: 'Harga', render: (row) => `Rp ${row.price.toLocaleString('id-ID')}` },
    { header: 'Stok', accessor: 'stock' },
    { 
      header: 'Aksi', 
      render: (row) => (
        <Flex gap={2}>
          <ChakraButton size="sm" variant="outline" 
            bg="transparent"
            padding="0"
            border="none"
            color="blue.600" 
            onClick={() => handleEdit(row)}
          >
            Edit
          </ChakraButton>
          <ChakraButton size="sm" variant="outline" 
            bg="transparent" 
            padding="0"
            border="none"
            color="red.600" 
            onClick={() => handleDeleteProduct(row.id, row.name)}
          >
            Hapus
          </ChakraButton>
        </Flex>
      ) 
    }
  ]

  return (
    <Box p={6} bg="gray.50" minH="calc(100vh - 60px)">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Product Management</Text>
          <Text color="gray.500" fontSize="sm">Kelola data produk dan relasinya ke kategori.</Text>
        </Box>
        <ChakraButton bg="blue.600" color="white" _hover={{ bg: 'blue.700' }} onClick={() => {
          resetProductForm()
          setIsModalOpen(true)
        }}>
          + Tambah Barang
        </ChakraButton>
      </Flex>

      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" position="relative">
        <Flex gap={4} mb={6} flexWrap="wrap">
          <Input 
            placeholder="Cari nama produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW={{ base: '100%', md: '300px' }}
            bg="white"
            border="1px solid" 
            borderColor="gray.300"
          />
          <Box 
            as="select" 
            p={2} 
            border="1px solid" 
            borderColor="gray.300" 
            borderRadius="md" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            maxW={{ base: '100%', md: '200px' }}
            bg="white"
          >
            <option value="">Semua Kategori</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Box>
        </Flex>

        {status === 'loading' && (
          <Flex position="absolute" top="0" left="0" w="100%" h="100%" bg="whiteAlpha.800" zIndex="10" align="center" justify="center" borderRadius="xl">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        )}
        
        <Box overflowX="auto">
          <DataTable 
            columns={columns} 
            data={products} 
            keyField="id" 
            page={currentPage}
            totalPages={meta?.last_page || meta?.total_pages || 1}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </Box>
      </Box>

      {/* Modal Overlay Tambah/Edit Barang */}
      {isModalOpen && (
        <Box 
          position="fixed" 
          top="0" 
          left="0" 
          w="100vw" 
          h="100vh" 
          bg="blackAlpha.600" 
          zIndex="1400" 
          display="flex" 
          alignItems="center" 
          justify="center">
          <Box bg="white" p={6} borderRadius="xl" w="50vw" boxShadow="xl" margin="auto" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold">{editingProductId ? 'Edit Product' : 'Tambah Product'}</Text>
              <Box 
                as="button" 
                onClick={resetProductForm} 
                fontSize="25px" 
                fontWeight="bold" 
                bg="transparent" 
                border="none" 
                padding="0" 
                color="gray.500"
                _hover={{ color: 'gray.800' }}
                cursor="pointer"
              >
                &times;
              </Box>
            </Flex>

            <form onSubmit={handleSubmitProduct} encType="multipart/form-data">
              <VStack gap={4} align="stretch">
                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Nama Produk</Text>
                  <Input 
                    type="text" 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    value={productForm.name} 
                    onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </Box>

                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Kategori</Text>
                  <Box 
                    as="select" 
                    w="100%" 
                    p={2} 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    value={productForm.category_id} 
                    onChange={(e) => setProductForm((prev) => ({ ...prev, category_id: e.target.value }))} 
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Box>
                </Box>

                <HStack gap={4}>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="medium">Harga</Text>
                    <Input 
                      bg="gray.50"
                      border="1px solid" 
                      borderColor="gray.300"
                      outline="none"
                      type="number" 
                      min="0" 
                      value={productForm.price} 
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} 
                      required 
                    />
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="medium">Stok</Text>
                    <Input 
                      bg="gray.50"
                      border="1px solid" 
                      borderColor="gray.300"
                      outline="none"
                      type="number" 
                      min="0" 
                      value={productForm.stock} 
                      onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} 
                      required 
                    />
                  </Box>
                </HStack>

                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Deskripsi</Text>
                  <Textarea 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    value={productForm.description} 
                    onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} 
                    placeholder="Masukkan deskripsi produk..."
                    rows={3}
                  />
                </Box>

                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Image</Text>
                  <Input 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    p={1} 
                    onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} 
                  />
                  {productForm.image && <Text fontSize="xs" color="gray.500" mt={1}>File dipilih: {productForm.image.name}</Text>}
                  {editingProductId && productForm.existingImage && (
                    <Box mt={2}>
                      <Text fontSize="xs" color="gray.500">Gambar saat ini:</Text>
                      <Box w="80px" h="80px" borderRadius="md" overflow="hidden" mt={1}>
                        <Image src={productForm.existingImage} alt={productForm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    </Box>
                  )}
                </Box>

                <Flex justify="flex-end" gap={3} mt={4}>
                  <ChakraButton variant="outline" type="button" onClick={resetProductForm} border="none">Batal</ChakraButton>
                  <ChakraButton 
                    bg="blue.600" 
                    color="white" 
                    _hover={{ bg: 'blue.700' }} 
                    type="submit" 
                    border="none"
                    disabled={status === 'loading'}
                  >
                    {editingProductId ? 'Update' : 'Simpan'}
                  </ChakraButton>
                </Flex>
              </VStack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ProductManagement