import { Route, Routes } from 'react-router'
import { Header } from './components/Header'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductListingPage } from './pages/ProductListingPage'

/** Page layout and routes. The router itself is added in main.jsx (BrowserRouter) or in tests (MemoryRouter). */
export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
