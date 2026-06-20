import { useMemo, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Box, Flex, Text, VStack, HStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProducts } from '../products/productSlice'
import { fetchUserCart } from './cartSlice'
import { createOrder } from '../order/orderSlice'

const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace('Rp', 'Rp.')

function MiniCart({ isOpen, onClose }) {
  const dispatch = useAppDispatch()

  const cart = useAppSelector((state) => state.cart)
  const cartItems = useAppSelector((state) => cart.items)
  const products = useAppSelector((state) => state.products.items)

  const cartDetails = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.product_id)

        if (!product) {
          return null
        }

        const unitPrice = Number(product.price || 0)
        const totalPrice = unitPrice * item.quantity

        return {
          product_id: item.product_id,
          name: product.name,
          description: product.description || 'Brief description',
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        }
      })
      .filter(Boolean)
  }, [cartItems, products])

  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)
  const grandTotal = cartDetails.reduce((total, item) => total + item.totalPrice, 0)

  // Cegah scrolling background ketika MiniCart terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmitOrder = async () => {
    const cartId = cart.id

    if (!cartId) {
      await Swal.fire({
        icon: 'warning',
        title: 'Cart belum siap',
        text: 'Simpan cart terlebih dahulu sebelum checkout.',
        confirmButtonText: 'OK',
      })
      return
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Checkout Pesanan',
      html: `Customer akan checkout dengan metode pembayaran <b>cash</b>.<br/>Lanjutkan pesanan ini?`,
      showCancelButton: true,
      confirmButtonText: 'Ya, Bayar Cash',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      const response = await dispatch(createOrder({ cart_id: cartId })).unwrap()
      await Promise.all([
        dispatch(fetchUserCart()).unwrap(),
        dispatch(fetchProducts()).unwrap(),
      ])

      await Swal.fire({
        icon: 'success',
        title: 'Checkout berhasil',
        text: response?.message || 'Pesanan cash berhasil dibuat.',
        confirmButtonText: 'OK',
      })

      onClose?.()
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Checkout gagal',
        text: error || 'Pesanan tidak dapat diproses.',
        confirmButtonText: 'Tutup',
      })
    }
  }

  return (
    <Box 
      position="fixed" 
      top="0" 
      left="0" 
      w="100vw" 
      h="100vh" 
      zIndex="1000" 
      bg="blackAlpha.600" 
      onClick={onClose}
      padding="20px"
    >
      {/* Drawer Panel */}
      <Flex 
        direction="column" 
        position="absolute" 
        top="0" 
        right="0" 
        w={{ base: '100%', md: '360px' }} 
        h="100%" 
        bg="white" 
        boxShadow="-4px 0 15px rgba(0,0,0,0.1)"
        onClick={(e) => e.stopPropagation()}
        animation="slideInRight 0.3s ease-out"
        p="6"
      >
        {/* Header (Close Button) */}
        <Flex justify="center" mb="6">
          <Box 
            as="button" 
            onClick={onClose} 
            color="gray.400" 
            _hover={{ color: 'gray.600' }} 
            cursor="pointer"
            bg="transparent"
            border="none"
            padding="0" 
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Box>
        </Flex>

        {/* Title & Item Count */}
        <Flex 
          justify="space-between" 
          align="center" 
          borderBottom="2px solid #fafafa"
          pb="10px"
          mb="10px"
        >
          <Text fontSize="lg" fontWeight="bold" color="brand.300">Your cart</Text>
          <Flex align="center" justify="center" bg="brand.300" color="white" w="6" h="6" borderRadius="full" fontSize="xs" fontWeight="bold">
            {totalQuantity}
          </Flex>
        </Flex>

        {/* Cart Items List */}
        <Box 
          flex="1" 
          overflowY="auto" 
          css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' } }}
          maxHeight="max-content"
        >
          {cartDetails.length > 0 ? (
            <VStack align="stretch" gap="10px">
              {cartDetails.map((item, index) => (
                <Box key={item.product_id}>
                  <Flex justify="space-between" align="flex-start">
                    <VStack align="flex-start" gap="0">
                      <Text fontSize="sm" fontWeight="bold" color="gray.800">{item.name}</Text>
                      <Text fontSize="xs" color="gray.400">{item.description}</Text>
                    </VStack>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600" whiteSpace="nowrap" ml="4">
                      {formatCurrency(item.totalPrice)}
                    </Text>
                  </Flex>
                  {/* Garis pembatas manual sebagai pengganti Divider */}
                  {index < cartDetails.length - 1 && (
                    <Box h="1px" bg="gray.100" mt="5" w="100%" />
                  )}
                </Box>
              ))}
            </VStack>
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Text color="gray.400" fontSize="sm">Cart masih kosong.</Text>
            </Flex>
          )}
        </Box>

        {/* Footer (Total & Checkout) */}
        {cartDetails.length > 0 && (
          <Box pt="10px" mt="10px" borderTop="2px solid #fafafa">
            <Flex justify="space-between" align="center" mb="6">
              <Text fontSize="sm" color="gray.500">Total (Rp)</Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">{formatCurrency(grandTotal)}</Text>
            </Flex>
            <Box 
              as="button" 
              w="100%" 
              bg="brand.300" 
              color="white" 
              py="3" 
              borderRadius="md" 
              fontWeight="bold" 
              fontSize="sm"
              _hover={{ bg: 'brand.400' }}
              onClick={handleSubmitOrder}
              border="none"
              cursor="pointer"
            >
              Continue to checkout
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default MiniCart