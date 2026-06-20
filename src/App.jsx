import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { refreshAccessToken } from './features/auth/authSlice'
import { fetchUserCart } from './features/cart/cartSlice'
import ProductManagement from './features/products/ProductManagement'
import AuthPage from './pages/AuthPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminTransactions from './pages/AdminTransactions'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './routes/ProtectedRoute'
import './styles/App.css'

const AUTO_REFRESH_BUFFER_MS = 5 * 60 * 1000
const getDefaultRoute = (role) => (role === 'admin' ? '/dashboard' : '/')

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, accessToken, expiresIn, lastTokenRefreshAt } = useAppSelector((state) => state.auth)
  const role = user?.role ?? 'guest'

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !expiresIn) {
      return undefined
    }

    if (!lastTokenRefreshAt) {
      dispatch(refreshAccessToken())
      return undefined
    }

    const expiresAt = lastTokenRefreshAt + expiresIn * 1000
    const refreshDelay = Math.max(expiresAt - Date.now() - AUTO_REFRESH_BUFFER_MS, 0)
    const timeoutId = window.setTimeout(() => dispatch(refreshAccessToken()), refreshDelay)

    return () => window.clearTimeout(timeoutId)
  }, [dispatch, isAuthenticated, accessToken, expiresIn, lastTokenRefreshAt])

  useEffect(() => {
    if (isAuthenticated && accessToken && role === 'customer') {
      dispatch(fetchUserCart())
    }
  }, [dispatch, isAuthenticated, accessToken, role])

  return (
    <Box w="100%" minH="100vh" bg="#fff">
      <Navbar />
      <Box className='container' px={{ base: '4', md: '8' }} py="8" bg="white">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['customer', 'admin']}>
                <LandingPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={getDefaultRoute(role)} replace /> : <AuthPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                <AdminTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-management"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? getDefaultRoute(role) : '/login'} replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
