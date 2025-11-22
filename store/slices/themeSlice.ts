import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
}

// Load initial theme from localStorage if available
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  const savedTheme = localStorage.getItem('theme') as Theme
  return savedTheme && ['dark', 'light', 'system'].includes(savedTheme) ? savedTheme : 'system'
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (action.payload === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(action.payload)
        }
      }
    },
    initializeTheme: (state) => {
      // Apply theme on initialization
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (state.theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(state.theme)
        }
      }
    },
  },
})

export const { setTheme, initializeTheme } = themeSlice.actions

// Selectors
export const selectTheme = (state: RootState) => state.theme.theme

export default themeSlice.reducer

