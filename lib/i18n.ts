export const languages = {
  en: "English",
  am: "አማርኛ",
} as const

export type Language = keyof typeof languages

export const translations = {
  en: {
    // Navigation
    "nav.browse": "Browse Auctions",
    "nav.categories": "Categories",
    "nav.sell": "Start Selling",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.dashboard": "Dashboard",
    "nav.profile": "My Profile",
    "nav.bids": "My Bids",
    "nav.watchlist": "Watchlist",
    "nav.settings": "Settings",
    "nav.signout": "Sign Out",
    "nav.messages": "Messages",

    // Hero Section
    "hero.title": "CheretaHub",
    "hero.subtitle": "Discover unique items, place winning bids, and find treasures from around the world",
    "hero.search.placeholder": "Search auctions...",
    "hero.search.button": "Search",
    "hero.browse": "Browse Auctions",
    "hero.start.selling": "Start Selling",

    // Stats
    "stats.users": "Active Users",
    "stats.auctions": "Live Auctions",
    "stats.sold": "Items Sold",
    "stats.success": "Success Rate",

    // Categories
    "categories.title": "Browse Categories",
    "categories.subtitle": "Explore our diverse range of auction categories and find exactly what you're looking for",
    "categories.vehicles": "Vehicles",
    "categories.art": "Art & Collectibles",
    "categories.jewelry": "Jewelry",
    "categories.home": "Home & Garden",
    "categories.electronics": "Electronics",
    "categories.photography": "Photography",

    // Auctions
    "auctions.featured": "Featured Auctions",
    "auctions.featured.subtitle": "Don't miss out on these premium items ending soon",
    "auctions.current.bid": "Current Bid",
    "auctions.bids": "Bids",
    "auctions.ends.in": "Ends in",
    "auctions.place.bid": "Place Bid",
    "auctions.view.all": "View All Auctions",
    "auctions.buy.now": "Buy It Now",
    "auctions.watch": "Watch",
    "auctions.watching": "Watching",
    "auctions.share": "Share",
    "auctions.report": "Report",
    "auctions.pending.review": "Pending Review",
    "auctions.approved": "Approved",
    "auctions.rejected": "Rejected",

    // Bidding
    "bidding.highest.bidder": "You are the highest bidder!",
    "bidding.outbid": "You have been outbid!",
    "bidding.won": "Congratulations! You won this auction!",
    "bidding.lost": "Auction ended. You didn't win this time.",
    "bidding.contact.seller": "Contact Seller",
    "bidding.contact.winner": "Contact Winner",

    // Authentication
    "auth.signin.title": "Sign in to your account",
    "auth.signin.subtitle": "Or create a new account",
    "auth.signup.title": "Create your account",
    "auth.signup.subtitle": "Already have an account? Sign in here",
    "auth.email": "Email address",
    "auth.password": "Password",
    "auth.confirm.password": "Confirm password",
    "auth.first.name": "First name",
    "auth.last.name": "Last name",
    "auth.remember": "Remember me",
    "auth.forgot.password": "Forgot your password?",
    "auth.signin.button": "Sign in",
    "auth.signup.button": "Create account",
    "auth.terms": "I agree to the Terms of Service and Privacy Policy",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Manage your auctions, bids, and account",
    "dashboard.active.bids": "Active Bids",
    "dashboard.watching": "Watching",
    "dashboard.total.spent": "Total Spent",
    "dashboard.items.sold": "Items Sold",
    "dashboard.bidding": "Bidding",
    "dashboard.selling": "Selling",
    "dashboard.history": "History",
    "dashboard.messages": "Messages",

    // Messages
    "messages.title": "Messages",
    "messages.no.conversations": "No conversations yet",
    "messages.start.conversation": "Start a conversation",
    "messages.type.message": "Type a message...",
    "messages.send": "Send",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.mark.read": "Mark as read",
    "notifications.mark.all.read": "Mark all as read",
    "notifications.no.notifications": "No notifications",

    // Common
    "common.loading": "Loading...",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort by",
    "common.view": "View",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.approve": "Approve",
    "common.reject": "Reject",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
  },
  am: {
    // Navigation
    "nav.browse": "ጨረታዎችን ያስሱ",
    "nav.categories": "ምድቦች",
    "nav.sell": "መሸጥ ይጀምሩ",
    "nav.signin": "ግባ",
    "nav.signup": "ተመዝገብ",
    "nav.dashboard": "ዳሽቦርድ",
    "nav.profile": "የእኔ መገለጫ",
    "nav.bids": "የእኔ ጨረታዎች",
    "nav.watchlist": "የክትትል ዝርዝር",
    "nav.settings": "ቅንብሮች",
    "nav.signout": "ውጣ",
    "nav.messages": "መልዕክቶች",

    // Hero Section
    "hero.title": "ጨረታ ማዕከል",
    "hero.subtitle": "ልዩ ዕቃዎችን ያግኙ፣ አሸናፊ ጨረታዎችን ያድርጉ እና ከዓለም ዙሪያ ሀብቶችን ያግኙ",
    "hero.search.placeholder": "ጨረታዎችን ይፈልጉ...",
    "hero.search.button": "ፈልግ",
    "hero.browse": "ጨረታዎችን ያስሱ",
    "hero.start.selling": "መሸጥ ይጀምሩ",

    // Stats
    "stats.users": "ንቁ ተጠቃሚዎች",
    "stats.auctions": "ቀጥታ ጨረታዎች",
    "stats.sold": "የተሸጡ ዕቃዎች",
    "stats.success": "የስኬት መጠን",

    // Categories
    "categories.title": "ምድቦችን ያስሱ",
    "categories.subtitle": "የተለያዩ የጨረታ ምድቦቻችንን ያስሱ እና በትክክል የሚፈልጉትን ያግኙ",
    "categories.vehicles": "ተሽከርካሪዎች",
    "categories.art": "ጥበብ እና ሰብሳቢዎች",
    "categories.jewelry": "ጌጣጌጥ",
    "categories.home": "ቤት እና የአትክልት ስፍራ",
    "categories.electronics": "ኤሌክትሮኒክስ",
    "categories.photography": "ፎቶግራፊ",

    // Auctions
    "auctions.featured": "ተመራጭ ጨረታዎች",
    "auctions.featured.subtitle": "በቅርቡ የሚያበቁ እነዚህን ልዩ ዕቃዎች አያመልጡ",
    "auctions.current.bid": "የአሁኑ ጨረታ",
    "auctions.bids": "ጨረታዎች",
    "auctions.ends.in": "የሚያበቃው በ",
    "auctions.place.bid": "ጨረታ አድርግ",
    "auctions.view.all": "ሁሉንም ጨረታዎች ይመልከቱ",
    "auctions.buy.now": "አሁን ግዛ",
    "auctions.watch": "ተከታተል",
    "auctions.watching": "እየተከታተለ",
    "auctions.share": "አጋራ",
    "auctions.report": "ሪፖርት",
    "auctions.pending.review": "በመገምገም ላይ",
    "auctions.approved": "ተቀባይነት አግኝቷል",
    "auctions.rejected": "ተቀባይነት አላገኘም",

    // Bidding
    "bidding.highest.bidder": "እርስዎ ከፍተኛ ጨረታ አቅራቢ ነዎት!",
    "bidding.outbid": "ጨረታዎ ተሸንፏል!",
    "bidding.won": "እንኳን ደስ አለዎት! ይህን ጨረታ አሸንፈዋል!",
    "bidding.lost": "ጨረታው አብቅቷል። ይህን ጊዜ አላሸነፉም።",
    "bidding.contact.seller": "ሻጩን ያነጋግሩ",
    "bidding.contact.winner": "አሸናፊውን ያነጋግሩ",

    // Authentication
    "auth.signin.title": "ወደ መለያዎ ይግቡ",
    "auth.signin.subtitle": "ወይም አዲስ መለያ ይፍጠሩ",
    "auth.signup.title": "መለያዎን ይፍጠሩ",
    "auth.signup.subtitle": "መለያ አለዎት? እዚህ ይግቡ",
    "auth.email": "የኢሜይል አድራሻ",
    "auth.password": "የይለፍ ቃል",
    "auth.confirm.password": "የይለፍ ቃል ያረጋግጡ",
    "auth.first.name": "የመጀመሪያ ስም",
    "auth.last.name": "የአባት ስም",
    "auth.remember": "አስታውሰኝ",
    "auth.forgot.password": "የይለፍ ቃልዎን ረሱት?",
    "auth.signin.button": "ግባ",
    "auth.signup.button": "መለያ ፍጠር",
    "auth.terms": "የአገልግሎት ውሎችን እና የግላዊነት ፖሊሲን እቀበላለሁ",

    // Dashboard
    "dashboard.title": "ዳሽቦርድ",
    "dashboard.subtitle": "ጨረታዎችዎን፣ ጨረታዎችዎን እና መለያዎን ያስተዳድሩ",
    "dashboard.active.bids": "ንቁ ጨረታዎች",
    "dashboard.watching": "እየተከታተለ",
    "dashboard.total.spent": "ጠቅላላ የወጣ",
    "dashboard.items.sold": "የተሸጡ ዕቃዎች",
    "dashboard.bidding": "ጨረታ",
    "dashboard.selling": "መሸጥ",
    "dashboard.history": "ታሪክ",
    "dashboard.messages": "መልዕክቶች",

    // Messages
    "messages.title": "መልዕክቶች",
    "messages.no.conversations": "ገና ምንም ውይይት የለም",
    "messages.start.conversation": "ውይይት ይጀምሩ",
    "messages.type.message": "መልዕክት ይተይቡ...",
    "messages.send": "ላክ",

    // Notifications
    "notifications.title": "ማሳወቂያዎች",
    "notifications.mark.read": "እንደተነበበ ምልክት አድርግ",
    "notifications.mark.all.read": "ሁሉንም እንደተነበበ ምልክት አድርግ",
    "notifications.no.notifications": "ማሳወቂያ የለም",

    // Common
    "common.loading": "እየጫነ...",
    "common.search": "ፈልግ",
    "common.filter": "ማጣሪያ",
    "common.sort": "ደርድር በ",
    "common.view": "ይመልከቱ",
    "common.edit": "አርትዕ",
    "common.delete": "ሰርዝ",
    "common.save": "አስቀምጥ",
    "common.cancel": "ሰርዝ",
    "common.close": "ዝጋ",
    "common.back": "ተመለስ",
    "common.next": "ቀጣይ",
    "common.previous": "ቀዳሚ",
    "common.approve": "ተቀበል",
    "common.reject": "ውድቅ አድርግ",

    // Theme
    "theme.light": "ብሩህ",
    "theme.dark": "ጨለማ",
    "theme.system": "ስርዓት",
  },
} as const

export function useTranslation(language: Language = "en") {
  return {
    t: (key: keyof typeof translations.en) => {
      return translations[language][key] || translations.en[key] || key
    },
    language,
    languages,
  }
}
