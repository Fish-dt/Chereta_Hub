"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gavel, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loginWithGoogle } = useAuth()
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    const result = await register(formData)

    if (result.success) {
      setSuccess("Account created successfully! Redirecting to sign in...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } else {
      setError(result.error || "Failed to create account")
    }

    setIsLoading(false)
  }

  const handleGoogleSignup = async () => {
    setError("")
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      setError("Failed to sign up with Google")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className={`flex items-center justify-center gap-2 font-bold text-2xl text-primary mb-4 ${language === "am" ? "font-amharic" : ""}`}
          >
            <Gavel className="h-8 w-8" />
            {language === "am" ? "የጨረታ ማዕከል" : "AuctionHub"}
          </Link>
          <h2 className={`text-3xl font-bold text-foreground ${language === "am" ? "font-amharic" : ""}`}>
            {t("auth.signup.title")}
          </h2>
          <p className={`mt-2 text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
            {t("auth.signup.subtitle")}{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80">
              {t("nav.signin")}
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={language === "am" ? "font-amharic" : ""}>Join AuctionHub</CardTitle>
            <CardDescription className={language === "am" ? "font-amharic" : ""}>
              Start bidding and selling today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign Up */}
            <div className="mb-6">
              <Button
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                variant="outline"
                className={`w-full bg-transparent ${language === "am" ? "font-amharic" : ""}`}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 bg-card text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className={language === "am" ? "font-amharic" : ""}>
                    {t("auth.first.name")}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={language === "am" ? "font-amharic" : ""}>
                    {t("auth.last.name")}
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className={language === "am" ? "font-amharic" : ""}>
                  {t("auth.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password" className={language === "am" ? "font-amharic" : ""}>
                  {t("auth.password")}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Create a strong password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className={language === "am" ? "font-amharic" : ""}>
                  {t("auth.confirm.password")}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className={`text-sm ${language === "am" ? "font-amharic" : ""}`}>
                  {t("auth.terms")}
                </Label>
              </div>

              <Button
                type="submit"
                className={`w-full ${language === "am" ? "font-amharic" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t("auth.signup.button")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
