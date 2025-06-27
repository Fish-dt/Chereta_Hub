import Link from "next/link"
import { Gavel, Facebook, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Gavel className="h-6 w-6 text-blue-400" />
              AuctionHub
            </Link>
            <p className="text-gray-400">
              The world's leading online auction platform. Discover unique items and place winning bids.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/auctions" className="block text-gray-400 hover:text-white">
                Browse Auctions
              </Link>
              <Link href="/categories" className="block text-gray-400 hover:text-white">
                Categories
              </Link>
              <Link href="/sell" className="block text-gray-400 hover:text-white">
                Start Selling
              </Link>
              <Link href="/how-it-works" className="block text-gray-400 hover:text-white">
                How It Works
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white">
                Help Center
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white">
                Contact Us
              </Link>
              <Link href="/safety" className="block text-gray-400 hover:text-white">
                Safety Tips
              </Link>
              <Link href="/dispute" className="block text-gray-400 hover:text-white">
                Dispute Resolution
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link href="/terms" className="block text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="block text-gray-400 hover:text-white">
                Cookie Policy
              </Link>
              <Link href="/fees" className="block text-gray-400 hover:text-white">
                Fees & Charges
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
