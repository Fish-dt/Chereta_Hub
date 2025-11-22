'use client'

import { useRef, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { makeStore, AppStore, AppDispatch } from './index'
import { initializeTheme } from './slices/themeSlice'

function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | undefined>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

// Component to initialize theme on mount - must be inside StoreProvider
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize theme on mount
    dispatch(initializeTheme())

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = window.document.documentElement
      const currentTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'system'
      if (currentTheme === 'system') {
        root.classList.remove('light', 'dark')
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [dispatch])

  return <>{children}</>
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeInitializer>{children}</ThemeInitializer>
    </StoreProvider>
  )
}

