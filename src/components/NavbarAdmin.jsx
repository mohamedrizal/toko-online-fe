import { Box, Flex, HStack, Text, Input } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { logout } from '../features/auth/authSlice'

const MenuIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

const SearchIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const BellIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
)

const UserIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

function NavbarAdmin({ user, dispatch, onToggleSidebar }) {
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (path) => {
    if (search.trim()) {
      navigate(`${path}?search=${encodeURIComponent(search.trim())}`)
      setShowSuggestions(false)
      setSearch('')
    }
  }

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

  return (
    <Box bg="#4C6FFF" color="white" py="3" px={{ base: '4', md: '8' }} boxShadow="sm">
      <Flex align="center" justify="space-between">
        <HStack gap="10px" justifyContent="space-between" minWidth="250px">
          {/* Logo Section */}
          <Flex direction="column" justify="center" mr={4}>
            <Flex align="baseline" gap={1}>
              <Text fontSize="2xl" fontWeight="bold" lineHeight="1" letterSpacing="tight">
                Admin Panel
              </Text>
            </Flex>
          </Flex>
          
          {/* Hamburger Menu */}
          <Box 
            as="button" 
            p="1" 
            bg="transparent"
            border="none"
            outline="none"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }} 
            borderRadius="md"
            cursor="pointer"
            title="Toggle Menu"
            onClick={onToggleSidebar}
          >
            <MenuIcon />
          </Box>
        </HStack>

        <HStack gap={{ base: 2, md: 6 }}>
          {/* Search Bar */}
          <Box position="relative" ref={wrapperRef}>
            <Flex align="center" bg="whiteAlpha.200" borderRadius="md" px="3" py="1.5" w={{ base: '150px', md: '300px', lg: '300px' }} _hover={{ bg: 'whiteAlpha.300' }} transition="all 0.2s">
              <SearchIcon color="whiteAlpha.800" />
              <Input 
                placeholder="Search..." 
                variant="unstyled" 
                ml={3} 
                color="white" 
                fontSize="sm"
                border="none"
                outline="none"
                bg="transparent"
                _placeholder={{ color: 'whiteAlpha.700' }} 
                _focus={{ outline: 'none' }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setShowSuggestions(e.target.value.trim().length > 0)
                }}
                onFocus={() => {
                  if (search.trim().length > 0) setShowSuggestions(true)
                }}
              />
            </Flex>

            {showSuggestions && (
              <Box position="absolute" top="100%" left="0" w="100%" bg="white" color="gray.800" mt={2} borderRadius="md" boxShadow="lg" zIndex={1000} overflow="hidden">
                <Flex direction="column">
                  <Box 
                    px={4} py={3} _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch('/product-management')}
                    borderBottom="1px solid" borderColor="gray.100"
                  >
                    <Text fontSize="sm">Cari "{search}" di <b>Produk</b></Text>
                  </Box>
                  <Box 
                    px={4} py={3} _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch('/category-management')}
                    borderBottom="1px solid" borderColor="gray.100"
                  >
                    <Text fontSize="sm">Cari "{search}" di <b>Category</b></Text>
                  </Box>
                  <Box 
                    px={4} py={3} _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch('/transactions/pending')}
                    borderBottom="1px solid" borderColor="gray.100"
                  >
                    <Text fontSize="sm">Cari "{search}" di <b>Transaksi Pending</b></Text>
                  </Box>
                  <Box 
                    px={4} py={3} _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch('/transactions/complete')}
                  >
                    <Text fontSize="sm">Cari "{search}" di <b>Transaksi Selesai</b></Text>
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>

          {/* Action Icons */}
          <HStack gap={2}>
            <Box 
              as="button" 
              _hover={{ bg: 'whiteAlpha.200' }} 
              p="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="30px"
              h="30px"
              bg="transparent"
              border="none"
              outline="none"
              borderRadius="full" 
              cursor="pointer"
              color="white"
            >
              <BellIcon />
            </Box>
            <Box 
              position="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <Box 
                as="button" 
                _hover={{ bg: 'whiteAlpha.200' }} 
                p="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="30px"
                h="30px"
                bg="transparent"
                border="none"
                outline="none"
                borderRadius="full" 
                cursor="pointer" 
                color="white"
              >
                <UserIcon />
              </Box>

              {/* Invisible bridge to prevent mouseleave gap */}
              {showUserMenu && <Box position="absolute" top="100%" left="0" w="100%" h="10px" zIndex={999} />}

              {showUserMenu && (
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
                >
                  <Flex direction="column">
                    <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                      <Text fontSize="sm" fontWeight="bold" color="gray.800">{user?.name || 'Admin'}</Text>
                      <Text fontSize="xs" color="gray.500">{user?.email || 'admin@toko.com'}</Text>
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
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}

export default NavbarAdmin