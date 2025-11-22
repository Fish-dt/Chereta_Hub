import { POST, GET } from '@/app/api/bids/route'
import { createMockRequest, createMockSession } from '../lib/api-helpers'
import { ObjectId } from 'mongodb'

// Mock MongoDB
const mockFindOne = jest.fn()
const mockInsertOne = jest.fn()
const mockUpdateOne = jest.fn()
const mockFind = jest.fn()

jest.mock('@/lib/mongodb', () => ({
  connectToDatabase: jest.fn(() => ({
    db: {
      collection: jest.fn(() => ({
        findOne: mockFindOne,
        insertOne: mockInsertOne,
        updateOne: mockUpdateOne,
        find: mockFind,
      })),
    },
  })),
}))

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth-config', () => ({
  getAuthOptions: jest.fn(() => Promise.resolve({})),
}))

const { getServerSession } = require('next-auth/next')

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Bids API', () => {
  describe('POST /api/bids', () => {
    const mockAuctionId = new ObjectId().toString()

    it('should return 401 when user is not authenticated', async () => {
      getServerSession.mockResolvedValueOnce(null)

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/bids',
        body: {
          auctionId: mockAuctionId,
          amount: 150,
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Unauthorized')
    })
  })

  describe('GET /api/bids', () => {
    it('should return 400 when auctionId is missing', async () => {
      const request = createMockRequest({
        url: 'http://localhost:3000/api/bids',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Auction ID is required')
    })
  })
})
