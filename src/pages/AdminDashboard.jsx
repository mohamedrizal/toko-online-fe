import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Button from '../components/Button'

function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user)
  const categories = useAppSelector((state) => state.products.categories)
  const items = useAppSelector((state) => state.products.items)

  return (
    <main className="page-stack">
      <section className="hero-panel authenticated-panel">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Halo, {user?.name}</h1>
          <p>{user?.email}</p>
        </div>

        <div className="summary-grid">
          <article className="summary-card">
            <strong>{categories.length}</strong>
            <span>Kategori Produk</span>
          </article>
          <article className="summary-card">
            <strong>{items.length}</strong>
            <span>Total Produk</span>
          </article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="section-head">
            <h2>Aksi Cepat</h2>
            <p className="muted-text">Masuk ke halaman manajemen data toko.</p>
          </div>
          <div className="inline-actions">
            <Link to="/transactions">
              <Button variant="secondary">Lihat Transaksi</Button>
            </Link>
            <Link to="/product-management">
              <Button>Kelola Product Management</Button>
            </Link>
          </div>
        </article>
      </section>
    </main>
  )
}

export default AdminDashboard