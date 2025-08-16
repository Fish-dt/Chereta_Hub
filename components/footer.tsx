"use client"

import Link from "next/link"
import { Gavel } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gavel className="h-5 w-5" />
            <span className={`font-bold text-lg ${language === "am" ? "font-amharic" : ""}`}>
              {language === "am" ? "ጨረታ ማዕከል" : "CheretaHub"}
            </span>
          </div>

          {/* Essential Links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/auctions"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Auctions
            </Link>
            <Link
              href="/sell"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sell
            </Link>
            <Link
              href="/profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 CheretaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
