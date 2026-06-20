import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import { fetchAllOrders, updateOrderStatus } from '../features/order/orderSlice'

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)

const formatDate = (value) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

function AdminTransactions() {
  const dispatch = useAppDispatch()
  const { orders, meta, status, error } = useAppSelector((state) => state.order)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 1
  const totalPages = meta?.last_page || 1

  useEffect(() => {
    dispatch(fetchAllOrders({ page: currentPage, perPage: itemsPerPage }))
  }, [dispatch, currentPage])

  const handleCompleteOrder = async (order) => {
    const result = await Swal.fire({
      title: 'Selesaikan transaksi?',
      text: `Order #${order.id} akan diubah menjadi completed.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, selesaikan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      const response = await dispatch(
        updateOrderStatus({
          id: order.id,
          payload: { status: 'completed' },
        }),
      ).unwrap()

      await dispatch(fetchAllOrders({ page: currentPage, perPage: itemsPerPage })).unwrap()

      await Swal.fire({
        title: 'Berhasil',
        text: response?.message || 'Status order berhasil diubah menjadi completed.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      })
    } catch (error) {
      await Swal.fire({
        title: 'Gagal',
        text: error || 'Gagal mengubah status order.',
        icon: 'error',
        confirmButtonColor: '#2563eb',
      })
    }
  }

  const columns = [
    {
      header: 'No',
      render: (_, __, index) =>
        ((meta?.current_page || currentPage) - 1) * (meta?.per_page || itemsPerPage) + index + 1,
    },
    {
      header: 'Customer',
      render: (order) => (
        <div className="table-cell-stack">
          <strong>{order.user?.name || '-'}</strong>
          <span>{order.user?.email || '-'}</span>
        </div>
      ),
    },
    {
      header: 'Item',
      render: (order) => (
        <div className="table-cell-stack">
          {(order.items || []).map((item) => (
            <span key={item.id}>{item.product_name} x{item.quantity}</span>
          ))}
        </div>
      ),
    },
    {
      header: 'Total',
      render: (order) => formatCurrency(order.total_price),
    },
    {
      header: 'Status',
      render: (order) => <span className={`status-pill status-${order.status}`}>{order.status}</span>,
    },
    {
      header: 'Tanggal',
      render: (order) => formatDate(order.created_at),
    },
    {
      header: 'Aksi',
      render: (order) =>
        order.status !== 'completed' ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleCompleteOrder(order)}
            disabled={status === 'loading'}
          >
            Complete
          </Button>
        ) : (
          <span className="status-pill status-success">Selesai</span>
        ),
    },
  ]

  return (
    <main className="page-stack">
      <section className="hero-panel authenticated-panel">
        <div>
          <span className="eyebrow">Transaksi</span>
          <h1>Daftar Order Admin</h1>
          <p>Monitoring transaksi pelanggan dan daftar order yang masuk dari backend admin.</p>
        </div>
        <div className="summary-grid">
          <article className="summary-card">
            <strong>{meta?.total || orders.length}</strong>
            <span>Total Order</span>
          </article>
          <article className="summary-card">
            <strong>{currentPage}</strong>
            <span>Halaman Aktif</span>
          </article>
        </div>
      </section>

      <section className="page-stack">
        <article className="panel">
          <div className="inline-actions">
            <Link to="/dashboard"><Button variant="secondary">Kembali ke Dashboard</Button></Link>
            <Link to="/product-management"><Button>Kelola Produk</Button></Link>
          </div>
        </article>

        <article className="panel">
          <div className="section-head">
            <h2>List Order</h2>
          </div>
          {status === 'loading' ? <p className="muted-text">Memuat daftar order...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          {!orders.length && status !== 'loading' ? <p className="muted-text">Belum ada order untuk ditampilkan.</p> : null}
          {orders.length ? <DataTable columns={columns} data={orders} keyField="id" /> : null}
          {orders.length ? (
            <div className="pagination-bar">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <span className="pagination-text">Page {meta?.current_page || currentPage} / {totalPages}</span>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={(meta?.current_page || currentPage) >= totalPages}
              >
                Next
              </Button>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default AdminTransactions