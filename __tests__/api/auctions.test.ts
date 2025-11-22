import { GET, POST } from '@/app/api/auctions/route'
import { createMockRequest } from '../lib/api-helpers'

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(() => ({
    db: {
      collection: jest.fn(() => ({
        find: jest.fn(() => ({
          sort: jest.fn(() => ({
            skip: jest.fn(() => ({
              limit: jest.fn(() => ({
                toArray: jest.fn(() => []),
              })),
            })),
          })),
        })),
        countDocuments: jest.fn(() => 0),
        insertOne: jest.fn(() => ({
          insertedId: 'mock-id',
        })),
      })),
    },
  })),
}))

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('Auctions API', () => {
  describe('GET /api/auctions', () => {
    it('should return auctions with pagination', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('auctions')
      expect(data).toHaveProperty('pagination')
      expect(data.pagination).toHaveProperty('page')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('total')
      expect(data.pagination).toHaveProperty('pages')
    })

    it('should handle search parameter', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
        searchParams: { search: 'electronics' },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('auctions')
    })

    it('should handle category filter', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
        searchParams: { category: 'Electronics' },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('auctions')
    })

    it('should handle pagination parameters', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
        searchParams: { page: '2', limit: '10' },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(10)
    })

    it('should handle sorting parameters', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
        searchParams: { sortBy: 'price', sortOrder: 'asc' },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('auctions')
    })

    it('should handle database errors gracefully', async () => {
      // Mock a database error
      const { connectToDatabase } = require('@/lib/mongodb')
      connectToDatabase.mockImplementationOnce(() => {
        throw new Error('Database connection failed')
      })

      const request = createMockRequest({
        url: 'http://localhost:3000/api/auctions',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.auctions).toEqual([])
      expect(data.error).toBeTruthy()
    })
  })

  describe('POST /api/auctions', () => {
    it('should handle database errors during creation', async () => {
      // Mock a database error
      const { connectToDatabase } = require('@/lib/mongodb')
      connectToDatabase.mockImplementationOnce(() => {
        throw new Error('Database connection failed')
      })

      const auctionData = {
        title: 'Test Auction',
        description: 'Test Description',
        startingBid: 100,
      }

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/auctions',
        body: auctionData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error')
    })
  })
})
