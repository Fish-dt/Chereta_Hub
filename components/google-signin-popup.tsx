"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Loader2, Gavel, User } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useLanguage } from "@/contexts/language-context"

interface GoogleSigninPopupProps {
  onClose?: () => void
  delay?: number
  dismissible?: boolean
}

interface GoogleAccount {
  email: string
  name: string
  picture: string
}

// Declare Google APIs for TypeScript
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, config: any) => void
        }
      }
    }
  }
}

export function GoogleSigninPopup({ 
  onClose, 
  delay = 2000, 
  dismissible = true 
}: GoogleSigninPopupProps) {
  const { data: session } = useSession()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([])
  const [isCheckingAccount, setIsCheckingAccount] = useState(true)

  // Check if user has dismissed popup permanently
  useEffect(() => {
    const dismissed = localStorage.getItem('google-signin-popup-dismissed')
    if (dismissed === 'true') {
      setHasShown(true)
      setIsCheckingAccount(false)
    }
  }, [])

  // Check for existing Google accounts in browser
  useEffect(() => {
    const checkForGoogleAccounts = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
      
      // If no client ID is available, use fallback simulation
      if (!clientId) {
        console.log('Google Client ID not found, using fallback simulation')
        
        // Simulate finding Google accounts for demo purposes
        const hasVisitedBefore = localStorage.getItem('has-visited-before')
        const shouldShowAccount = Math.random() > 0.3 // 70% chance to show account
        
        if (shouldShowAccount && !hasVisitedBefore) {
          // Simulate finding Google accounts
          setGoogleAccounts([
            {
              email: 'john.doe@gmail.com',
              name: 'John Doe',
              picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
            },
            {
              email: 'jane.smith@gmail.com',
              name: 'Jane Smith',
              picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
            }
          ])
          localStorage.setItem('has-visited-before', 'true')
        }
        
        setIsCheckingAccount(false)
        return
      }

      // Use Google One Tap API to detect logged-in accounts
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        // Google API is available
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              try {
                const payload = JSON.parse(atob(response.credential.split('.')[1]))
                setGoogleAccounts([{
                  email: payload.email,
                  name: payload.name,
                  picture: payload.picture
                }])
              } catch (error) {
                console.error('Error parsing Google response:', error)
              }
              setIsCheckingAccount(false)
            },
            auto_select: false,
            cancel_on_tap_outside: false
          })

          // Try to prompt for account selection
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // No accounts available or user cancelled
              setIsCheckingAccount(false)
            }
          })
        } catch (error) {
          console.error('Error initializing Google One Tap:', error)
          setIsCheckingAccount(false)
        }
      } else {
        // Fallback: Load Google API script
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
          if (window.google && window.google.accounts) {
            try {
              window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response: any) => {
                  try {
                    const payload = JSON.parse(atob(response.credential.split('.')[1]))
                    setGoogleAccounts([{
                      email: payload.email,
                      name: payload.name,
                      picture: payload.picture
                    }])
                  } catch (error) {
                    console.error('Error parsing Google response:', error)
                  }
                  setIsCheckingAccount(false)
                },
                auto_select: false,
                cancel_on_tap_outside: false
              })

              window.google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  setIsCheckingAccount(false)
                }
              })
            } catch (error) {
              console.error('Error initializing Google One Tap:', error)
              setIsCheckingAccount(false)
            }
          } else {
            setIsCheckingAccount(false)
          }
        }
        script.onerror = () => {
          console.error('Failed to load Google One Tap script')
          setIsCheckingAccount(false)
        }
        document.head.appendChild(script)
      }
    }

    if (!session && !hasShown) {
      checkForGoogleAccounts()
    } else {
      setIsCheckingAccount(false)
    }
  }, [session, hasShown])

  // Auto-show popup after delay for non-authenticated users
  useEffect(() => {
    if (session || hasShown || isCheckingAccount) return

    const timer = setTimeout(() => {
      setIsVisible(true)
      setHasShown(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [session, hasShown, delay, isCheckingAccount])

  // Hide popup if user signs in
  useEffect(() => {
    if (session) {
      setIsVisible(false)
    }
  }, [session])

  const handleGoogleSignIn = async (email?: string) => {
    setIsLoading(true)
    try {
      await signIn("google", { 
        callbackUrl: "/",
        redirect: false,
        ...(email && { login_hint: email })
      })
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    if (dismissible) {
      localStorage.setItem('google-signin-popup-dismissed', 'true')
    }
    onClose?.()
  }

  // Don't render if user is already signed in or popup is not visible
  if (session || !isVisible || isCheckingAccount) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Card className="w-72 shadow-lg border border-gray-200 bg-white">
        <CardContent className="p-3">
          {/* Close Button */}
          {dismissible && (
            <div className="flex justify-end mb-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                onClick={handleClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Google Accounts */}
          {googleAccounts.length > 0 ? (
            <div className="space-y-1">
              {googleAccounts.map((account, index) => (
                <div 
                  key={account.email}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors rounded"
                  onClick={() => handleGoogleSignIn(account.email)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={account.picture} alt={account.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-900">{account.name}</div>
                    <div className="text-xs text-gray-500">{account.email}</div>
                  </div>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              <div className="text-xs text-gray-500 text-center">No Google accounts found</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
