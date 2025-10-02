import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { encode } from "next-auth/jwt"

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: "No credential provided" }, { status: 400 })
    }

    // Decode the JWT token from Google One Tap
    const decoded = jwt.decode(credential) as any
    
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: "Invalid JWT token" }, { status: 400 })
    }

    console.log('Google One Tap authentication for:', decoded.email)

    const { connectToDatabase } = await import("@/lib/mongodb")
    const { db } = await connectToDatabase()

    // Check if user exists
    let existingUser = await db.collection("users").findOne({ email: decoded.email })

    if (!existingUser) {
      // Create new user
      const result = await db.collection("users").insertOne({
        email: decoded.email,
        firstName: decoded.given_name || decoded.name?.split(" ")[0] || "",
        lastName: decoded.family_name || decoded.name?.split(" ").slice(1).join(" ") || "",
        avatar: decoded.picture || null,
        role: "user",
        rating: 0,
        totalSales: 0,
        memberSince: new Date(),
        isVerified: true,
        provider: "google",
        googleId: decoded.sub,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      existingUser = { _id: result.insertedId, ...decoded }
    } else {
      // Update existing user
      await db.collection("users").updateOne(
        { email: decoded.email },
        { 
          $set: { 
            provider: "google",
            googleId: decoded.sub,
            avatar: decoded.picture,
            updatedAt: new Date()
          }
        }
      )
    }

    // Create or update account record
    const existingAccount = await db.collection("accounts").findOne({
      provider: "google",
      providerAccountId: decoded.sub,
    })

    if (!existingAccount && existingUser) {
      await db.collection("accounts").insertOne({
        userId: existingUser._id,
        type: "oauth",
        provider: "google",
        providerAccountId: decoded.sub,
        access_token: null,
        refresh_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: credential,
      })
    }

    // Create a NextAuth JWT token
    const token = await encode({
      token: {
        id: existingUser?._id.toString(),
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days
        jti: existingUser?._id.toString()
      },
      secret: process.env.NEXTAUTH_SECRET!
    })

    return NextResponse.json({ 
      success: true, 
      token,
      user: {
        id: existingUser?._id.toString(),
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture
      }
    })

  } catch (error) {
    console.error('Error processing Google One Tap authentication:', error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
