"use client"

import { useEffect, useRef } from "react"
import { signIn, useSession } from "next-auth/react"

interface GoogleSigninPopupProps {
  onClose?: () => void
}

// Declare Google APIs for TypeScript
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          cancel: () => void
        }
      }
    }
  }
}

export function GoogleSigninPopup({ onClose }: GoogleSigninPopupProps) {
  const { data: session } = useSession()
  const initializedRef = useRef(false)
  const scriptLoadedRef = useRef(false)
  const hasRunRef = useRef(false)

  useEffect(() => {
    // Prevent multiple runs of this effect
    if (hasRunRef.current) {
      return
    }

    // Don't initialize if user is already signed in
    if (session) {
      console.log('User already signed in, skipping Google One Tap')
      hasRunRef.current = true
      // Clear dismissal flag when user is logged in (so it shows again after logout)
      localStorage.removeItem('google-signin-popup-dismissed')
      // Cancel any existing Google One Tap prompts
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
      return
    }

    // Check if user has dismissed popup permanently
    const dismissed = localStorage.getItem('google-signin-popup-dismissed')
    if (dismissed === 'true') {
      console.log('Google One Tap dismissed by user, skipping')
      hasRunRef.current = true
      return
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    
    if (!clientId) {
      console.warn('Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.')
      hasRunRef.current = true
      return
    }

    console.log('Initializing Google One Tap...')
    hasRunRef.current = true

    const initializeGoogleOneTap = () => {
      // Prevent multiple initializations
      if (initializedRef.current) {
        console.log('Google One Tap already initialized, skipping')
        return
      }

      if (!window.google?.accounts?.id) {
        console.log('Google One Tap API not available yet')
        return
      }

      try {
        console.log('Initializing Google One Tap API...')
        initializedRef.current = true

        window.google.accounts.id.initialize({
          client_id: clientId,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid Cloudflare/CORS issues
          callback: async (response: any) => {
            try {
              console.log('Google One Tap callback received')
              
              // Parse the JWT token
              const payload = JSON.parse(atob(response.credential.split('.')[1]))
              console.log('Parsed Google One Tap payload:', payload.email)
              
              // Instead of using NextAuth's signIn (which causes redirects), 
              // let's create the session directly using the JWT credential
              try {
                const authResponse = await fetch('/api/auth/google-one-tap', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    credential: response.credential
                  })
                })

                if (authResponse.ok) {
                  const result = await authResponse.json()
                  console.log('Google One Tap authentication successful:', result.user.email)
                  
                  // Set the NextAuth session token cookie
                  document.cookie = `next-auth.session-token=${result.token}; path=/; max-age=${60 * 60 * 24 * 30}; secure; samesite=lax` // 30 days
                  
                  // Refresh the page to update the session
                  window.location.reload()
                } else {
                  console.error('Google One Tap authentication failed')
                }
              } catch (error) {
                console.error('Error authenticating with Google One Tap:', error)
              }
              
              // Only cancel after successful sign in or if there's an error
              if (window.google?.accounts?.id) {
                window.google.accounts.id.cancel()
              }
              
              // Call onClose if provided
              onClose?.()
            } catch (error) {
              console.error('Error processing Google One Tap response:', error)
              // Cancel on error as well
              if (window.google?.accounts?.id) {
                window.google.accounts.id.cancel()
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false, // Prevent accidental dismissal
          itp_support: true // Enable Intelligent Tracking Prevention support
        })

        console.log('Showing Google One Tap prompt...')
        // Add a small delay before showing the prompt to avoid conflicts
        setTimeout(() => {
          // Show the One Tap prompt
          window.google.accounts.id.prompt((notification: any) => {
            console.log('Google One Tap notification:', notification)
            if (notification.isNotDisplayed()) {
              console.log('Google One Tap not displayed:', notification.getNotDisplayedReason())
              initializedRef.current = false
            } else if (notification.isSkippedMoment()) {
              console.log('Google One Tap skipped:', notification.getSkippedReason())
              initializedRef.current = false
            } else if (notification.isDismissedMoment()) {
              console.log('Google One Tap dismissed:', notification.getDismissedReason())
              initializedRef.current = false
            }
          })
        }, 1000) // 1 second delay
      } catch (error) {
        console.error('Error initializing Google One Tap:', error)
        initializedRef.current = false
      }
    }

    const loadGoogleScript = () => {
      if (scriptLoadedRef.current) {
        console.log('Google script already loaded, initializing...')
        initializeGoogleOneTap()
        return
      }

      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (existingScript) {
        console.log('Google script already exists in DOM, marking as loaded...')
        scriptLoadedRef.current = true
        // Wait a bit for the script to be ready
        setTimeout(initializeGoogleOneTap, 200)
        return
      }

      console.log('Loading Google One Tap script...')
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('Google One Tap script loaded successfully')
        scriptLoadedRef.current = true
        // Add a small delay to ensure the script is fully initialized
        setTimeout(initializeGoogleOneTap, 200)
      }
      
      script.onerror = () => {
        console.error('Failed to load Google One Tap script')
      }
      
      document.head.appendChild(script)
    }

    // Load the Google script and initialize
    loadGoogleScript()

    // Cleanup function
    return () => {
      if (window.google?.accounts?.id && initializedRef.current) {
        try {
          window.google.accounts.id.cancel()
        } catch (error) {
          console.log('Error cancelling Google One Tap during cleanup:', error)
        }
        initializedRef.current = false
      }
    }
  }, []) // Empty dependency array to run only once

  // Separate effect to handle session changes
  useEffect(() => {
    if (session && window.google?.accounts?.id && initializedRef.current) {
      console.log('User signed in, cancelling Google One Tap')
      try {
        window.google.accounts.id.cancel()
      } catch (error) {
        console.log('Error cancelling Google One Tap:', error)
      }
    } else if (!session && hasRunRef.current) {
      // Reset the hasRunRef when user logs out so popup can show again
      console.log('User logged out, resetting Google One Tap state')
      hasRunRef.current = false
      initializedRef.current = false
    }
  }, [session])

  // This component doesn't render any UI - Google One Tap handles the UI
  return null
}
