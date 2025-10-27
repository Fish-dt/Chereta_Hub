import { NextRequest } from 'next/server'

/**
 * Creates a mock NextRequest for testing API routes
 */
export function createMockRequest({
  method = 'GET',
  url = 'http://localhost:3000',
  body,
  headers = {},
  searchParams = {},
}: {
  method?: string
  url?: string
  body?: any
  headers?: Record<string, string>
  searchParams?: Record<string, string>
}): NextRequest {
  const urlObj = new URL(url)
  
  // Add search params
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })

  const requestInit: RequestInit = {
    method,
    headers: new Headers(headers),
  }

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body)
    headers['Content-Type'] = 'application/json'
  }

  return new NextRequest(urlObj, requestInit)
}

/**
 * Creates a mock session for authenticated requests
 */
export function createMockSession(user?: { email: string; name?: string; id?: string }) {
  return {
    user: user || { email: 'test@example.com', name: 'Test User', id: '123' },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  }
}
