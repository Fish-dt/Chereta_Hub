"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Gavel, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t, language } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading" || session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    // Register user via API
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (response.ok) {
      // Auto-login after registration
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
      })
      router.push("/dashboard")
    } else {
      setError(data.error || "Registration failed")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <Gavel className="h-8 w-8 text-primary" />
              <span className={`text-2xl font-bold ${language === "am" ? "font-amharic" : ""}`}>
                {language === "am" ? "ጨረታ ማዕከል" : "CheretaHub"}
              </span>
            </div>
          </div>
          <CardTitle className={`text-2xl font-bold text-center ${language === "am" ? "font-amharic" : ""}`}>
            {t("auth.signup.title")}
          </CardTitle>
          <CardDescription className={`text-center ${language === "am" ? "font-amharic" : ""}`}>
            {t("auth.signup.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={language === "am" ? "font-amharic" : ""}>
                  {t("profile.firstName")}
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={t("profile.firstName")}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={language === "am" ? "font-amharic" : ""}>
                  {t("profile.lastName")}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={t("profile.lastName")}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={language === "am" ? "font-amharic" : ""}>
                {t("profile.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("profile.email")}
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={language === "am" ? "font-amharic" : ""}>
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.password")}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={language === "am" ? "font-amharic" : ""}>
                {t("auth.confirm.password")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.confirm.password")}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="terms"
                className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${language === "am" ? "font-amharic" : ""}`}
              >
                I agree to the <Link href="/terms" className="text-primary hover:underline">terms and conditions</Link> and <Link href="/privacy" className="text-primary hover:underline">privacy policy</Link>.
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.signup.loading")}
                </>
              ) : (
                t("auth.signup.button")
              )}
            </Button>
          </form>

          <div className={`text-center text-sm ${language === "am" ? "font-amharic" : ""}`}>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log In
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={async () => {
              setIsLoading(true);
              setError("");
              try {
                const result = await signIn("google", { 
                  callbackUrl: "/dashboard",
                  redirect: false 
                });
                if (result?.error) {
                  setError("Google sign in failed. Please try again.");
                }
              } catch (error) {
                setError("Google sign in failed. Please try again.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_40)">
                <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.528 2.84-2.12 5.24-4.52 6.86v5.68h7.32c4.28-3.94 6.73-9.74 6.73-16.856z" fill="#4285F4"/>
                <path d="M24.48 48c6.12 0 11.26-2.04 15.01-5.54l-7.32-5.68c-2.04 1.36-4.66 2.18-7.69 2.18-5.92 0-10.94-4-12.74-9.36H4.25v5.82C7.98 43.98 15.62 48 24.48 48z" fill="#34A853"/>
                <path d="M11.74 29.6c-.48-1.36-.76-2.8-.76-4.28 0-1.48.28-2.92.76-4.28v-5.82H4.25A23.97 23.97 0 0 0 0 24.48c0 3.98.96 7.74 2.65 11.02l9.09-5.9z" fill="#FBBC05"/>
                <path d="M24.48 9.52c3.34 0 6.32 1.14 8.68 3.38l6.48-6.48C35.74 2.36 30.6 0 24.48 0 15.62 0 7.98 4.02 4.25 10.18l9.09 5.82c1.8-5.36 6.82-9.36 12.74-9.36z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <path fill="#fff" d="M0 0h48v48H0z"/>
                </clipPath>
              </defs>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
