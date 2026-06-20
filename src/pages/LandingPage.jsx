import { useState } from 'react'
import { useAppSelector } from '../app/hooks'
import ProductList from '../features/products/ProductList'
import CategoryGrid from '../features/category/CategoryGrid'

function LandingPage() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { searchQuery } = useAppSelector((state) => state.products)
  const role = user?.role ?? 'guest'

  const [activeTab, setActiveTab] = useState('ALL')

  return (
    <main className="page-stack">
      {!searchQuery && (
        <CategoryGrid onCategoryClick={(categoryName) => setActiveTab(categoryName.toUpperCase())} />
      )}

      <ProductList activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}

export default LandingPage