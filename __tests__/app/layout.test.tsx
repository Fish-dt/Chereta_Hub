import { render } from '@testing-library/react'
import RootLayout from '@/app/layout'

// Mock the Providers component to avoid testing child components
jest.mock('@/app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}))

describe('RootLayout', () => {
  beforeEach(() => {
    // Clear the document before each test
    document.documentElement.innerHTML = ''
  })

  it('should render the layout with correct structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    // Verify that html and body elements exist
    const html = document.querySelector('html')
    const body = document.querySelector('body')
    expect(html).toBeInTheDocument()
    expect(body).toBeInTheDocument()
  })

  it('should include the favicon link', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const favicon = document.querySelector('head link[rel="icon"]')
    expect(favicon).toHaveAttribute('href', '/logo.png')
  })

  it('should include the title', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const title = document.querySelector('head title')
    expect(title).toHaveTextContent('CheretaHub')
  })

  it('should render children content', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    )

    expect(document.querySelector('[data-testid="providers"]')).toBeInTheDocument()
  })

  it('should have correct lang attribute', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const html = document.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })
})
