import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { getClient } from "@/lib/mongodb"
import { compare } from "bcryptjs"

export async function getAuthOptions(): Promise<NextAuthOptions> {
  try {
    const clientPromise = getClient()
    return {
      adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const client = await getClient()
          const db = client.db("auctionhub")
          const user = await db.collection("users").findOne({ email: credentials.email })
          if (!user) return null
          const isValid = await compare(credentials.password, user.password)
          if (!isValid) return null
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.avatar || null,
          }
        } catch (error) {
          console.error("Error in credentials auth:", error)
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
  ],
    callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await getClient()
          const db = client.db("auctionhub")

          // Check if user exists in our custom users collection
          const existingUser = await db.collection("users").findOne({ email: user.email })

          if (!existingUser) {
            // Create user in our custom users collection
            await db.collection("users").insertOne({
              email: user.email,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              avatar: user.image,
              role: "user",
              rating: 0,
              totalSales: 0,
              memberSince: new Date(),
              isVerified: true,
              provider: "google",
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          } else {
            // Update existing user to include Google provider info
            await db.collection("users").updateOne(
              { email: user.email },
              { 
                $set: { 
                  provider: "google",
                  avatar: user.image,
                  updatedAt: new Date()
                }
              }
            )
          }

          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token, user }) {
      console.log("Session callback - Token:", token);
      console.log("Session callback - User:", user);
      // Use token fields if available (JWT strategy)
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).image = token.image;
        console.log("Session callback - Session after token:", session);
      }
      
      // If role is still undefined, try to get it from the database
      if (!(session.user as any).role && session.user?.email) {
        console.log("Session callback - Role still undefined, fetching from database...");
        const { connectToDatabase } = await import("@/lib/mongodb");
        const { db } = await connectToDatabase();
        const dbUser = await db.collection("users").findOne({ email: session.user.email });
        if (dbUser) {
          (session.user as any).role = dbUser.role;
          console.log("Session callback - Role from database:", dbUser.role);
        }
      }
      
      // Ensure session has all required user data
      if (session.user && !(session.user as any).id && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).image = token.image;
      }
      
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const u = user as any;
        console.log("JWT callback - User data:", u);
        token.id = u.id;
        token.email = u.email;
        token.role = u.role;
        token.firstName = u.firstName;
        token.lastName = u.lastName;
        token.image = u.image;
        console.log("JWT callback - Token after user:", token);
      }
      
      // If role is still undefined, fetch it from database
      if (!token.role && token.email) {
        console.log("JWT callback - Role undefined, fetching from database...");
        const { connectToDatabase } = await import("@/lib/mongodb");
        const { db } = await connectToDatabase();
        const dbUser = await db.collection("users").findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          console.log("JWT callback - Role from database:", dbUser.role);
        }
      }
      
      // Handle Google OAuth user data
      if (account?.provider === "google" && user) {
        const client = await getClient();
        const db = client.db("auctionhub");
        const dbUser = await db.collection("users").findOne({ email: user.email });
        
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.image = dbUser.avatar;
        }
      }
      
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
    pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    },
    session: {
    strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
  } catch (error) {
    console.error("Error creating auth options:", error)
    throw new Error(`Failed to create auth configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
