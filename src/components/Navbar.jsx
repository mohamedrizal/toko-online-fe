import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import NavbarCustomer from './NavbarCustomer'
import NavbarAdmin from './NavbarAdmin'

function Navbar() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const cartItems = useAppSelector((state) => state.cart.items)
  const products = useAppSelector((state) => state.products.items)
  const categories = useAppSelector((state) => state.products.categories)
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)

  const role = user?.role ?? 'guest'

  if (role === 'admin') {
    return <NavbarAdmin user={user} dispatch={dispatch} />
  }

  return (
    <NavbarCustomer
      cartItems={cartItems}
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