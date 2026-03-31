"use client";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageCarousel from "./components/ImageCarousel";
import ActiveAuctions from "./components/ActiveAuctions";
import LandlordCTA from "./components/LandlordCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute top-[28rem] -left-40 h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[140px]" />
        <div className="absolute top-[52rem] -right-36 h-[28rem] w-[28rem] rounded-full bg-sky-500/8 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(6,182,212,0.08),transparent_45%),linear-gradient(180deg,#030711_0%,#050c19_40%,#030711_100%)]" />
      </div>

      <section className="relative z-10">
        <Header />
        <HeroSection />

        <div className="max-w-7xl mx-auto px-6 md:px-24 pb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        <div className="relative">
          <ImageCarousel />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-24 pb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        <ActiveAuctions />
        <LandlordCTA />
      </section>

      <Footer />
    </div>
  );
}
