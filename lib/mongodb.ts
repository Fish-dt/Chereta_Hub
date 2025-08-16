import { MongoClient } from "mongodb"

// Check if we're in a build context
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI

let clientPromise: Promise<MongoClient>
let connectToDatabase: () => Promise<{ client: any; db: any }>

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

  clientPromise = Promise.resolve(mockClient as any)
  connectToDatabase = async () => ({ client: mockClient, db: mockClient.db() })
} else {
  // Normal runtime behavior
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  const uri = process.env.MONGODB_URI
  const options = {}

  let client

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
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

  connectToDatabase = async () => {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || "auctionhub")
    return { client, db }
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Function to connect to database and return db instance
export { connectToDatabase }
