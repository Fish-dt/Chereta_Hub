"use client";
import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Gavel,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Plus,
  MessageSquare,
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/auctions?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { href: "/auctions", label: "Auctions" },
    ...(!session
      ? [
          { href: "/categories", label: "Categories" },
          { href: "/how-it-works", label: "How it Works" },
        ]
      : []),
  ];

  const showPromo = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Gavel className="h-6 w-6 text-primary" />
              <span>CheretaHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-sm mx-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {session ? (
                <>
                  {/* Sell Button */}
                  <Button asChild variant="ghost" size="icon" aria-label="Sell">
                    <Link href="/sell">
                      <Plus className="h-5 w-5" />
                    </Link>
                  </Button>

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
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem key={notification._id} className="flex flex-col items-start p-3">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/notifications">View All</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Messages */}
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/messages">
                      <MessageSquare className="h-5 w-5" />
                    </Link>
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={(session.user as any)?.avatar || undefined} alt={(session.user as any)?.firstName || "Profile"} />
                          <AvatarFallback>
                            <User className="h-5 w-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {(session.user as any)?.firstName} {(session.user as any)?.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">{(session.user as any)?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <ShoppingBag className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/watchlist">
                          <Heart className="mr-2 h-4 w-4" /> Watchlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        placeholder="Search auctions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`text-sm font-medium p-2 rounded-md transition-colors hover:bg-accent ${
                            pathname === item.href ? "bg-accent" : ""
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    {session && (
                      <>
                        <div className="border-t pt-4">
                          <Link href="/sell" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                            <Plus className="h-4 w-4" /> Sell
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Bar */}
      {showPromo && (
        <div className="w-full bg-blue-100 border-b border-blue-300 h-16 flex items-center justify-center text-sm font-medium text-blue-900 px-4">
          <Link
            href="/auction/68b839de274e309cfdc691c7"
            className="flex items-center gap-2 hover:underline"
          >
            ✨ Own a Piece of History – “Mother Ethiopia” by Afewerk Tekle! Limited-edition lithograph.
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

    </>
  );
}
