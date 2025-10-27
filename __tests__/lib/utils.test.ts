import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', true && 'baz')).toBe('foo baz')
  })

  it('should handle undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('should merge conflicting Tailwind classes', () => {
    expect(cn('px-2 py-4', 'px-4 py-2')).toMatch(/^px-4 py-\d+$/)
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
  })
})
