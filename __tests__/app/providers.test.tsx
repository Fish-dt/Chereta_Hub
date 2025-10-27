import { render } from '@testing-library/react'
import { Providers } from '@/app/providers'

// Mock all child components to isolate testing
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}))

jest.mock('@/contexts/theme-context', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

jest.mock('@/contexts/language-context', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-provider">{children}</div>
  ),
}))

jest.mock('@/components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>,
}))

jest.mock('@/components/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}))

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}))

jest.mock('@/components/ChatBot', () => ({
  ChatBot: () => <div data-testid="chatbot">ChatBot</div>,
}))

describe('Providers Component', () => {
  it('should render all provider components', () => {
    const { getByTestId } = render(
      <Providers>
        <div data-testid="test-child">Test Child</div>
      </Providers>
    )

    expect(getByTestId('session-provider')).toBeInTheDocument()
    expect(getByTestId('theme-provider')).toBeInTheDocument()
    expect(getByTestId('language-provider')).toBeInTheDocument()
    expect(getByTestId('navbar')).toBeInTheDocument()
    expect(getByTestId('footer')).toBeInTheDocument()
    expect(getByTestId('toaster')).toBeInTheDocument()
    expect(getByTestId('chatbot')).toBeInTheDocument()
  })

  it('should render children within the provider structure', () => {
    const { getByTestId } = render(
      <Providers>
        <div data-testid="test-child">Test Child</div>
      </Providers>
    )

    expect(getByTestId('test-child')).toBeInTheDocument()
    expect(getByTestId('test-child')).toHaveTextContent('Test Child')
  })

  it('should maintain the correct nesting order', () => {
    const { container } = render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    )

    // Verify the nesting structure
    const sessionProvider = getByTestId(container, 'session-provider')
    const themeProvider = getByTestId(container, 'theme-provider')
    const languageProvider = getByTestId(container, 'language-provider')

    expect(sessionProvider).toContainElement(themeProvider)
    expect(themeProvider).toContainElement(languageProvider)
  })
})

// Helper function to use with container
function getByTestId(container: HTMLElement, testId: string) {
  return container.querySelector(`[data-testid="${testId}"]`) as HTMLElement
}
