"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestOAuthPage() {
  const { data: session, status } = useSession()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: false 
      })
      console.log("Google sign in result:", result)
    } catch (error) {
      console.error("Google sign in error:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>OAuth Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Authenticated:</strong> {session ? "Yes" : "No"}</p>
          </div>

          {session ? (
            <div className="space-y-2">
              <p><strong>User:</strong> {session.user?.name}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Role:</strong> {(session.user as any)?.role}</p>
              <Button onClick={() => signOut()} className="w-full">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button onClick={handleGoogleSignIn} className="w-full">
                Test Google Sign In
              </Button>
              <p className="text-sm text-gray-600">
                Check the browser console for any errors
              </p>
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="font-semibold mb-2">Environment Check:</h4>
            <p>GOOGLE_CLIENT_ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "Set" : "Not set"}</p>
            <p>NEXTAUTH_URL: {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
