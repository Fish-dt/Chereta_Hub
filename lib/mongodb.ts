// Lazy MongoDB connection to prevent build-time evaluation
let clientPromise: any
let connectToDatabaseFn: any

// Initialize MongoDB connection only when needed
function initializeMongoDB() {
  if (clientPromise && connectToDatabaseFn) {
    return { clientPromise, connectToDatabaseFn }
  }

  // Check if we're in a build context
  const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI

  if (isBuildTime) {
    // During build time without proper env vars, export a mock
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

    clientPromise = Promise.resolve(mockClient)
    connectToDatabaseFn = async () => ({ client: mockClient, db: mockClient.db() })
  } else {
    // Normal runtime behavior
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }

    // Dynamic import to prevent build-time evaluation
    const { MongoClient } = require('mongodb')
    
    const uri = process.env.MONGODB_URI
    const options = {}

    let client

    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: any
      }

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }

    connectToDatabaseFn = async () => {
      const client = await clientPromise
      const db = client.db(process.env.MONGODB_DB || "auctionhub")
      return { client, db }
    }
  }

  return { clientPromise, connectToDatabaseFn }
}

// Export functions that initialize MongoDB when called
export default function getClientPromise() {
  const { clientPromise } = initializeMongoDB()
  return clientPromise
}

export async function connectToDatabase() {
  const { connectToDatabaseFn } = initializeMongoDB()
  return connectToDatabaseFn()
}
