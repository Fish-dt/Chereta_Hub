
"use client";

import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedAuctions } from "@/components/featured-auctions";
import { EndingSoonAuctions } from "@/components/ending-soon";
import { GoogleSigninPopup } from "@/components/google-signin-popup";

export default function HomePage() {
  return (
    <>
      <GoogleSigninPopup />
      <div className="space-y-16">
        <FeaturedAuctions />
        <EndingSoonAuctions />
        <CategoriesSection />
      </div>
    </>
  );
}
