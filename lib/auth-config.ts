import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const client = await clientPromise
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
      },
    }),
    // GoogleProvider({ ... }) // Uncomment and configure when ready for Google login
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise
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
          }

          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const client = await clientPromise
          const db = client.db("auctionhub")

          const user = await db.collection("users").findOne({ email: session.user.email })

          if (user) {
            (session.user as any).id = user._id.toString()
            ;(session.user as any).role = user.role
            ;(session.user as any).firstName = user.firstName
            ;(session.user as any).lastName = user.lastName
          }
        } catch (error) {
          console.error("Error fetching user in session:", error)
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
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
  debug: process.env.NODE_ENV === "development",
}
