// Lazy MongoDB connection to prevent build-time evaluation

// Force mock during build time
const isBuildTime = process.env.NODE_ENV === 'production' && 
                   (typeof process === 'undefined' ||
                   process.env.VERCEL === '1' && !process.env.MONGODB_URI)

// Export functions that handle both build-time and runtime
export default async function getClientPromise() {
  // Use mock during build time or when MongoDB URI is not available
  if (isBuildTime) {
    // For NextAuth.js adapter, we need to return a proper mock client
    const { MongoClient } = await import('mongodb')
    const mockClient = new MongoClient('mongodb://localhost:27017/mock')
    return mockClient
  }

  // Check if MongoDB URI is available
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set')
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  try {
    // Dynamic import to prevent build-time evaluation
    const { MongoClient } = await import('mongodb')
    
    const uri = process.env.MONGODB_URI
    
    // Create a new client each time to avoid connection issues
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      // Add more robust connection options
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    })

    // Connect and return the client
    await client.connect()
    
    // Test the connection
    await client.db("admin").command({ ping: 1 })
    console.log("MongoDB connection successful")
    
    return client
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    
    // For development, return a mock client instead of crashing
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock MongoDB client for development')
      const { MongoClient } = await import('mongodb')
      const mockClient = new MongoClient('mongodb://localhost:27017/mock')
      return mockClient
    }
    
    throw new Error(`MongoDB connection failed: ${error}`)
  }
}

export async function connectToDatabase() {
  // Use mock during build time or when MongoDB URI is not available
  if (isBuildTime) {
    // Direct mock without import to avoid any issues
    const mockClient = {
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: () => Promise.resolve([]) }),
          findOne: () => Promise.resolve(null),
          insertOne: () => Promise.resolve({ insertedId: 'mock' }),
          updateOne: () => Promise.resolve({ modifiedCount: 0 }),
          deleteOne: () => Promise.resolve({ deletedCount: 0 }),
          countDocuments: () => Promise.resolve(0),
        }),
      }),
    }
    return { client: mockClient, db: mockClient.db() }
  }

  // Check if MongoDB URI is available
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set')
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  try {
    // Dynamic import to prevent build-time evaluation
    const { MongoClient } = await import('mongodb')
    
    const uri = process.env.MONGODB_URI
    
    // Create a new client each time to avoid connection issues
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      // Add more robust connection options
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    })

    // Connect and get the database
    await client.connect()
    
    // Test the connection
    await client.db("admin").command({ ping: 1 })
    console.log("MongoDB connection successful")
    
    const db = client.db(process.env.MONGODB_DB || "auctionhub")
    
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    
    // For development, return a mock client instead of crashing
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock MongoDB client for development')
      const { MongoClient } = await import('mongodb')
      const mockClient = new MongoClient('mongodb://localhost:27017/mock')
      const mockDb = mockClient.db("mock")
      return { client: mockClient, db: mockDb }
    }
    
    throw new Error(`MongoDB connection failed: ${error}`)
  }
}
