import Header from "../components/Header";
import Footer from "../components/Footer";
import { Handshake, ArrowRight, CheckCircle2, Building } from "lucide-react";

export default function PartnersPage() {
  const benefits = [
    "Priority listing placement",
    "Verified tenant profiles",
    "Automated bidding management",
    "Dedicated account manager",
    "Market analytics dashboard",
    "Premium support channel"
  ];

  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute top-[28rem] -left-40 h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_38%),radial-gradient(circle_at_80%_15%,rgba(6,182,212,0.08),transparent_45%),linear-gradient(180deg,#030711_0%,#050c19_40%,#030711_100%)]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-6 md:px-24 py-24 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 ds-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium">
            <Handshake className="w-4 h-4" />
            <span>Partner Network</span>
          </div>
          <h1 className="ds-h3 md:text-5xl mb-6">Grow With TenRent</h1>
          <p className="ds-body text-lg text-slate-300">
            Join the most innovative network of real estate agencies and property managers. Accelerate your letting process with transparency.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
          <div className="space-y-8">
            <div className="ds-card p-8">
              <h3 className="ds-headline mb-6 text-cyan-50">Why Partner With Us?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="ds-body text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="ds-panel p-8 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg mb-1">Ready to start?</h4>
                <p className="ds-footnote text-slate-400">Get in touch with our partnership team.</p>
              </div>
              <button className="ds-btn ds-btn-primary">
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="ds-card aspect-square flex flex-col items-center justify-center p-6 text-center ds-hover-lift">
                <div className="w-16 h-16 rounded-full bg-white/5 mb-4 flex items-center justify-center">
                  <Building className="w-8 h-8 text-white/20" />
                </div>
                <div className="font-medium text-slate-200">Agency {i}</div>
                <div className="ds-small text-slate-500 mt-1">Premium Partner</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
