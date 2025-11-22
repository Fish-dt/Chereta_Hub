import { render, screen, fireEvent } from '@testing-library/react'
import { AuctionFilters } from '@/components/auction-filters'

// Mock useTranslation hook
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('AuctionFilters', () => {
  const mockProps = {
    minPrice: 0,
    maxPrice: 10000,
    onMinPriceChange: jest.fn(),
    onMaxPriceChange: jest.fn(),
    selectedCategory: null,
    onCategoryChange: jest.fn(),
    selectedConditions: [],
    onConditionChange: jest.fn(),
    selectedStatus: ['active'],
    onStatusChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all filter sections', () => {
    render(<AuctionFilters {...mockProps} />)

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('should display price range slider', () => {
    render(<AuctionFilters {...mockProps} />)

    // Price range slider should be present
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  it('should show categories list', () => {
    render(<AuctionFilters {...mockProps} />)

    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Fashion')).toBeInTheDocument()
    expect(screen.getByText('Home & Garden')).toBeInTheDocument()
  })

  it('should show condition options', () => {
    render(<AuctionFilters {...mockProps} />)

    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('Like New')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
  })

  it('should call onCategoryChange when category is selected', () => {
    render(<AuctionFilters {...mockProps} />)

    const categoryCheckbox = screen.getByRole('checkbox', { name: /electronics/i })
    fireEvent.click(categoryCheckbox)

    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('Electronics')
  })

  it('should call onConditionChange when condition is selected', () => {
    render(<AuctionFilters {...mockProps} />)

    const conditionCheckbox = screen.getByRole('checkbox', { name: /^new$/i })
    fireEvent.click(conditionCheckbox)

    expect(mockProps.onConditionChange).toHaveBeenCalledWith(['New'])
  })

  it('should clear all filters when Clear All is clicked', () => {
    render(<AuctionFilters {...mockProps} />)

    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)

    expect(mockProps.onMinPriceChange).toHaveBeenCalledWith(0)
    expect(mockProps.onMaxPriceChange).toHaveBeenCalledWith(10000)
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith(null)
    expect(mockProps.onConditionChange).toHaveBeenCalledWith([])
    expect(mockProps.onStatusChange).toHaveBeenCalledWith(['active'])
  })

  it('should display selected category', () => {
    render(<AuctionFilters {...mockProps} selectedCategory="Electronics" />)

    const checkbox = screen.getByRole('checkbox', { name: /electronics/i })
    expect(checkbox).toBeChecked()
  })

  it('should display selected conditions', () => {
    render(<AuctionFilters {...mockProps} selectedConditions={['New', 'Excellent']} />)

    expect(screen.getByRole('checkbox', { name: /^new$/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /^excellent$/i })).toBeChecked()
  })

  it('should remove condition when unchecked', () => {
    render(<AuctionFilters {...mockProps} selectedConditions={['New']} />)

    const checkbox = screen.getByRole('checkbox', { name: /^new$/i })
    fireEvent.click(checkbox)

    expect(mockProps.onConditionChange).toHaveBeenCalledWith([])
  })

  it('should handle multiple category selections', () => {
    render(<AuctionFilters {...mockProps} />)

    const electronicsBox = screen.getByRole('checkbox', { name: /electronics/i })
    const fashionBox = screen.getByRole('checkbox', { name: /fashion/i })

    fireEvent.click(electronicsBox)
    fireEvent.click(fashionBox)

    expect(mockProps.onCategoryChange).toHaveBeenLastCalledWith('Fashion')
  })
})
