import Header from "../components/Header";
import Footer from "../components/Footer";
import { Building, Shield, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute top-[28rem] -left-40 h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[140px]" />
        <div className="absolute top-[52rem] -right-36 h-[28rem] w-[28rem] rounded-full bg-sky-500/8 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(6,182,212,0.08),transparent_45%),linear-gradient(180deg,#030711_0%,#050c19_40%,#030711_100%)]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-6 md:px-24 py-24 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 ds-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            <Building className="w-4 h-4" />
            <span>Our Mission</span>
          </div>
          <h1 className="ds-h3 md:text-5xl mb-6">Redefining the Rental Market</h1>
          <p className="ds-body text-lg text-slate-300">
            TenRent was born out of a simple idea: the rental process should be transparent, fair, and efficient for both tenants and landlords.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <div className="ds-card p-8 ds-hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="ds-headline mb-3">Transparency First</h3>
            <p className="ds-body text-slate-400">
              No more blind offers. See real-time bids and make informed decisions about your next home without the guesswork.
            </p>
          </div>
          <div className="ds-card p-8 ds-hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="ds-headline mb-3">Community Driven</h3>
            <p className="ds-body text-slate-400">
              Building trust between verified landlords and prospective tenants through open communication and clear profile systems.
            </p>
          </div>
          <div className="ds-card p-8 ds-hover-lift">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="ds-headline mb-3">Market Fairness</h3>
            <p className="ds-body text-slate-400">
              True market value is determined by the community, eliminating arbitrary pricing, hidden fees, and bidding wars.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="ds-card-lg p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="ds-h4 mb-6">Our Story</h2>
            <div className="space-y-4 ds-body text-slate-300">
              <p>
                Founded in 2026, TenRent started when our founders experienced the frustration of London's ultra-competitive rental market firsthand. After losing out on multiple properties to hidden bids, they decided there had to be a better way.
              </p>
              <p>
                Today, we've helped thousands of tenants secure homes at fair prices while giving landlords the security of verified, high-quality applicants through a beautiful, seamless digital experience.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full relative">
             <div className="aspect-video rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-white/10 flex items-center justify-center liquid-glass">
                <span className="text-white/30 font-medium">Video/Image Placeholder</span>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
