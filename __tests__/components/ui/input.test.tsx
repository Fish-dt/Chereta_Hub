import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('should handle value changes', async () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should accept value prop', () => {
    render(<Input value="test value" readOnly />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test value')
  })

  it('should be disabled when disabled prop is set', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should accept type prop', () => {
    render(<Input type="password" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should accept className prop', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('should accept id prop', () => {
    render(<Input id="test-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('should be required when required prop is set', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('should have aria-label when provided', () => {
    render(<Input aria-label="Search input" />)
    const input = screen.getByLabelText('Search input')
    expect(input).toBeInTheDocument()
  })
})
