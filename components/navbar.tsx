"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Gavel, Search, User, Heart, Bell, Settings, LogOut, Menu, X, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
      fetchNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold text-xl text-primary ${language === "am" ? "font-amharic" : ""}`}
          >
            <Gavel className="h-6 w-6" />
            {language === "am" ? "ጨረታ ማዕከል" : "CheretaHub"}
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center gap-6 ${language === "am" ? "font-amharic" : ""}`}>
            <Link href="/auctions" className="text-foreground hover:text-primary transition-colors">
              {t("nav.browse")}
            </Link>
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
              {t("nav.categories")}
            </Link>
            <Link href="/sell" className="text-foreground hover:text-primary transition-colors">
              {t("nav.sell")}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder={t("hero.search.placeholder")} className="pl-10" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2 font-semibold border-b">{t("notifications.title")}</div>
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem
                          key={notification._id}
                          className="p-3 cursor-pointer"
                          onClick={() => markNotificationAsRead(notification._id)}
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">{t("notifications.no.notifications")}</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Messages */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Watchlist */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/watchlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`w-56 ${language === "am" ? "font-amharic" : ""}`}>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">{t("nav.dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t("nav.profile")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bids">{t("nav.bids")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages">{t("nav.messages")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(user.role === "admin" || user.role === "moderator") && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Panel</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        {t("nav.settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("nav.signout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className={`hidden md:flex items-center gap-2 ${language === "am" ? "font-amharic" : ""}`}>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">{t("nav.signin")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t py-4 space-y-4 ${language === "am" ? "font-amharic" : ""}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder={t("hero.search.placeholder")} className="pl-10" />
            </div>

            <div className="space-y-2">
              <Link
                href="/auctions"
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.browse")}
              </Link>
              <Link
                href="/categories"
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.categories")}
              </Link>
              <Link
                href="/sell"
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.sell")}
              </Link>
            </div>

            {!user && (
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="ghost" asChild className="flex-1">
                  <Link href="/auth/login">{t("nav.signin")}</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/auth/register">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
