import { useEffect, useState } from 'react'
import { Box, Grid, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { productsApi } from '../../services/productsApi'
import { useAppSelector } from '../../app/hooks'

// --- Dummy Icons (Menggantikan gambar icon) ---
// Warna SVG kita set 'currentColor' agar bisa dikendalikan oleh properti color Box dari luar
const BroccoliIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M6.05 5.05l1.41 1.41M17.95 5.05l-1.41 1.41M4 12h2M18 12h2M6.05 18.95l1.41-1.41M17.95 18.95l-1.41-1.41M12 20v2"></path><circle cx="12" cy="12" r="4"></circle></svg>
const BreadIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
const BottleIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v4.26l-2.5 3.5C7.18 10.18 7 10.58 7 11v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V11c0-.42-.18-.82-.5-1.24L14 6.26V2H10z"></path><line x1="7" y1="15" x2="17" y2="15"></line></svg>
const WineIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8M7 10h10M12 15v7M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z"></path></svg>
const MeatIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 2.4 5.6a2.5 2.5 0 0 1-3.1 1.6 2.5 2.5 0 0 1-3.3 3.3 2.5 2.5 0 0 1-3.5-5.5z"></path></svg>
const JarIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 3h4a2 2 0 0 1 2 2v3H8V5a2 2 0 0 1 2-2z"></path><path d="M12 12v6"></path><path d="M9 15h6"></path></svg>

const DUMMY_ICONS = [
  { icon: <BroccoliIcon />, color: '#65a30d' }, // lime
  { icon: <BreadIcon />, color: '#d97706' },    // amber
  { icon: <BottleIcon />, color: '#fbbf24' },   // yellow
  { icon: <WineIcon />, color: '#be123c' },     // rose
  { icon: <MeatIcon />, color: '#ea580c' },     // orange
  { icon: <JarIcon />, color: '#84cc16' },      // lime lighter
]

function CategoryGrid({ onCategoryClick }) {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Ambil token dari Redux store
  const { accessToken } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Jika backend wajibkan login untuk ambil kategori, kita skip fetch jika tidak ada token
    if (!accessToken) {
      setIsLoading(false)
      setError('Silakan login untuk melihat kategori')
      return
    }

    let isMounted = true
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const response = await productsApi.getCategories('customer', accessToken)
        if (isMounted) {
          setCategories(response.data || [])
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Gagal memuat kategori')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
  }, [accessToken]) // fetch ulang jika token berubah

  if (error) {
    return (
      <Box py="8">
        <Heading size="lg" mb="6" color="gray.800">Category</Heading>
        <Text color="gray.500">{error}</Text>
      </Box>
    )
  }

  // Jika data masih kosong atau loading, kita buat 6 kotak kosong sebagai placeholder
  const displayItems = isLoading || categories.length === 0 
    ? Array.from({ length: 6 }) 
    : categories

  return (
    <Box mb="8">
      <Heading size="lg" mb="6" color="gray.800">Category</Heading>
      
      {/* Grid container responsif: 2 kolom (mobile), 3 kolom (tablet), 5 kolom (desktop) */}
      <Grid 
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }} 
        gap="6" 
        pb="4"
      >
        {displayItems.map((cat, index) => {
          // Ambil icon berurutan dari array DUMMY_ICONS (looping ulang jika habis)
          const dummyConfig = DUMMY_ICONS[index % DUMMY_ICONS.length]
          const isPlaceholder = !cat?.id

          return (
            <Flex
              key={isPlaceholder ? `placeholder-${index}` : cat.id}
              direction="column"
              align="center"
              justify="center"
              h="160px"
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
              cursor={isPlaceholder ? 'default' : 'pointer'}
              transition="all 0.2s"
              _hover={isPlaceholder ? {} : { transform: 'translateY(-4px)', boxShadow: 'md' }}
              opacity={isPlaceholder ? 0.6 : 1}
              onClick={() => {
                if (!isPlaceholder && onCategoryClick) {
                  onCategoryClick(cat.name)
                  
                  // Opsional: Scroll halus ke bagian ProductList setelah diklik
                  window.scrollBy({ top: 300, behavior: 'smooth' })
                }
              }}
            >
              <Box color={dummyConfig.color} mb="4">
                {dummyConfig.icon}
              </Box>
              <Text 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700" 
                textAlign="center"
              >
                {isPlaceholder ? 'Memuat...' : cat.name}
              </Text>
            </Flex>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CategoryGrid