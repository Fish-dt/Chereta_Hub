import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { type Language } from '@/lib/i18n'

interface LanguageState {
  language: Language
}

// Load initial language from localStorage if available
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en'
  const savedLanguage = localStorage.getItem('language') as Language
  return savedLanguage && (savedLanguage === 'en' || savedLanguage === 'am') ? savedLanguage : 'en'
}

const initialState: LanguageState = {
  language: getInitialLanguage(),
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload)
        // Update document direction for RTL languages if needed
        document.documentElement.dir = action.payload === 'am' ? 'ltr' : 'ltr' // Amharic is LTR
      }
    },
  },
})

export const { setLanguage } = languageSlice.actions

// Selectors
export const selectLanguage = (state: RootState) => state.language.language

export default languageSlice.reducer

