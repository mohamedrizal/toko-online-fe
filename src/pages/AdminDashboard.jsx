import { useAppSelector, useAppDispatch } from '../app/hooks'
import { Box, Flex, SimpleGrid, GridItem, Text, VStack, HStack, Grid, Button, Spinner } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import StatCard from '../components/StatCard'
import { fetchDashboardData } from '../features/dashboard/dashboardSlice'
import { fetchProducts } from '../features/products/productSlice'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const MoneyIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
    <path d="M12 18V6"></path>
  </svg>
)

const BoxIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
)

const DocumentIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
)

const ThumbUpIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
)

function AdminDashboard() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.products.categories)
  const items = useAppSelector((state) => state.products.items)
  const productsStatus = useAppSelector((state) => state.products.status)
  
  const { data: dashboardData, status: dashboardStatus } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    if (dashboardStatus === 'idle') {
      dispatch(fetchDashboardData())
    }
  }, [dashboardStatus, dispatch])

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts())
    }
  }, [productsStatus, dispatch])

  const lowStockItems = [...items]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)

  return (
    <Box p={6} bg="gray.50" minH="calc(100vh - 60px)">
      {dashboardStatus === 'loading' || productsStatus === 'loading' ? (
        <Flex justify="center" align="center" h="60vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : (
        <>
          {/* Top Stat Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={6}>
            <StatCard 
              title="Total Semua Pendapatan" 
              value={`Rp. ${(dashboardData?.total_revenue || 0).toLocaleString('id-ID')}`} 
              color="orange" 
              icon={MoneyIcon} 
            />
          <StatCard 
            title="Stok Barang" 
            value={dashboardData?.total_stock || items.length || 0} 
            color="red" 
            icon={BoxIcon} 
          />
          <StatCard 
            title="Barang Telah Terjual" 
            value={`${dashboardData?.total_sold || 0}+`} 
            color="green" 
            icon={DocumentIcon} 
          />
            <StatCard 
              title="Kategori Barang" 
              value={dashboardData?.total_category || categories.length || 0} 
              color="blue" 
              icon={ThumbUpIcon} 
            />
          </SimpleGrid>

          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <Box borderRadius="xl" boxShadow="sm" overflow="hidden" h="max-content" mb="30px">
                <Box bg="blue.500" p={6} color="white" position="relative" h="200px">
                  <Flex justify="space-between" mb={4}>
                    <Text fontWeight="medium" fontSize="lg">Penjualan per Bulan</Text>
                  </Flex>

                  <Box position="absolute" bottom="-10px" left="-5px" right="-5px" h="130px">
                    {dashboardData?.sales_chart && (
                      <Line 
                        data={{
                          labels: dashboardData.sales_chart.labels,
                          datasets: [
                            {
                              data: dashboardData.sales_chart.data,
                              borderColor: 'white',
                              borderWidth: 2,
                              tension: 0.4,
                              pointRadius: 0,
                              pointHoverRadius: 4,
                              pointBackgroundColor: 'white',
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => `Rp. ${context.raw.toLocaleString('id-ID')}`
                              }
                            }
                          },
                          scales: {
                            x: { display: false },
                            y: { display: false, min: 0 }
                          },
                          layout: { padding: 0 }
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Flex p={6} borderBottom="1px solid" borderColor="gray.100" textAlign="center" align="center">
                  <Box flex={1} borderRight="1px solid" borderColor="gray.100">
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">Rp. {(dashboardData?.today_revenue || 0).toLocaleString('id-ID')}</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>Total Pendapatan Hari ini</Text>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.800">{dashboardData?.today_transactions || 0}</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>Transaksi</Text>
                  </Box>
                </Flex>
              </Box>

              <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                <Flex p={5} textAlign="center" fontSize="sm" bg="gray.50">
                  <Box flex={1} borderRight="1px solid" borderColor="gray.200">
                    <Text as="span" color="gray.600">Stok Habis </Text>
                    <Text as="span" color="red.500" fontWeight="bold" ml={2}>{dashboardData?.out_of_stock || 0}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text as="span" color="gray.600">Barang Terjual </Text>
                    <Text as="span" color="green.500" fontWeight="bold" ml={2}>{dashboardData?.total_sold || 0}</Text>
                  </Box>
                </Flex>
              </Box>

          </GridItem>

          <GridItem colSpan={{ base: 1, lg: 1 }}>
            <Box bg="white" borderRadius="xl" boxShadow="sm" h="100%">
              <Flex p={6} justify="space-between" align="center" pb={4} borderBottom="1px solid" borderColor="gray.300">
                <Text fontWeight="bold" fontSize="lg" color="gray.800">Best Seller</Text>
              </Flex>
              <Flex justify="center" align="center" h="180px" p={6} mb={6}>

                {dashboardData?.best_sellers && (
                  <Doughnut 
                    data={{
                      labels: dashboardData.best_sellers.labels,
                      datasets: [
                        {
                          data: dashboardData.best_sellers.data,
                          backgroundColor: ['#F56565', '#4299E1', '#48BB78', '#ED8936', '#9F7AEA'],
                          borderWidth: 0,
                          cutout: '75%',
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      }
                    }}
                  />
                )}
              </Flex>
              
              <HStack justify="center" gap={4} fontSize="sm" color="gray.600" mb={6} flexWrap="wrap">
                {dashboardData?.best_sellers?.labels.map((label, index) => {
                  const colors = ['red.400', 'blue.400', 'green.400', 'orange.400', 'purple.400']
                  return (
                    <Flex align="center" key={index}>
                      <Box w={3} h={3} borderRadius="full" bg={colors[index % colors.length]} mr={2}/>
                      {label}
                    </Flex>
                  )
                })}
              </HStack>
              
              <Box borderTop="1px solid" borderColor="gray.100" p={6}>
                <Flex justify="space-between" textAlign="center">
                  {dashboardData?.best_sellers?.labels.slice(0, 3).map((label, index) => {
                    const colors = ['blue.500', 'teal.500', 'yellow.500']
                    return (
                      <Box key={index}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.800">{label}</Text>
                        <Text fontSize="md" color={colors[index % colors.length]} mt={1}>
                          {dashboardData.best_sellers.data[index]}
                        </Text>
                      </Box>
                    )
                  })}
                </Flex>
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 1, lg: 1 }}>
            <Box bg="white" borderRadius="xl" boxShadow="sm" h="100%">
              <Flex p={6} justify="space-between" align="center" pb={4} borderBottom="1px solid" borderColor="gray.300">
                <Text fontWeight="bold" fontSize="lg" color="gray.800">Stok Barang (Terendah)</Text>
                <Button as={Link} to="/product-management" size="sm" variant="outline" padding="0" color="blue.500" _hover={{ color: 'blue.600' }} bg="transparent">
                  Lihat Detail
                </Button>
              </Flex>
              <VStack p={6} align="stretch" gap={5}>
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => {

                    const percentage = Math.min((item.stock / 100) * 100, 100)
                    const barColor = item.stock < 10 ? 'red.500' : item.stock < 30 ? 'orange.400' : 'blue.500'

                    return (
                      <Box key={item.id}>
                        <Flex justify="space-between" fontSize="sm" mb={2}>
                          <Text color="gray.700" fontWeight="medium" noOfLines={1} title={item.name}>
                            {item.name}
                          </Text>
                          <Text color={item.stock < 10 ? 'red.500' : 'gray.500'} fontWeight={item.stock < 10 ? 'bold' : 'normal'}>
                            {item.stock}
                          </Text>
                        </Flex>
                        <Box w="100%" bg="gray.100" h="6px" borderRadius="full">
                          <Box w={`${percentage}%`} bg={barColor} h="100%" borderRadius="full" transition="width 0.3s ease-in-out" />
                        </Box>
                      </Box>
                    )
                  })
                ) : (
                  <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>Belum ada data barang.</Text>
                )}
              </VStack>
            </Box>
          </GridItem>
      </Grid>
        </>
      )}
    </Box>
  )
}

export default AdminDashboard