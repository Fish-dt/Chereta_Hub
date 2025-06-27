import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import clientPromise from "./mongodb"

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  const client = await clientPromise
  const db = client.db("auctionhub")

  const hashedPassword = await hashPassword(userData.password)

  const user = {
    ...userData,
    password: hashedPassword,
    rating: 0,
    totalSales: 0,
    memberSince: new Date(),
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return result.insertedId
}
