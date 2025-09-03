import { MongoClient } from 'mongodb'

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  connectTimeoutMS: 30000,
}

let clientPromiseRef: Promise<MongoClient> | undefined

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  return uri
}

export function getClient(): Promise<MongoClient> {
  if (clientPromiseRef) return clientPromiseRef

  try {
    const uri = getMongoUri()

    if (process.env.NODE_ENV === 'development') {
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }
      if (!globalWithMongo._mongoClientPromise) {
        const client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      clientPromiseRef = globalWithMongo._mongoClientPromise
    } else {
      const client = new MongoClient(uri, options)
      clientPromiseRef = client.connect()
    }

    return clientPromiseRef
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error(`Failed to initialize MongoDB connection: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function connectToDatabase() {
  const client = await getClient()
  const db = client.db(process.env.MONGODB_DB || 'auctionhub')
  return { client, db }
}
