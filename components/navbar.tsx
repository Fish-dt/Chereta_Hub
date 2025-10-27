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
  Languages,
  Globe,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation, type Language } from "@/lib/i18n";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  
  const { t } = useTranslation(language);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
    
    // Get language from localStorage
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, [session]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

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
    { href: "/auctions", label: t("nav.auctions"), key: "auctions" },
    ...(!session
      ? [
          { href: "/categories", label: t("nav.categories"), key: "categories" },
          { href: "/how-it-works", label: t("nav.how.it.works"), key: "howItWorks" },
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
              <span className="hidden sm:inline">CheretaHub</span>
              <span className="sm:hidden">CH</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
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
            <form onSubmit={handleSearch} className="hidden md:flex lg:hidden xl:flex items-center gap-2 flex-1 max-w-sm mx-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("nav.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" title="Language">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => changeLanguage("en")}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <span>English</span>
                    {language === "en" && <Languages className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => changeLanguage("am")}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <span>አማርኛ</span>
                    {language === "am" && <Languages className="h-4 w-4 ml-2" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {session ? (
                <>
                  {/* Sell Button */}
                  <Button asChild variant="ghost" size="icon" aria-label={t("nav.sell")} className="hidden sm:flex">
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
                      <DropdownMenuLabel>{t("nav.notifications")}</DropdownMenuLabel>
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
                        <DropdownMenuItem disabled>{t("nav.no.notifications")}</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/notifications">{t("nav.view.all")}</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Messages */}
                  <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
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
                          <User className="mr-2 h-4 w-4" /> {t("nav.profile")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <ShoppingBag className="mr-2 h-4 w-4" /> {t("nav.dashboard")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/watchlist">
                          <Heart className="mr-2 h-4 w-4" /> {t("nav.watchlist")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" /> {t("nav.settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/login">{t("nav.signin")}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/register">{t("nav.signup")}</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile User Info */}
                    {session && (
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={(session.user as any)?.avatar || undefined} />
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {(session.user as any)?.firstName} {(session.user as any)?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{(session.user as any)?.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        placeholder={t("nav.search.placeholder")}
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
                          key={item.key}
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
                        <div className="border-t pt-4 space-y-2">
                          <Link href="/sell" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <Plus className="h-4 w-4" /> {t("nav.sell")}
                          </Link>
                          <Link href="/messages" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <MessageSquare className="h-4 w-4" /> {t("nav.messages")}
                          </Link>
                          <Link href="/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <User className="h-4 w-4" /> {t("nav.profile")}
                          </Link>
                          <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <ShoppingBag className="h-4 w-4" /> {t("nav.dashboard")}
                          </Link>
                          <Link href="/watchlist" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <Heart className="h-4 w-4" /> {t("nav.watchlist")}
                          </Link>
                          <Link href="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-full">
                            <Settings className="h-4 w-4" /> {t("nav.settings")}
                          </Link>
                        </div>
                        <Button 
                          onClick={handleLogout} 
                          variant="outline" 
                          className="w-full justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout")}
                        </Button>
                      </>
                    )}

                    {!session && (
                      <div className="border-t pt-4 space-y-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/auth/login">{t("nav.signin")}</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/auth/register">{t("nav.signup")}</Link>
                        </Button>
                      </div>
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
            <span className="hidden sm:inline">
              ✨ Own a Piece of History – "Mother Ethiopia" by Afewerk Tekle! Limited-edition lithograph.
            </span>
            <span className="sm:hidden">
              ✨ Limited Edition "Mother Ethiopia" Available Now
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

    </>
  );
}
