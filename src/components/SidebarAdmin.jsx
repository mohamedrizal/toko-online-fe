import { useState } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'

const HomeIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

const MasterBarangIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="9" y1="9" x2="21" y2="9"></line>
  </svg>
)

const TransaksiIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const ChevronDownIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

function SidebarAdmin({ isOpen = true }) {
  const location = useLocation()
  const [isMasterBarangOpen, setIsMasterBarangOpen] = useState(true)
  const [isTransaksiOpen, setIsTransaksiOpen] = useState(false)
  
  const isActive = (path) => location.pathname === path
  const isMasterBarangActive = isActive('/product-management') || isActive('/category-management')
  const isTransaksiActive = isActive('/transactions') || isActive('/transactions/pending') || isActive('/transactions/complete')

  return (
    <Box 
      w="250px" 
      h="calc(100vh - 60px)" 
      bg="white" 
      borderRight="1px solid" 
      borderColor="gray.100" 
      py={6}
      px={4}
      display={{ base: 'none', md: 'block' }}
      boxShadow="4px 0 15px rgba(0, 0, 0, 0.08)"
      zIndex="10"
      transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'}
      marginLeft={isOpen ? '0' : '-250px'}
      transition="all 0.3s ease-in-out"
      opacity={isOpen ? 1 : 0}
    >
      <VStack align="stretch" gap={8}>
        {/* Dashboard Section */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={1} textTransform="uppercase">AWH</Text>
          <Text fontSize="xs" color="gray.500" mb={4}>Dashboard</Text>
          
          <NavLink to="/dashboard">
            <Flex 
              align="center" 
              padding="20px"
              borderRadius="8px"
              bg={isActive('/dashboard') ? 'blue.50' : 'transparent'} 
              color={isActive('/dashboard') ? 'blue.600' : 'gray.600'}
              _hover={{ bg: 'blue.50', color: 'blue.600' }}
              transition="all 0.2s"
              fontWeight={isActive('/dashboard') ? 'semibold' : 'normal'}
            >
              <HomeIcon style={{ marginRight: '12px' }} />
              <Text>Dashboard</Text>
            </Flex>
          </NavLink>
        </Box>

        {/* Pages Section */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={1} textTransform="uppercase">PAGES</Text>
          <Text fontSize="xs" color="gray.500" mb={4}>Prebuild Pages</Text>
          
          <VStack align="stretch" gap={2}>
            <Box>
              <Flex 
                as="button"
                w="100%"
                align="center" 
                justify="space-between"
                padding="20px"
                borderRadius="8px"
                border="none"
                cursor="pointer"
                bg={isMasterBarangActive ? 'blue.50' : 'transparent'} 
                color={isMasterBarangActive ? 'blue.600' : 'gray.600'}
                _hover={{ bg: 'blue.50', color: 'blue.600' }}
                transition="all 0.2s"
                fontWeight={isMasterBarangActive ? 'semibold' : 'normal'}
                onClick={() => setIsMasterBarangOpen(!isMasterBarangOpen)}
              >
                <Flex align="center">
                  <MasterBarangIcon style={{ marginRight: '12px' }} />
                  <Text>Master Barang</Text>
                </Flex>
                <ChevronDownIcon style={{ transform: isMasterBarangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </Flex>
              
              <Box 
                display={isMasterBarangOpen ? 'block' : 'none'}
                overflow="hidden"
                transition="all 0.3s ease-in-out"
              >
                <VStack align="stretch" pl={12} pr={4} py={2} gap={1}>
                  <NavLink to="/category-management">
                    <Text 
                      py={2} 
                      fontSize="sm" 
                      color={isActive('/category-management') ? 'blue.600' : 'gray.500'}
                      fontWeight={isActive('/category-management') ? 'semibold' : 'normal'}
                      _hover={{ color: 'blue.600' }}
                      transition="all 0.2s"
                    >
                      Kategori
                    </Text>
                  </NavLink>
                  <NavLink to="/product-management">
                    <Text 
                      py={2} 
                      fontSize="sm" 
                      color={isActive('/product-management') ? 'blue.600' : 'gray.500'}
                      fontWeight={isActive('/product-management') ? 'semibold' : 'normal'}
                      _hover={{ color: 'blue.600' }}
                      transition="all 0.2s"
                    >
                      Produk
                    </Text>
                  </NavLink>
                </VStack>
              </Box>
            </Box>

            <Box>
              <Flex 
                as="button"
                w="100%"
                align="center" 
                justify="space-between"
                padding="20px"
                borderRadius="8px"
                border="none"
                cursor="pointer"
                bg={isTransaksiActive ? 'blue.50' : 'transparent'} 
                color={isTransaksiActive ? 'blue.600' : 'gray.600'}
                _hover={{ bg: 'blue.50', color: 'blue.600' }}
                transition="all 0.2s"
                fontWeight={isTransaksiActive ? 'semibold' : 'normal'}
                onClick={() => setIsTransaksiOpen(!isTransaksiOpen)}
              >
                <Flex align="center">
                  <TransaksiIcon style={{ marginRight: '12px' }} />
                  <Text>Transaksi</Text>
                </Flex>
                <ChevronDownIcon style={{ transform: isTransaksiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </Flex>
              
              <Box 
                display={isTransaksiOpen ? 'block' : 'none'}
                overflow="hidden"
                transition="all 0.3s ease-in-out"
              >
                <VStack align="stretch" pl={12} pr={4} py={2} gap={1}>
                  <NavLink to="/transactions/pending">
                    <Text 
                      py={2} 
                      fontSize="sm" 
                      color={isActive('/transactions/pending') ? 'blue.600' : 'gray.500'}
                      fontWeight={isActive('/transactions/pending') ? 'semibold' : 'normal'}
                      _hover={{ color: 'blue.600' }}
                      transition="all 0.2s"
                    >
                      Transaksi Pending
                    </Text>
                  </NavLink>
                  <NavLink to="/transactions/complete">
                    <Text 
                      py={2} 
                      fontSize="sm" 
                      color={isActive('/transactions/complete') ? 'blue.600' : 'gray.500'}
                      fontWeight={isActive('/transactions/complete') ? 'semibold' : 'normal'}
                      _hover={{ color: 'blue.600' }}
                      transition="all 0.2s"
                    >
                      Transaksi Complete
                    </Text>
                  </NavLink>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default SidebarAdmin