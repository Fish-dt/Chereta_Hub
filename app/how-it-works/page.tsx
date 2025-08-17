import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gavel, Users, Shield, Clock, TrendingUp, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works - CheretaHub",
  description: "Learn how to buy and sell items through our secure auction platform",
}

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How CheretaHub Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how easy it is to buy and sell items through our secure, transparent auction platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Sign up for free and verify your identity to start bidding and selling
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Gavel className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Browse Auctions</CardTitle>
            <CardDescription>
              Explore thousands of items across various categories with detailed descriptions
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Place Your Bid</CardTitle>
            <CardDescription>
              Bid on items you want with our real-time bidding system
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Watch & Wait</CardTitle>
            <CardDescription>
              Monitor your bids and get notified when you're outbid or when auctions end
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Win & Complete</CardTitle>
            <CardDescription>
              If you win, complete the transaction securely through our platform
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Safe & Secure</CardTitle>
            <CardDescription>
              All transactions are protected by our secure payment system and buyer protection
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-6 w-6 text-primary" />
              For Buyers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Getting Started</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Create a free account and verify your email</li>
                <li>• Browse auctions by category or search for specific items</li>
                <li>• Set up notifications for items you're interested in</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Bidding Strategy</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Start with small bids to test the waters</li>
                <li>• Set a maximum bid amount you're comfortable with</li>
                <li>• Monitor auctions closely as they approach their end time</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">After Winning</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Complete payment within the specified timeframe</li>
                <li>• Communicate with the seller about shipping details</li>
                <li>• Leave feedback after receiving your item</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              For Sellers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Listing Items</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Take clear, high-quality photos of your items</li>
                <li>• Write detailed, honest descriptions</li>
                <li>• Set realistic starting bids and reserve prices</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Managing Auctions</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Respond promptly to bidder questions</li>
                <li>• Monitor auction progress and adjust if needed</li>
                <li>• Set appropriate auction duration (3-7 days recommended)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Completing Sales</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Ship items promptly after payment confirmation</li>
                <li>• Provide tracking information to buyers</li>
                <li>• Maintain good communication throughout the process</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>
            What makes CheretaHub the best choice for online auctions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <Badge variant="secondary" className="mb-2">Real-time Bidding</Badge>
              <p className="text-sm text-muted-foreground">
                Live updates and instant notifications
              </p>
            </div>
            <div className="text-center p-4">
              <Badge variant="secondary" className="mb-2">Secure Payments</Badge>
              <p className="text-sm text-muted-foreground">
                Protected transactions and buyer guarantees
              </p>
            </div>
            <div className="text-center p-4">
              <Badge variant="secondary" className="mb-2">Mobile Friendly</Badge>
              <p className="text-sm text-muted-foreground">
                Bid anywhere, anytime from your device
              </p>
            </div>
            <div className="text-center p-4">
              <Badge variant="secondary" className="mb-2">24/7 Support</Badge>
              <p className="text-sm text-muted-foreground">
                Help when you need it most
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of users who trust CheretaHub for their online auction needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auctions"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Auctions
          </a>
          <a
            href="/sell"
            className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Start Selling
          </a>
        </div>
      </div>
    </div>
  )
}
