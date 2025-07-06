"use client"

import Link from "next/link"
import { Gavel, Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Gavel className="h-6 w-6" />
              <span className={language === "am" ? "font-amharic" : ""}>
                {language === "am" ? "ጨረታ ማዕከል" : "CheretaHub"}
              </span>
            </Link>
            <p className={`text-gray-400 ${language === "am" ? "font-amharic" : ""}`}>
              Your trusted platform for online auctions and unique finds.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-pink-400 cursor-pointer" />
              <Mail className="h-5 w-5 hover:text-green-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auctions"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Browse Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/disputes"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Dispute Resolution
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className={`font-semibold mb-4 ${language === "am" ? "font-amharic" : ""}`}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/fees"
                  className={`text-gray-400 hover:text-white ${language === "am" ? "font-amharic" : ""}`}
                >
                  Fees & Charges
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className={`text-gray-400 ${language === "am" ? "font-amharic" : ""}`}>
            © 2024 CheretaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
