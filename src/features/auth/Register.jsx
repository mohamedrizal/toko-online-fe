import { useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { Box, Button, Input, Stack, Text, Heading } from '@chakra-ui/react'
import { setAuthMode } from './authSlice'

const initialForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'customer',
}

function Register() {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState(initialForm)
  const [notice, setNotice] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice(
      'Struktur register sudah siap. Tinggal sambungkan ke endpoint backend register.',
    )
  }

  return (
    <Box w="100%" maxW="md" bg="white" p={{ base: '6', md: '8' }} borderRadius="xl" boxShadow="sm" borderWidth="1px">
      <Stack gap="6">
        <Box textAlign="center">
          <Heading size="xl" mb="2">Register</Heading>
          <Text color="gray.500" fontSize="sm">Komponen ini disiapkan sebagai placeholder feature berikutnya.</Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Box>
              <Text as="label" fontSize="sm" fontWeight="medium" mb="1.5" display="block">Nama</Text>
              <Input
                type="text"
                value={form.name}
                placeholder="Jhon Doe"
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                bg="gray.50"
                border="none"
                outline="none"
              />
            </Box>

            <Box>
              <Text as="label" fontSize="sm" fontWeight="medium" mb="1.5" display="block">Email</Text>
              <Input
                type="email"
                value={form.email}
                placeholder="jhon.doe@example.com"
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                bg="gray.50"
                border="none"
                outline="none"
              />
            </Box>

            <Box>
              <Text as="label" fontSize="sm" fontWeight="medium" mb="1.5" display="block">Password</Text>
              <Input
                type="password"
                value={form.password}
                placeholder="Masukkan password"
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
                bg="gray.50"
                border="none"
                outline="none"
              />
            </Box>

            <Box>
              <Text as="label" fontSize="sm" fontWeight="medium" mb="1.5" display="block">Konfirmasi Password</Text>
              <Input
                type="password"
                value={form.password_confirmation}
                placeholder="Masukkan konfirmasi password"
                onChange={(event) => setForm((prev) => ({ ...prev, password_confirmation: event.target.value }))}
                required
                bg="gray.50"
                border="none"
                outline="none"
              />
            </Box>

            {notice && <Text color="brand.500" fontSize="sm" textAlign="center">{notice}</Text>}

            <Button type="submit" colorPalette="brand" w="100%" mt="2">
              Simpan Draft Register
            </Button>

            <Button
              variant="ghost"
              color="brand.600"
              w="100%"
              bg="transparent"
              onClick={() => dispatch(setAuthMode('login'))}
            >
              Kembali ke login
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default Register