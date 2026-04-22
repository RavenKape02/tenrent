"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How does the bidding process work?",
    answer: "Once you find a property you like, you can submit a bid. You will see the current highest bid (but not who placed it). If your bid is accepted by the landlord, you'll be notified immediately to proceed with referencing."
  },
  {
    question: "Is my bid legally binding?",
    answer: "Bids are expressions of interest. However, consistent withdrawal of accepted bids may result in account restriction to maintain platform integrity. You are only legally bound once you sign the tenancy agreement."
  },
  {
    question: "Do I have to pay to place a bid?",
    answer: "No, placing a bid is completely free. You only pay the holding deposit if your bid is accepted by the landlord and you choose to proceed with the tenancy."
  },
  {
    question: "How does TenRent protect against artificial price inflation?",
    answer: "We employ advanced algorithms and manual checks to ensure all bids are genuine. Landlords cannot bid on their own properties, and we require verified profiles for all participating users."
  },
  {
    question: "What happens if multiple people bid the exact same amount?",
    answer: "In the event of a tie, the landlord can review the accompanying tenant profiles (move-in dates, contract lengths, rental history) to make their decision, or we prioritize the earliest placed bid."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[140px]" />
        <div className="absolute top-[28rem] -left-40 h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[140px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-4xl mx-auto px-6 md:px-24 py-24 w-full">
        <div className="text-center mb-16 ds-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 mb-6">
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="ds-h3 mb-4">Frequently Asked Questions</h1>
          <p className="ds-body text-lg text-slate-300">Everything you need to know about the TenRent platform and bidding process.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={cn(
                "ds-card overflow-hidden transition-all duration-300 cursor-pointer border",
                openIndex === index ? "border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)] bg-white/[0.08]" : "border-transparent"
              )}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="p-6 flex items-center justify-between">
                <h3 className="font-medium text-lg pr-8 text-cyan-50">{faq.question}</h3>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0", openIndex === index ? "rotate-180 text-cyan-400" : "")} />
              </div>
              <div 
                className={cn(
                  "px-6 transition-all duration-300 ease-in-out",
                  openIndex === index ? "pb-6 max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                )}
              >
                <div className="h-px w-full bg-gradient-to-r from-cyan-500/20 to-transparent mb-4" />
                <p className="ds-body text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
