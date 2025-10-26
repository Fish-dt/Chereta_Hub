# Testing Guide

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/react) for testing.

## Setup

The testing environment is already configured with:
- Jest for running tests
- React Testing Library for component testing
- Jest DOM for DOM-specific matchers
- JSDOM for browser-like environment simulation

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

The project includes comprehensive tests for:

### 1. **Component Tests** (`__tests__/components/`)
- **UI Components**: Button, Input, Badge, Card, Select
- **Business Components**: AuctionCard, AuctionFilters

### 2. **API Route Tests** (`__tests__/api/`)
- **Auctions API**: GET and POST endpoints
- **Bids API**: GET and POST endpoints with authentication
- Tests cover: authentication, validation, error handling, edge cases

### 3. **Layout & Provider Tests** (`__tests__/app/`)
- Root Layout testing
- Provider component testing

### 4. **Utility Tests** (`__tests__/lib/`)
- Utility functions (cn, etc.)

## Test Count Summary
- **Total Test Suites**: 13
- **Total Tests**: 73+
- **Component Tests**: UI and business logic components
- **API Tests**: Critical API routes with full coverage
- **Integration Tests**: Authentication and data flow

## Writing Tests

### Test File Location
Test files should be placed in the `__tests__` directory or alongside the files they're testing with a `.test.ts` or `.test.tsx` extension.

Example structure:
```
__tests__/
  api/
    auctions.test.ts
    bids.test.ts
  components/
    auction-card.test.tsx
    auction-filters.test.tsx
    ui/
      button.test.tsx
  app/
    layout.test.tsx
    providers.test.tsx
  lib/
    utils.test.ts
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### API Route Testing Example

```typescript
import { GET } from '@/app/api/auctions/route'
import { createMockRequest } from '../lib/api-helpers'

describe('Auctions API', () => {
  it('should return auctions with pagination', async () => {
    const request = createMockRequest({
      url: 'http://localhost:3000/api/auctions',
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('auctions')
  })
})
```

## Testing Utilities

### Common Testing Library Functions

- `render()` - Render a React component
- `screen` - Query methods for finding elements
- `userEvent` - Simulate user interactions
- `waitFor` - Wait for async operations

### API Testing Helpers

- `createMockRequest()` - Create mock NextRequest objects
- `createMockSession()` - Create mock authentication sessions

### Common Assertions

- `toBeInTheDocument()` - Check if element is in the DOM
- `toHaveTextContent()` - Check element text content
- `toHaveClass()` - Check element classes
- `toBeDisabled()` - Check if element is disabled

## Mocks

### Next.js Specific Mocks

The following are already mocked in `jest.setup.js`:
- `next/font/google` - Google Fonts
- `next/navigation` - Navigation hooks (useRouter, useSearchParams, etc.)
- `next-auth/react` - NextAuth hooks and providers
- `ResizeObserver` - Required by Radix UI components

### Creating Custom Mocks

```typescript
jest.mock('@/path/to/module', () => ({
  ComponentName: ({ children }) => <div>{children}</div>,
}))
```

## API Testing Best Practices

1. **Mock External Dependencies**
   - Mock database connections
   - Mock authentication
   - Mock external API calls

2. **Test Authentication**
   - Test authenticated and unauthenticated states
   - Test authorization rules

3. **Test Validation**
   - Test required fields
   - Test invalid input
   - Test edge cases

4. **Test Error Handling**
   - Test database errors
   - Test network errors
   - Test business logic errors

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do, not internal implementation
   
2. **Use Accessible Queries**
   - Prefer queries that users would use (getByRole, getByLabelText)
   - Avoid queries that test users don't use (getByTestId for non-testing purposes)

3. **Keep Tests Simple**
   - One assertion per test when possible
   - Use descriptive test names

4. **Mock External Dependencies**
   - Mock API calls, database queries, and external services
   - Keep tests fast and independent

5. **Use User Events**
   - Prefer `userEvent` over `fireEvent` when possible
   - `userEvent` simulates real user interactions better

## Coverage Goals

- Aim for at least 70% code coverage
- Focus on testing critical user flows and business logic
- Don't obsess over 100% coverage at the expense of test quality

## Recent Additions

### API Route Tests
- ✅ Auctions API (GET, POST)
- ✅ Bids API (GET, POST with authentication)
- ✅ Error handling and edge cases
- ✅ Validation and business logic
- ✅ Authentication and authorization

### Test Coverage
- **Components**: UI components and business logic
- **API Routes**: Critical endpoints with full coverage
- **Authentication**: Session and authorization testing
- **Error Handling**: Database and network errors

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check that the path alias (`@/*`) is correctly configured in `jest.config.js`

2. **"React is not defined" errors**
   - Ensure you're importing React in your test files if using JSX

3. **Hydration warnings in tests**
   - These can be safely ignored in tests, they're related to SSR

4. **Async operation issues**
   - Use `waitFor` or `findBy*` queries for async operations

5. **ResizeObserver errors**
   - Already mocked in `jest.setup.js`
   - If new errors occur, check if the mock is still active
