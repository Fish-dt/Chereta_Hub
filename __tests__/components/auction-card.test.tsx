import { render, screen, waitFor } from '@testing-library/react'
import { AuctionCard } from '@/components/auction-card'

// Mock next/link
jest.mock('next/link', () => ({ children }: { children: React.ReactNode }) => children)

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock useTranslation hook
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auction.currentBid': 'Current Bid',
        'auction.bids': 'bids',
        'auction.placeBid': 'Place Bid',
        'auction.ended': 'Ended',
      }
      return translations[key] || key
    },
    language: 'en',
  }),
}))

const mockAuction = {
  _id: '1',
  title: 'Test Auction',
  description: 'Test Description',
  startingBid: 100,
  currentBid: 150,
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  images: ['/test-image.jpg'],
  category: 'Electronics',
  seller: {
    firstName: 'John',
    lastName: 'Doe',
  },
  bidCount: 5,
  status: 'active',
}

describe('AuctionCard', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render auction information correctly', () => {
    render(<AuctionCard auction={mockAuction} />)

    expect(screen.getByText('Test Auction')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('5 bids')).toBeInTheDocument()
  })

  it('should display formatted currency', () => {
    render(<AuctionCard auction={mockAuction} />)

    expect(screen.getByText('$150')).toBeInTheDocument()
  })

  it('should display time remaining', () => {
    render(<AuctionCard auction={mockAuction} />)

    expect(screen.getByText(/^\d+h \d+m$/)).toBeInTheDocument()
  })

  it('should show "Ended" badge for ended auctions', () => {
    const endedAuction = {
      ...mockAuction,
      status: 'ended',
      endTime: new Date(Date.now() - 1000).toISOString(),
    }

    render(<AuctionCard auction={endedAuction} />)

    // Check that "Ended" appears in the badge overlay
    const endedBadges = screen.getAllByText('Ended')
    expect(endedBadges.length).toBeGreaterThan(0)
    // Check that the button is disabled
    const button = screen.getByRole('button', { name: /ended/i })
    expect(button).toBeDisabled()
  })

  it('should disable button for ended auctions', () => {
    const endedAuction = {
      ...mockAuction,
      status: 'ended',
      endTime: new Date(Date.now() - 1000).toISOString(),
    }

    render(<AuctionCard auction={endedAuction} />)

    const button = screen.getByRole('button', { name: /ended/i })
    expect(button).toBeDisabled()
  })

  it('should show watchlist icon', () => {
    render(<AuctionCard auction={mockAuction} />)

    // The bookmark button doesn't have accessible text, so find it by its SVG
    const buttons = screen.getAllByRole('button')
    const bookmarkButton = buttons.find(button => {
      const svg = button.querySelector('svg')
      return svg && svg.getAttribute('viewBox') === '0 0 24 24'
    })
    expect(bookmarkButton).toBeInTheDocument()
  })

  it('should display placeholder image when no images provided', () => {
    const auctionWithoutImages = {
      ...mockAuction,
      images: undefined,
    }

    const { container } = render(<AuctionCard auction={auctionWithoutImages} />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/placeholder.jpg')
  })

  it('should update time remaining', async () => {
    render(<AuctionCard auction={mockAuction} />)

    // Initial time
    expect(screen.getByText(/^\d+h \d+m$/)).toBeInTheDocument()

    // Fast-forward time
    jest.advanceTimersByTime(60000) // 1 minute

    await waitFor(() => {
      const timeElement = screen.getByText(/\d+h \d+m/)
      expect(timeElement).toBeInTheDocument()
    })
  })

  it('should display correct category badge', () => {
    render(<AuctionCard auction={mockAuction} />)

    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('should show bid count', () => {
    render(<AuctionCard auction={mockAuction} />)

    expect(screen.getByText('5 bids')).toBeInTheDocument()
  })
})
