// Lazy MongoDB connection to prevent build-time evaluation

// Force mock during build time
const isBuildTime = process.env.NODE_ENV === 'production' && 
                   (typeof process === 'undefined' ||
                   process.env.VERCEL === '1' && !process.env.MONGODB_URI)

// Export functions that handle both build-time and runtime
export default async function getClientPromise() {
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
          countDocuments: () => Promise.resolve(0 ),
        }),
      }),
    }
    return Promise.resolve(mockClient)
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
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      retryWrites: true,
    }

    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: any
    }

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }

    return globalWithMongo._mongoClientPromise
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
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
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      retryWrites: true,
    }

    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: any
    }

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }

    const client = await globalWithMongo._mongoClientPromise
    const db = client.db(process.env.MONGODB_DB || "auctionhub")
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw new Error(`MongoDB connection failed: ${error}`)
  }
}
