import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Flex, Text, Button as ChakraButton, Input, Spinner, Badge } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import DataTable from '../components/DataTable'
import { fetchAllOrders, updateOrderStatus } from '../features/order/orderSlice'

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)

const formatDate = (value) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

function AdminTransactionsPending() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { orders, meta, status, error } = useAppSelector((state) => state.order)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const itemsPerPage = 10

  // Filter khusus halaman ini
  const orderStatus = 'pending'

  // Sync search query if URL changes (from global search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    setSearchQuery(urlSearch)
    setDebouncedSearch(urlSearch)
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.toLowerCase())
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    dispatch(fetchAllOrders({ page: currentPage, perPage: itemsPerPage, status: orderStatus, search: debouncedSearch }))
  }, [dispatch, currentPage, debouncedSearch])

  useEffect(() => {
    if (error) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: error, confirmButtonColor: '#3182CE' })
    }
  }, [error])

  const handleCompleteOrder = (order) => {
    Swal.fire({
      title: 'Selesaikan transaksi?',
      text: `Order #${order.id} akan diubah menjadi completed.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, selesaikan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3182CE',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Memproses...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
        try {
          await dispatch(updateOrderStatus({ id: order.id, payload: { status: 'completed' } })).unwrap()
          await dispatch(fetchAllOrders({ page: currentPage, perPage: itemsPerPage, status: orderStatus, search: debouncedSearch })).unwrap()
          Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Status order berhasil diubah menjadi completed.', timer: 1500, showConfirmButton: false })
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: err || 'Gagal mengubah status order.' })
        }
      }
    })
  }

  const displayedOrders = orders.filter(o => o.status === 'pending')

  const columns = [
    {
      header: 'No',
      render: (_, __, index) => ((meta?.current_page || currentPage) - 1) * (meta?.per_page || itemsPerPage) + index + 1,
    },
    {
      header: 'Order ID',
      render: (order) => <Text fontWeight="bold">#{order.id}</Text>,
    },
    {
      header: 'Customer',
      render: (order) => (
        <Box>
          <Text fontWeight="bold">{order.user?.name || '-'}</Text>
          <Text fontSize="xs" color="gray.500">{order.user?.email || '-'}</Text>
        </Box>
      ),
    },
    {
      header: 'Item',
      render: (order) => (
        <Flex direction="column" gap={1}>
          {(order.items || []).map((item) => (
            <Text key={item.id} fontSize="sm">{item.product_name} <Text as="span" color="blue.500" fontWeight="bold">x{item.quantity}</Text></Text>
          ))}
        </Flex>
      ),
    },
    { header: 'Total', render: (order) => <Text fontWeight="semibold">{formatCurrency(order.total_price)}</Text> },
    { header: 'Status', render: (order) => <Badge colorScheme="orange" px={2} py={1} borderRadius="md">{order.status}</Badge> },
    { header: 'Tanggal', render: (order) => <Text fontSize="sm">{formatDate(order.created_at)}</Text> },
    {
      header: 'Aksi',
      render: (order) => (
        <ChakraButton size="sm" backgroundColor="blue.500" color="white" onClick={() => handleCompleteOrder(order)} disabled={status === 'loading'}>
          Ubah Ke Complete
        </ChakraButton>
      ),
    },
  ]

  return (
    <Box p={6} bg="gray.50" minH="calc(100vh - 60px)">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Transaksi Pending</Text>
          <Text color="gray.500" fontSize="sm">Daftar order pelanggan yang perlu diproses.</Text>
        </Box>
      </Flex>

      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" position="relative">
        <Flex gap={4} mb={6} flexWrap="wrap">
          <Input 
            placeholder="Cari nama atau email customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW={{ base: '100%', md: '300px' }}
            bg="white"
            border="1px solid" 
            borderColor="gray.300"
          />
        </Flex>

        {status === 'loading' && (
          <Flex position="absolute" top="0" left="0" w="100%" h="100%" bg="whiteAlpha.800" zIndex="10" align="center" justify="center" borderRadius="xl">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        )}
        
        <Box overflowX="auto">
          <DataTable 
            columns={columns} 
            data={displayedOrders} 
            keyField="id" 
            page={currentPage}
            totalPages={meta?.last_page || meta?.total_pages || 1}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminTransactionsPending