// Mock MongoDB client for build time
export const mockClient = {
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

export async function getClientPromise() {
  return Promise.resolve(mockClient)
}

export async function connectToDatabase() {
  return { client: mockClient, db: mockClient.db() }
} 