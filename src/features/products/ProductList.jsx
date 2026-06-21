import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Box, Flex, Grid, Heading, Text, HStack, Button } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import { saveCart } from '../cart/cartSlice'
import { fetchCategories, fetchProducts } from './productSlice'
import ProductCard from './ProductCard'

function ProductList({ activeTab = 'ALL', setActiveTab }) {
  const dispatch = useAppDispatch()
  const { items, categories, status, searchQuery, meta } = useAppSelector((state) => state.products)
  const cartItems = useAppSelector((state) => state.cart.items)

  useEffect(() => {
    if (searchQuery && activeTab !== 'ALL') {
      setActiveTab('ALL')
    }
  }, [searchQuery, activeTab, setActiveTab])

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  useEffect(() => {
    if (!searchQuery) {
      const params = {}
      if (activeTab !== 'ALL') {
        const category = categories.find((c) => c.name.toUpperCase() === activeTab)
        if (category) {
          params.category_id = category.id
        }
      }
      dispatch(fetchProducts(params))
    }
  }, [dispatch, activeTab, categories, searchQuery])

  const handlePageChange = (newPage) => {
    const params = { page: newPage }
    if (searchQuery) params.search = searchQuery
    if (activeTab !== 'ALL' && categories.length) {
      const category = categories.find((c) => c.name.toUpperCase() === activeTab)
      if (category) params.category_id = category.id
    }
    dispatch(fetchProducts(params))
  }

  useEffect(() => {
    if (status === 'loading') {
      Swal.fire({
        title: 'Memuat produk...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
    } else if (status === 'succeeded' || status === 'failed') {
      Swal.close()
    }
  }, [status])

  const handleAddToCart = (product, quantity) => {
    const existingItem = cartItems.find((item) => item.product_id === product.id)
    const nextItems = existingItem
      ? cartItems.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...cartItems, { product_id: product.id, quantity }]

    return dispatch(saveCart(nextItems)).unwrap()
  }

  const handleUpdateCart = (productId, quantity) => {
    const nextItems = cartItems.map((item) =>
      item.product_id === productId ? { ...item, quantity } : item,
    )
    return dispatch(saveCart(nextItems)).unwrap()
  }

  const handleRemoveFromCart = (productId) => {
    return dispatch(saveCart(cartItems.filter((item) => item.product_id !== productId))).unwrap()
  }

  const tabs = ['ALL', ...categories.slice(0, 2).map(cat => cat.name.toUpperCase())]

  const displayedItems = items || []

  return (
    <Box pb="8">
      {/* Header & Tabs */}
      <Flex 
        className='TabWrap'
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        mb="8"
        gap="4"
      >
        <Heading size="lg" color="gray.800" margin="0">
          {searchQuery ? `Hasil pencarian: ${searchQuery}` : 'Barang'}
        </Heading>
        {!searchQuery && (
          <HStack gap="6">
            {tabs.map((tab) => (
              <Text
                className='TabItem'
                key={tab}
                fontSize="sm"
                fontWeight={activeTab === tab ? 'bold' : 'medium'}
                color={activeTab === tab ? 'gray.800' : 'gray.400'}
                cursor="pointer"
                pb="10px"
                margin="0"
                borderBottom="solid"
                borderBottomWidth="2px"
                borderColor={activeTab === tab ? 'brand.500' : 'transparent'}
                _hover={{ color: 'gray.800' }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Text>
            ))}
          </HStack>
        )}
      </Flex>

      {!displayedItems.length && status !== 'loading' && <Text color="gray.500" mb="4">Belum ada produk untuk ditampilkan pada kategori ini.</Text>}
      
      {/* Product Grid */}
      <Grid 
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }} 
        gap="20px"
      >
        {displayedItems.map((product) => {
          const category = categories.find(
            (item) => item.id === (product.category_id || product.categoryId || product.category?.id),
          )
          const cartItem = cartItems.find((item) => item.product_id === product.id)
          
          return (
            <ProductCard 
              key={product.id} 
              product={product} 
              categoryName={category?.name || product.category?.name || '-'} 
              cartQuantity={cartItem?.quantity || 0} 
              onAddToCart={handleAddToCart} 
              onUpdateCart={handleUpdateCart} 
              onRemoveFromCart={handleRemoveFromCart} 
            />
          )
        })}
      </Grid>

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <Flex justify="center" align="center" mt="8" gap="4">
          <Button 
            onClick={() => handlePageChange(meta.current_page - 1)} 
            isDisabled={meta.current_page === 1}
            colorScheme="brand"
            variant="outline"
            size="sm"
            bg="transparent"
            padding="0"
            border="none"
            cursor="pointer"
            _hover={{ color: 'brand.400' }}
          >
            Previous
          </Button>
          <Text fontSize="sm" fontWeight="medium" color="gray.400">
            Page {meta.current_page} of {meta.last_page}
          </Text>
          <Button 
            onClick={() => handlePageChange(meta.current_page + 1)} 
            isDisabled={meta.current_page === meta.last_page}
            colorScheme="brand"
            variant="outline"
            size="sm"
            bg="transparent"
            padding="0"
            border="none"
            cursor="pointer"
            _hover={{ color: 'brand.400' }}
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  )
}

export default ProductList