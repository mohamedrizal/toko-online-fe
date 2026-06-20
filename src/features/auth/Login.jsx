import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Box, Button, Input, Stack, Text, Heading } from '@chakra-ui/react'
import { login, setAuthMode } from './authSlice'

function Login() {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(login(form))
  }

  return (
    <Box w="100%" maxW="md" bg="white" p={{ base: '6', md: '8' }} borderRadius="xl" boxShadow="sm" borderWidth="1px">
      <Stack gap="6">
        <Box textAlign="center">
          <Heading size="xl" mb="2">Login</Heading>
          <Text color="gray.500" fontSize="sm">Masuk menggunakan endpoint backend yang sudah Anda berikan.</Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap="4">
            <Box>
              <Text as="label" fontSize="sm" fontWeight="medium" mb="1.5" display="block">Email</Text>
              <Input
                type="email"
                value={form.email}
                placeholder="Masukkan email"
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

            {error && <Text color="red.500" fontSize="sm">{error}</Text>}

            <Button type="submit" colorPalette="brand" w="100%" disabled={status === 'loading'} mt="2">
              {status === 'loading' ? 'Memproses...' : 'Login'}
            </Button>

            <Button
              variant="ghost"
              color="brand.600"
              bg="transparent"
              w="100%"
              onClick={() => dispatch(setAuthMode('register'))}
            >
              Belum memiliki akun? Daftar disini
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  )
}

export default Login