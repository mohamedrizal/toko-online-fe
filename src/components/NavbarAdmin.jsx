import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

function NavbarAdmin({ user, dispatch }) {
  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/transactions', label: 'Transaksi' },
    { to: '/product-management', label: 'Produk' },
  ]

  return (
    <Box borderBottomWidth="1px" borderColor="blue.700" bg="blue.600" color="white" py="3">
      <Box maxW="1200px" mx="auto" px={{ base: '4', md: '8' }}>
        <Flex align="center" justify="space-between">
          <HStack gap="8">
            <Text fontSize="xl" fontWeight="bold">Admin Panel</Text>
            <HStack gap="6" display={{ base: 'none', md: 'flex' }}>
              {adminLinks.map(link => (
                <NavLink key={link.to} to={link.to} style={({isActive}) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                  opacity: isActive ? 1 : 0.8,
                  textDecoration: 'none'
                })}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <HStack gap="4">
            <Text fontSize="sm">{user?.name}</Text>
            <Box as="button" px="3" py="1" fontSize="sm" borderWidth="1px" borderColor="whiteAlpha.400" borderRadius="md" _hover={{ bg: 'whiteAlpha.300' }} onClick={() => dispatch(logout())}>
              Logout
            </Box>
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
}

export default NavbarAdmin