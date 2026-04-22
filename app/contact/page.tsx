"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
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
        <div className="grid lg:grid-cols-5 gap-12 ds-fade-in">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="ds-h3 mb-4">Get in Touch</h1>
              <p className="ds-body text-slate-300">
                Whether you have a question about bidding, need help with your account, or want to partner with us, our team is ready to help.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="ds-panel p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 shrink-0">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Support</h4>
                  <p className="ds-footnote text-slate-400 mb-2">Typically replies within 24 hours.</p>
                  <a href="mailto:hello@tenrent.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">hello@tenrent.com</a>
                </div>
              </div>

              <div className="ds-panel p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10 shrink-0">
                  <Phone className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="ds-footnote text-slate-400 mb-2">Mon-Fri from 9am to 6pm (GMT).</p>
                  <a href="tel:+442071234567" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">+44 20 7123 4567</a>
                </div>
              </div>

              <div className="ds-panel p-6 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 shrink-0">
                  <MapPin className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Office</h4>
                  <p className="ds-footnote text-slate-400">113-115 Old Brompton Road<br/>SW7 3LE London, UK</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="ds-card-lg p-8 md:p-10">
              <h3 className="ds-headline mb-6">Send us a message</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="ds-input-label">First Name</label>
                    <input type="text" className="ds-input" placeholder="John" />
                  </div>
                  <div>
                    <label className="ds-input-label">Last Name</label>
                    <input type="text" className="ds-input" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="ds-input-label">Email Address</label>
                  <input type="email" className="ds-input" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="ds-input-label">Subject</label>
                  <select className="ds-input appearance-none bg-transparent">
                    <option value="" className="bg-[#0b1320] text-slate-400">Select a topic...</option>
                    <option value="support" className="bg-[#0b1320]">General Support</option>
                    <option value="billing" className="bg-[#0b1320]">Billing Inquiry</option>
                    <option value="partnership" className="bg-[#0b1320]">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="ds-input-label">Message</label>
                  <textarea className="ds-input min-h-[120px] py-3" placeholder="How can we help you?"></textarea>
                </div>

                <button className="ds-btn ds-btn-primary w-full mt-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
