import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearFetchCache } from './hooks/useFetch'

const categories = [
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
]

const phone = (id, title, price, brand) => ({
  id,
  title,
  price,
  brand,
  rating: 4.5,
  thumbnail: `https://example.com/${id}.png`,
  category: 'smartphones',
})

// 14 Apple phones + 1 Samsung phone = 15 products, so there are 2 pages of 12.
const phones = [
  ...Array.from({ length: 14 }, (_, i) => phone(i + 1, `iPhone ${i + 1}`, 100 + i * 50, 'Apple')),
  phone(15, 'Galaxy S8', 499, 'Samsung'),
]

const detail = {
  ...phone(1, 'iPhone 1', 100, 'Apple'),
  description: 'A great phone.',
  discountPercentage: 0,
  stock: 5,
  images: ['https://example.com/1-big.png'],
  reviews: [],
}

/** A fake `fetch` that answers like DummyJSON for the URLs the app uses. */
function mockApi() {
  return vi.fn(async (input) => {
    const url = new URL(String(input))
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status })

    if (url.pathname === '/products/categories') return json(categories)
    if (url.pathname === '/products/category/smartphones' || url.pathname === '/products') {
      return json({ products: phones, total: phones.length, skip: 0, limit: 0 })
    }
    if (url.pathname === '/products/1') return json(detail)
    return json({ message: 'not found' }, 404)
  })
}

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

const productNames = () =>
  within(screen.getByRole('region', { name: /products|smartphones/i }))
    .queryAllByRole('heading', { level: 2 })
    .map((h) => h.textContent)

beforeEach(() => {
  clearFetchCache()
  vi.stubGlobal('fetch', mockApi())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Product listing', () => {
  it('shows a loading state, then the first page of products', async () => {
    renderApp()
    expect(screen.getByRole('status', { name: /loading products/i })).toBeInTheDocument()

    expect(await screen.findByText('Showing 1–12 of 15 products')).toBeInTheDocument()
    expect(productNames()).toHaveLength(12)
  })

  it('combines brand and price filters and resets to page 1', async () => {
    const user = userEvent.setup()
    renderApp('/?page=2')
    expect(await screen.findByText('Showing 13–15 of 15 products')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /apple/i }))
    expect(await screen.findByText('Showing 1–12 of 14 products')).toBeInTheDocument()

    await user.type(screen.getByRole('spinbutton', { name: /maximum price/i }), '200')
    // iPhone 1 ($100), iPhone 2 ($150), iPhone 3 ($200); the Samsung phone is excluded by brand.
    // The price box is debounced (400 ms), so allow extra time on a slow machine.
    expect(await screen.findByText('Showing 1–3 of 3 products', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(productNames()).toEqual(['iPhone 1', 'iPhone 2', 'iPhone 3'])
  })

  it('shows an error with a retry button when the request fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    renderApp()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/could not load products/i)

    vi.stubGlobal('fetch', mockApi())
    await user.click(within(alert).getByRole('button', { name: /try again/i }))
    expect(await screen.findByText('Showing 1–12 of 15 products')).toBeInTheDocument()
  })
})

describe('Product detail', () => {
  it('opens from a card and Back returns with the filters still applied', async () => {
    const user = userEvent.setup()
    renderApp('/?brand=Apple')
    expect(await screen.findByText('Showing 1–12 of 14 products')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /iphone 1\b/i }))
    expect(await screen.findByRole('heading', { level: 1, name: 'iPhone 1' })).toBeInTheDocument()
    expect(screen.getByText('A great phone.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back to products/i }))
    await waitFor(() => expect(screen.getByText('Showing 1–12 of 14 products')).toBeInTheDocument())
    expect(screen.getByRole('checkbox', { name: /apple/i })).toBeChecked()
  })

  it('shows "Product not found" for an unknown id', async () => {
    renderApp('/product/9999')
    expect(await screen.findByRole('heading', { name: /product not found/i })).toBeInTheDocument()
  })
})
