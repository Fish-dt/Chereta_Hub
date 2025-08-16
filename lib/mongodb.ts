// Lazy MongoDB connection to prevent build-time evaluation

// Check if we're in a build context - more aggressive detection
const isBuildTime = typeof process === 'undefined' || 
                   process.env.NODE_ENV === 'production' || 
                   !process.env.MONGODB_URI ||
                   process.env.VERCEL === '1' ||
                   process.env.VERCEL_ENV === 'production' ||
                   process.env.NEXT_PHASE === 'phase-production-build'

// Export functions that handle both build-time and runtime
export default async function getClientPromise() {
  if (isBuildTime) {
    // Import mock during build time
    const { getClientPromise: mockGetClientPromise } = await import('./mongodb-mock')
    return mockGetClientPromise()
  }

  // Only in development with proper env vars
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  // Dynamic import to prevent build-time evaluation
  const { MongoClient } = await import('mongodb')
  
  const uri = process.env.MONGODB_URI
  const options = {}

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
}

export async function connectToDatabase() {
  if (isBuildTime) {
    // Import mock during build time
    const { connectToDatabase: mockConnectToDatabase } = await import('./mongodb-mock')
    return mockConnectToDatabase()
  }

  // Only in development with proper env vars
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  // Dynamic import to prevent build-time evaluation
  const { MongoClient } = await import('mongodb')
  
  const uri = process.env.MONGODB_URI
  const options = {}

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
}
