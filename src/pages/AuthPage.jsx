import { useAppSelector } from '../app/hooks'
import { Flex } from '@chakra-ui/react'
import Login from '../features/auth/Login'
import Register from '../features/auth/Register'

function AuthPage() {
  const authMode = useAppSelector((state) => state.auth.authMode)

  return (
    <Flex minH="60vh" align="center" justify="center" px="4">
      {authMode === 'login' ? <Login /> : <Register />}
    </Flex>
  )
}

export default AuthPage