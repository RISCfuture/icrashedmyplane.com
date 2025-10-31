import { vi } from 'vitest'

// Mock localStorage for jsdom environment
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}

// Set up localStorage globally
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})
