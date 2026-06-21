import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useSearchParams } from 'react-router-dom'
import { Box, Flex, Text, Button as ChakraButton, Input, VStack, Spinner } from '@chakra-ui/react'
import Swal from 'sweetalert2'
import DataTable from '../../components/DataTable'
import Image from '../../components/Image'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../products/productSlice'

const initialCategoryForm = {
  name: '',
  icon: null,
  existingIcon: '',
}

function CategoryManagement() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { categories, status, error } = useAppSelector((state) => state.products)

  const [categoryForm, setCategoryForm] = useState(initialCategoryForm)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const fileInputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

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
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        confirmButtonColor: '#3182CE'
      })
    }
  }, [error])

  const resetCategoryForm = () => {
    setCategoryForm(initialCategoryForm)
    setEditingCategoryId(null)
    setIsModalOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (category) => {
    setEditingCategoryId(category.id)
    setCategoryForm({
      name: category.name,
      icon: null,
      existingIcon: category.icon || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmitCategory = async (event) => {
    event.preventDefault()
    
    const payload = new FormData()
    payload.append('name', categoryForm.name)
    
    if (categoryForm.icon instanceof File) {
      payload.append('icon', categoryForm.icon)
    }

    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      if (editingCategoryId) {
        await dispatch(updateCategory({ id: editingCategoryId, payload })).unwrap()
      } else {
        await dispatch(createCategory(payload)).unwrap()
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: editingCategoryId ? 'Kategori berhasil diupdate!' : 'Kategori berhasil ditambahkan!',
        timer: 1500,
        showConfirmButton: false
      })
      resetCategoryForm()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err || 'Terjadi kesalahan saat menyimpan kategori'
      })
    }
  }

  const handleDeleteCategory = (id, name) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Kategori "${name}" akan dihapus permanen! Produk yang terhubung dengan kategori ini mungkin juga akan terhapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Menghapus...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        })
        try {
          await dispatch(deleteCategory(id)).unwrap()
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Kategori berhasil dihapus.',
            timer: 1500,
            showConfirmButton: false
          })
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err || 'Terjadi kesalahan saat menghapus kategori.'
          })
        }
      }
    })
  }

  // Filter Kategori secara lokal
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(debouncedSearch)
  )

  const columns = [
    {
      header: 'No',
      render: (_, __, rowIndex) => rowIndex + 1
    },
    { 
      header: 'Icon', 
      render: (row) => (
        <Box w="40px" h="40px" borderRadius="md" overflow="hidden">
          {row.icon ? (
            <Image src={row.icon} alt={row.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Flex w="100%" h="100%" bg="gray.200" align="center" justify="center" color="gray.500" fontSize="xs">
              No Icon
            </Flex>
          )}
        </Box>
      ) 
    },
    { header: 'Nama Kategori', accessor: 'name' },
    { 
      header: 'Aksi', 
      render: (row) => (
        <Flex gap={2}>
          <ChakraButton size="sm" variant="outline" 
            bg="transparent"
            padding="0"
            border="none"
            color="blue.600" 
            onClick={() => handleEdit(row)}
          >
            Edit
          </ChakraButton>
          <ChakraButton size="sm" variant="outline" 
            bg="transparent" 
            padding="0"
            border="none"
            color="red.600" 
            onClick={() => handleDeleteCategory(row.id, row.name)}
          >
            Hapus
          </ChakraButton>
        </Flex>
      ) 
    }
  ]

  return (
    <Box p={6} bg="gray.50" minH="calc(100vh - 60px)">
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Category Management</Text>
          <Text color="gray.500" fontSize="sm">Kelola kategori untuk mengelompokkan produk Anda.</Text>
        </Box>
        <ChakraButton bg="blue.600" color="white" _hover={{ bg: 'blue.700' }} onClick={() => {
          resetCategoryForm()
          setIsModalOpen(true)
        }}>
          + Tambah Kategori
        </ChakraButton>
      </Flex>

      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" position="relative">
        <Flex gap={4} mb={6} flexWrap="wrap">
          <Input 
            placeholder="Cari nama atau deskripsi kategori..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW={{ base: '100%', md: '400px' }}
            bg="white"
            border="1px solid" 
            borderColor="gray.300"
          />
        </Flex>

        {status === 'loading' && (
          <Flex position="absolute" top="0" left="0" w="100%" h="100%" bg="whiteAlpha.800" zIndex="10" align="center" justify="center" borderRadius="xl">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        )}
        
        <Box overflowX="auto">
          <DataTable 
            columns={columns} 
            data={filteredCategories} 
            keyField="id" 
          />
        </Box>
      </Box>

      {/* Modal Overlay Tambah/Edit Kategori */}
      {isModalOpen && (
        <Box 
          position="fixed" 
          top="0" 
          left="0" 
          w="100vw" 
          h="100vh" 
          bg="blackAlpha.600" 
          zIndex="1400" 
          display="flex" 
          alignItems="center" 
          justify="center">
          <Box bg="white" p={6} borderRadius="xl" w="50vw" boxShadow="xl" margin="auto" maxH="90vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold">{editingCategoryId ? 'Edit Kategori' : 'Tambah Kategori'}</Text>
              <Box 
                as="button" 
                onClick={resetCategoryForm} 
                fontSize="25px" 
                fontWeight="bold" 
                bg="transparent" 
                border="none" 
                padding="0" 
                color="gray.500"
                _hover={{ color: 'gray.800' }}
                cursor="pointer"
              >
                &times;
              </Box>
            </Flex>

            <form onSubmit={handleSubmitCategory}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Nama Kategori</Text>
                  <Input 
                    type="text" 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    value={categoryForm.name} 
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))} 
                    required 
                  />
                </Box>

                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">Icon</Text>
                  <Input 
                    bg="gray.50"
                    border="1px solid" 
                    borderColor="gray.300"
                    outline="none"
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    p={1} 
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.files?.[0] || null }))} 
                  />
                  {categoryForm.icon && <Text fontSize="xs" color="gray.500" mt={1}>File dipilih: {categoryForm.icon.name}</Text>}
                  {editingCategoryId && categoryForm.existingIcon && (
                    <Box mt={2}>
                      <Text fontSize="xs" color="gray.500">Icon saat ini:</Text>
                      <Box w="60px" h="60px" borderRadius="md" overflow="hidden" mt={1}>
                        <Image src={categoryForm.existingIcon} alt={categoryForm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    </Box>
                  )}
                </Box>

                <Flex justify="flex-end" gap={3} mt={4}>
                  <ChakraButton variant="outline" type="button" onClick={resetCategoryForm} border="none">Batal</ChakraButton>
                  <ChakraButton 
                    bg="blue.600" 
                    color="white" 
                    _hover={{ bg: 'blue.700' }} 
                    type="submit" 
                    border="none"
                    disabled={status === 'loading'}
                  >
                    {editingCategoryId ? 'Update' : 'Simpan'}
                  </ChakraButton>
                </Flex>
              </VStack>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CategoryManagement