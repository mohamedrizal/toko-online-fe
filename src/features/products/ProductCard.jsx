import { useEffect, useState } from 'react'
import { Box, Flex, Text, VStack, HStack, Image } from '@chakra-ui/react'
import Swal from 'sweetalert2'

function ProductCard({ product, categoryName, cartQuantity = 0, onAddToCart, onUpdateCart, onRemoveFromCart }) {
  const [quantity, setQuantity] = useState(cartQuantity || 1)

  useEffect(() => {
    setQuantity(cartQuantity || 1)
  }, [cartQuantity])

  if (!product) {
    return null
  }

  const price = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price).replace('Rp', 'Rp.') // Format Rp. 20.000

  const decrementQty = () => setQuantity((prev) => Math.max(prev - 1, 0))
  const incrementQty = () => setQuantity((prev) => Math.min(prev + 1, product.stock || 1))

  const isInCart = cartQuantity > 0
  const isRemoveAction = isInCart && quantity === 0

  const handleSubmitCart = async () => {
    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      if (isRemoveAction) {
        await onRemoveFromCart?.(product.id)
      } else if (isInCart) {
        await onUpdateCart?.(product.id, quantity)
      } else if (onAddToCart) {
        await onAddToCart(product, quantity)
      } else {
        window.alert(`${product.name} ditambahkan ke cart sebanyak ${quantity}`)
      }
      Swal.close()
      
      Swal.fire({
        title: 'Berhasil',
        text: 'Keranjang berhasil diperbarui',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      Swal.fire({
        title: 'Gagal',
        text: error?.message || 'Terjadi kesalahan saat memperbarui keranjang',
        icon: 'error',
      })
    }
  }

  return (
    <Flex 
      direction="column" 
      bg="white" 
      borderRadius="10px" 
      boxShadow="sm" 
      borderWidth="1px" 
      borderColor="gray.100"
      overflow="hidden"
      p="3"
    >
      {/* Image Container */}
      <Flex 
        bg="gray.50" 
        h="180px" 
        w="100%" 
        borderRadius="10px" 
        align="center" 
        justify="center"
        mb="4"
        overflow="hidden"
      >
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            objectFit="cover" 
            w="100%" 
            h="100%"
            fallback={<Text fontSize="4xl">🛍️</Text>}
          />
        ) : (
          <Text fontSize="4xl">🛍️</Text>
        )}
      </Flex>

      {/* Details */}
      <VStack align="flex-start" gap="1" px="1" mb="4">
        <Text fontSize="sm" color="gray.600" noOfLines={1} title={product.name}>
          {product.name}
        </Text>
        <Text fontSize="md" fontWeight="bold" color="gray.800">
          {price}
        </Text>
      </VStack>

      {/* Actions: Qty Control & Add to Cart */}
      <Flex justify="space-between" align="center" mt="auto">
        <HStack gap="3" color="gray.500">
          <Box 
            className="qty-control-btn"
            as="button" 
            onClick={decrementQty} 
            disabled={!isInCart ? quantity <= 1 : quantity <= 0} 
            cursor={(!isInCart && quantity <= 1) ? 'not-allowed' : 'pointer'} 
            _hover={{ color: 'gray.800' }}
          >
            <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <path d="M6 12L18 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
              </g>
            </svg>
          </Box>
          <Text fontSize="sm" color="gray.800">{quantity}</Text>
          <Box 
            className="qty-control-btn"
            as="button" 
            onClick={incrementQty} 
            disabled={quantity >= (product.stock || 1)} 
            cursor={quantity >= (product.stock || 1) ? 'not-allowed' : 'pointer'} 
            _hover={{ color: 'gray.800' }}
          >
            <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <path d="M4 12H20M12 4V20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
              </g>
            </svg>
          </Box>
        </HStack>

        <Box 
          as="button" 
          fontSize="xs" 
          fontWeight="medium" 
          bg="transparent"
          border="none"
          color="gray.400" 
          onClick={handleSubmitCart} 
          disabled={!product.stock || (!isInCart && quantity <= 0)}
          _hover={{ color: 'gray.800' }}
          cursor="pointer"
        >
          {isRemoveAction ? 'Remove' : isInCart ? 'Update Cart' : 'Add to Cart'}
        </Box>
      </Flex>
    </Flex>
  )
}

export default ProductCard