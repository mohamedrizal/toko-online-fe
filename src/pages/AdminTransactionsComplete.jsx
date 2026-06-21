import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Flex, Text, Input, Spinner, Badge } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import DataTable from '../components/DataTable'
import { fetchAllOrders } from '../features/order/orderSlice'

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)

const formatDate = (value) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

function AdminTransactionsComplete() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { orders, meta, status, error } = useAppSelector((state) => state.order)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const itemsPerPage = 10

  // Filter khusus halaman ini
  const orderStatus = 'completed'

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

  // Filter lokal sebagai fallback jika API tidak memfilter status
  const displayedOrders = orders.filter(o => o.status === 'completed')

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
    { header: 'Status', render: (order) => <Badge backgroundColor="green.500" color="white" px={2} py={1} borderRadius="md">Selesai</Badge> },
    { header: 'Tanggal', render: (order) => <Text fontSize="sm">{formatDate(order.created_at)}</Text> },
  ]

  return (
    <Box p={6} bg="gray.50" minH="calc(100vh - 60px)">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Transaksi Selesai</Text>
          <Text color="gray.500" fontSize="sm">Daftar histori order yang sudah berhasil diproses.</Text>
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
            <Spinner size="xl" color="green.500" thickness="4px" />
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

export default AdminTransactionsComplete