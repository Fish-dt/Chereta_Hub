import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export type UserRole = "user" | "moderator" | "admin"

export interface User {
  _id: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  rating: number
  totalSales: number
  memberSince: Date
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    if (!process.env.JWT_SECRET) {
      return null
    }
    return jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
}) {
  const client = await clientPromise
  const db = client.db("auctionhub")

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(userData.password)

  const user = {
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    avatar: null,
    role: userData.role || "user",
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

export async function getUserById(userId: string) {
  const client = await clientPromise
  const db = client.db("auctionhub")

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
  if (!user) return null

  // Remove password from returned user object
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db("auctionhub")

  return await db.collection("users").findOne({ email })
}

export async function updateUserRole(userId: string, role: UserRole) {
  const client = await clientPromise
  const db = client.db("auctionhub")

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = { user: 0, moderator: 1, admin: 2 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
