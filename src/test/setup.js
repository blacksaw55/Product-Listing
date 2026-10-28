import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom has no real scrolling.
window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
})
