// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Setup global test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Polyfill for Headers (needed before Request/Response)
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {}
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key.toLowerCase()] = value
        })
      }
    }
    get(name) {
      return this._headers[name.toLowerCase()] || null
    }
    set(name, value) {
      this._headers[name.toLowerCase()] = value
    }
    has(name) {
      return name.toLowerCase() in this._headers
    }
    delete(name) {
      delete this._headers[name.toLowerCase()]
    }
  }
}

// Polyfill for Request/Response (needed for Next.js API routes in tests)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      const url = typeof input === 'string' ? input : input.url
      // Set url as writable so NextRequest can override it
      Object.defineProperty(this, 'url', {
        value: url,
        writable: true,
      });
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers || {})
      this.body = init.body || null
    }
  }
}

if (typeof global.Response === 'undefined') {
  class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Headers(init.headers || {})
    }
    json() {
      return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body)
    }
    text() {
      return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body))
    }
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), { ...init, headers: { 'Content-Type': 'application/json', ...init.headers } })
    }
  }
  global.Response = Response
}

// Polyfill for TextEncoder/TextDecoder (needed for MongoDB connection string parsing)
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(str) {
      return Buffer.from(str, 'utf8')
    }
  }
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(buffer) {
      return Buffer.from(buffer).toString('utf8')
    }
  }
}