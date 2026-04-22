import Header from "../components/Header";
import Footer from "../components/Footer";
import { Search, Gavel, CheckCircle, Home } from "lucide-react";

export default function HowBiddingWorksPage() {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: "1. Find Your Property",
      description: "Browse our curated selection of premium listings. View high-quality photos, virtual tours, and detailed property information to make an informed decision.",
      color: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: <Gavel className="w-6 h-6 text-teal-400" />,
      title: "2. Place Your Bid",
      description: "Submit your offer along with your preferred move-in date and contract length. See the current highest bid to stay competitive without blind guessing.",
      color: "bg-teal-500/10",
      border: "border-teal-500/20"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      title: "3. Landlord Review",
      description: "Landlords review offers based on bid amount and tenant profile strength. Put your best foot forward by completely filling out your TenRent profile.",
      color: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: <Home className="w-6 h-6 text-indigo-400" />,
      title: "4. Move In",
      description: "Once accepted, pay your holding deposit securely through the platform and proceed to digital contract signing to secure your dream home.",
      color: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute top-[28rem] -left-40 h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[140px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-5xl mx-auto px-6 md:px-24 py-24 w-full">
        <div className="text-center mb-20 ds-fade-in">
          <h1 className="ds-h3 mb-4">How Bidding Works</h1>
          <p className="ds-body text-lg text-slate-300 max-w-2xl mx-auto">
            A transparent, fair, and straightforward process to secure your next home without the stress of traditional renting and hidden offers.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line connecting steps */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-teal-500/50 to-indigo-500/10 -translate-x-1/2" />
          
          <div className="space-y-12 md:space-y-24 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full">
                  <div className={`ds-card p-8 border ${step.border} ds-hover-lift`}>
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                      {step.icon}
                    </div>
                    <h3 className="ds-headline mb-3">{step.title}</h3>
                    <p className="ds-body text-slate-400">{step.description}</p>
                  </div>
                </div>
                
                {/* Center Node */}
                <div className="hidden md:flex w-12 h-12 rounded-full bg-[#0b1320] border border-white/20 items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <div className={`w-4 h-4 rounded-full ${step.color} border border-white/30`} />
                </div>
                
                <div className="flex-1 w-full hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
