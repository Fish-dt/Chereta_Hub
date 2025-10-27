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

    it('should create a bid successfully', async () => {
      const session = createMockSession()
      getServerSession.mockResolvedValueOnce(session)

      mockFindOne.mockResolvedValueOnce({
        _id: new ObjectId(mockAuctionId),
        status: 'active',
        endTime: new Date(Date.now() + 60000).toISOString(),
        sellerId: 'different@example.com',
      })

      mockFindOne.mockResolvedValueOnce({
        amount: 100,
      })

      mockInsertOne.mockResolvedValueOnce({})

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

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('bid')
    })

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

    it('should return 400 when required fields are missing', async () => {
      const session = createMockSession()
      getServerSession.mockResolvedValueOnce(session)

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/bids',
        body: {
          auctionId: mockAuctionId,
          // amount is missing
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Missing required fields')
    })

    it('should return 400 when auction is not found', async () => {
      const session = createMockSession()
      getServerSession.mockResolvedValueOnce(session)

      mockFindOne.mockResolvedValueOnce(null)

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

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Auction not found or not active')
    })

    it('should return 400 when auction has ended', async () => {
      const session = createMockSession()
      getServerSession.mockResolvedValueOnce(session)

      mockFindOne.mockResolvedValueOnce({
        _id: new ObjectId(mockAuctionId),
        status: 'active',
        endTime: new Date(Date.now() - 60000).toISOString(), // Ended 1 minute ago
      })

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

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Auction has ended')
    })

    it('should return 400 when bidding on own auction', async () => {
      const session = createMockSession({ email: 'seller@example.com' })
      getServerSession.mockResolvedValueOnce(session)

      mockFindOne.mockResolvedValueOnce({
        _id: new ObjectId(mockAuctionId),
        status: 'active',
        endTime: new Date(Date.now() + 60000).toISOString(),
        sellerId: 'seller@example.com',
      })

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

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Cannot bid on your own auction')
    })

    it('should return 400 when bid amount is too low', async () => {
      const session = createMockSession()
      getServerSession.mockResolvedValueOnce(session)

      mockFindOne.mockResolvedValueOnce({
        _id: new ObjectId(mockAuctionId),
        status: 'active',
        endTime: new Date(Date.now() + 60000).toISOString(),
        sellerId: 'different@example.com',
      })

      mockFindOne.mockResolvedValueOnce({
        amount: 100,
      })

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/bids',
        body: {
          auctionId: mockAuctionId,
          amount: 50, // Lower than current highest bid
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Bid must be higher than current highest bid')
    })
  })

  describe('GET /api/bids', () => {
    it('should return bids for an auction', async () => {
      const mockAuctionId = new ObjectId().toString()

      mockFind.mockReturnValueOnce({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              { amount: 150, bidderName: 'User 1', createdAt: new Date() },
              { amount: 100, bidderName: 'User 2', createdAt: new Date() },
            ]),
          }),
        }),
      })

      const request = createMockRequest({
        url: 'http://localhost:3000/api/bids',
        searchParams: { auctionId: mockAuctionId },
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
    })

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
