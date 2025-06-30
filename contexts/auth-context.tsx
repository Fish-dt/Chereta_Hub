"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: "user" | "moderator" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<void>
  register: (data: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: session.user.id || "",
        email: session.user.email || "",
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        avatar: session.user.image || "",
        role: (session.user as any).role || "user",
      })
    } else {
      // Check for JWT-based auth (for email/password login)
      checkAuthStatus()
    }

    setIsLoading(false)
  }, [session, status])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const register = async (userData: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = async () => {
    try {
      if (session) {
        await signOut({ callbackUrl: "/" })
      } else {
        await fetch("/api/auth/logout", { method: "POST" })
        setUser(null)
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
