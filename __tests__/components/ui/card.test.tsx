import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      const { container } = render(<Card className="custom-card" />)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
    })
  })

  describe('CardHeader', () => {
    it('should render card header with children', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      )
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(
        <Card>
          <CardTitle>Card Title</CardTitle>
        </Card>
      )
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('should accept className prop', () => {
      render(
        <Card>
          <CardTitle className="custom-title">Title</CardTitle>
        </Card>
      )
      expect(screen.getByText('Title')).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(
        <Card>
          <CardDescription>Card Description</CardDescription>
        </Card>
      )
      expect(screen.getByText('Card Description')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      render(
        <Card>
          <CardContent>Card Content</CardContent>
        </Card>
      )
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(
        <Card>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })
  })

  describe('Complete Card Structure', () => {
    it('should render a complete card with all sections', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>Main content goes here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(screen.getByText('This is a test card')).toBeInTheDocument()
      expect(screen.getByText('Main content goes here')).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })
})
