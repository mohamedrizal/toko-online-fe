import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SidebarAdmin from './components/SidebarAdmin'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { refreshAccessToken } from './features/auth/authSlice'
import { fetchUserCart } from './features/cart/cartSlice'
import ProductManagement from './features/products/ProductManagement'
import CategoryManagement from './features/category/CategoryManagement'
import AuthPage from './pages/AuthPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminTransactionsPending from './pages/AdminTransactionsPending'
import AdminTransactionsComplete from './pages/AdminTransactionsComplete'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './routes/ProtectedRoute'
import './styles/App.css'

const AUTO_REFRESH_BUFFER_MS = 5 * 60 * 1000
const getDefaultRoute = (role) => (role === 'admin' ? '/dashboard' : '/')

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, accessToken, expiresIn, lastTokenRefreshAt } = useAppSelector((state) => state.auth)
  const role = user?.role ?? 'guest'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
    <Box w="100%" minH="100vh" bg={role === 'admin' ? 'gray.50' : '#fff'}>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Flex className='main-content'>
        {isAuthenticated && role === 'admin' && <SidebarAdmin isOpen={isSidebarOpen} />}

        <Box  
          className={role === 'admin' ? 'admin-container' : 'container'} 
          px={role === 'admin' ? '0' : { base: '4', md: '8' }} 
          py={role === 'admin' ? '0' : '8'} 
          bg={role === 'admin' ? 'gray.50' : 'white'}
          flex={role === 'admin' ? '1' : 'none'}
          w="100%"
        >
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
              path="/transactions/pending"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                  <AdminTransactionsPending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions/complete"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                  <AdminTransactionsComplete />
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
            <Route
              path="/category-management"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} user={user} allowRoles={['admin']}>
                  <CategoryManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? getDefaultRoute(role) : '/login'} replace />} />
          </Routes>
        </Box>
      </Flex>
      {(!isAuthenticated || role === 'customer') && <Footer />}
    </Box>
  )
}

export default App
