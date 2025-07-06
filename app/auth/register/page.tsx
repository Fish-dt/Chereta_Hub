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
import { useLanguage } from "@/contexts/language-context"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
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
                  {t("auth.first.name")}
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={t("auth.first.name.placeholder")}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={language === "am" ? "font-amharic" : ""}>
                  {t("auth.last.name")}
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={t("auth.last.name.placeholder")}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={language === "am" ? "font-amharic" : ""}>
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("auth.email.placeholder")}
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
                  placeholder={t("auth.password.placeholder")}
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
                  placeholder={t("auth.confirm.password.placeholder")}
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
                className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  language === "am" ? "font-amharic" : ""
                }`}
              >
                {t("auth.accept.terms.start")}{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  {t("auth.terms.conditions")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  {t("auth.privacy.policy")}
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.creating.account")}
                </>
              ) : (
                t("auth.signup.button")
              )}
            </Button>
          </form>

          <div className={`text-center text-sm ${language === "am" ? "font-amharic" : ""}`}>
            <span className="text-muted-foreground">{t("auth.have.account")} </span>
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("auth.signin.link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
