"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { selectLanguage, setLanguage } from "@/store/slices/languageSlice"
import type { Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const language = useAppSelector(selectLanguage)
  const dispatch = useAppDispatch()
  
  const handleSetLanguage = (newLanguage: Language) => {
    dispatch(setLanguage(newLanguage))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetLanguage("am")} className={language === "am" ? "bg-accent" : ""}>
          አማርኛ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
