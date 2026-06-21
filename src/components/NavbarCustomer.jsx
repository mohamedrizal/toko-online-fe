import { useState, useRef, useEffect } from 'react'
import { Box, Flex, HStack, VStack, Text, Input } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import { useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { fetchProducts } from '../features/products/productSlice'
import MiniCart from '../features/cart/MiniCart'

const ChevronDownIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

function NavbarCustomer({ products, categories = [], isMiniCartOpen, setIsMiniCartOpen, user, dispatch }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const cartItems = useAppSelector((state) => state.cart.items)
  const cartTotal = useAppSelector((state) => state.cart.total_price) || 0

  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout())
      }
    })
  }

  const handleSearch = () => {
    const params = {}
    if (searchText.trim()) {
      params.search = searchText.trim()
    }
    
    if (selectedCategory !== 'All Categories') {
      const category = categories.find(c => c.name === selectedCategory)
      if (category) {
        params.category_id = category.id
      }
    }

    dispatch(fetchProducts(params))
  }

  const handleClearSearch = () => {
    setSearchText('')
    setSelectedCategory('All Categories')
    dispatch(fetchProducts({}))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box borderBottomWidth="1px" borderColor="gray.100" bg="white" py="4">
      <Box className="container" px={{ base: '4', md: '8' }}>
        <Flex align="center" justify="space-between" gap="4">
          {/* Logo Brand */}
          <Box cursor="pointer">
            <Text fontSize="3xl" fontWeight="900" color="#f59e0b" fontFamily="cursive" letterSpacing="tight" lineHeight="1" margin="0" onClick={() => window.location.href = '/'}>
              Kkomi<Box as="span" fontSize="sm" color="#fcd34d" fontWeight="normal" ml="1">®</Box>
            </Text>
            <Text fontSize="10px" color="gray.500" fontWeight="medium">Korean Cafe</Text>
          </Box>

          {user && (
            <Flex
              flex="1"
              maxW="600px"
              align="center"
              bg="gray.50"
              borderRadius="20px"
              px="20px"
              py="5px"
              display={{ base: 'none', md: 'flex' }}
            >
              <Box position="relative" ref={dropdownRef}>
                <Flex 
                  align="center" 
                  gap="2" 
                  borderRightWidth="1px" 
                  borderColor="gray.300" 
                  pr="4" 
                  mr="4"
                  cursor="pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <Text fontSize="sm" color="gray.600" noOfLines={1} maxW="100px">
                    {selectedCategory}
                  </Text>
                  <Box color="gray.600" transform={isCategoryOpen ? 'rotate(180deg)' : 'none'} transition="transform 0.2s">
                    <ChevronDownIcon />
                  </Box>
                </Flex>

                {/* Custom Dropdown Menu */}
                {isCategoryOpen && (
                  <Box 
                    position="absolute" 
                    top="100%" 
                    left="0" 
                    mt="4" 
                    w="200px" 
                    bg="white" 
                    borderRadius="xl" 
                    boxShadow="xl" 
                    borderWidth="1px" 
                    borderColor="gray.100"
                    py="2"
                    zIndex="10"
                  >
                    <Box 
                      px="4" py="2" cursor="pointer" fontSize="sm" color="gray.700" 
                      _hover={{ bg: 'brand.50', color: 'brand.600' }}
                      onClick={() => { setSelectedCategory('All Categories'); setIsCategoryOpen(false); }}
                    >
                      All Categories
                    </Box>
                    {categories.map((cat) => (
                      <Box 
                        key={cat.id} 
                        px="4" py="2" cursor="pointer" fontSize="sm" color="gray.700" 
                        _hover={{ bg: 'brand.50', color: 'brand.600' }}
                        onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }}
                      >
                        {cat.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Input
                variant="unstyled"
                placeholder="Search for more than 20,000 products"
                px="4"
                _placeholder={{ color: 'gray.400', fontSize: 'sm' }}
                flex="1"
                border="none"
                outline="none"
                bg="transparent"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {(searchText || selectedCategory !== 'All Categories') ? (
                <Box color="gray.400" cursor="pointer" _hover={{ color: 'red.500' }} onClick={handleClearSearch} title="Bersihkan Pencarian">
                  <CloseIcon />
                </Box>
              ) : (
                <Box color="gray.400" cursor="pointer" _hover={{ color: 'gray.600' }} onClick={handleSearch}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </Box>
              )}
            </Flex>
          )}

          <HStack gap="25px">
            <VStack gap="0" align="flex-end" display={{ base: 'none', lg: 'flex' }}>
              <Text fontSize="xs" color="gray.400" margin="0">For Support?</Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" margin="0">+980-34984089</Text>
            </VStack>

            {user && (
              <>
                <Box 
                  position="relative"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <Flex align="center" justifyContent="center" width="30px" height="30px" bg="gray.50" borderRadius="full" cursor="pointer" color="gray.700">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </Flex>

                  {isUserMenuOpen && <Box position="absolute" top="100%" left="0" w="100%" h="10px" zIndex={999} />}

                  {isUserMenuOpen && (
                    <Box 
                      position="absolute" 
                      top="calc(100% + 8px)" 
                      right="0" 
                      bg="white" 
                      borderRadius="md" 
                      boxShadow="lg" 
                      minW="180px"
                      zIndex={1000}
                      overflow="hidden"
                      border="1px solid"
                      borderColor="gray.100"
                    >
                      <Flex direction="column">
                        <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                          <Text fontSize="sm" fontWeight="bold" color="gray.800">{user?.name || 'Customer'}</Text>
                          <Text fontSize="xs" color="gray.500">{user?.email || 'customer@toko.com'}</Text>
                        </Box>
                        <Box 
                          as="button"
                          px={4} 
                          py={3} 
                          textAlign="left"
                          fontSize="sm" 
                          color="red.500"
                          _hover={{ bg: 'gray.50' }}
                          onClick={handleLogout}
                          w="100%"
                          bg="transparent"
                          border="none"
                          cursor="pointer"
                        >
                          Logout
                        </Box>
                      </Flex>
                    </Box>
                  )}
                </Box>

                <Flex align="center" gap="3" cursor="pointer" onClick={() => setIsMiniCartOpen(true)}>
                  <VStack gap="0" align="flex-end">
                    <Flex align="center" gap="1">
                      <Text fontSize="xs" color="gray.400" margin="0">Your Cart</Text>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </Flex>
                    <Text fontSize="sm" fontWeight="bold" color="gray.800" margin="0">
                      Rp. {cartTotal.toLocaleString('id-ID')}
                    </Text>
                  </VStack>
                </Flex>
              </>
            )}
          </HStack>
        </Flex>
      </Box>
      {user && <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />}
    </Box>
  )
}

export default NavbarCustomer