import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import NavbarCustomer from './NavbarCustomer'
import NavbarAdmin from './NavbarAdmin'

function Navbar({ onToggleSidebar }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const products = useAppSelector((state) => state.products.items)
  const categories = useAppSelector((state) => state.products.categories)
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)

  const role = user?.role ?? 'guest'

  if (role === 'admin') {
    return <NavbarAdmin user={user} dispatch={dispatch} onToggleSidebar={onToggleSidebar} />
  }

  return (
    <NavbarCustomer
      products={products}
      categories={categories}
      isMiniCartOpen={isMiniCartOpen}
      setIsMiniCartOpen={setIsMiniCartOpen}
      user={isAuthenticated ? user : null}
      dispatch={dispatch}
    />
  )
}

export default Navbar