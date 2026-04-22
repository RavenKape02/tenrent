import Header from "../components/Header";
import Footer from "../components/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-4xl mx-auto px-6 md:px-24 py-24 w-full">
        <div className="ds-card-lg p-8 md:p-14 ds-fade-in">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h1 className="ds-h4 mb-1">Terms & Conditions</h1>
              <p className="ds-footnote text-slate-400">Last updated: April 22, 2026</p>
            </div>
          </div>
          
          <div className="space-y-8 ds-body text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p className="mb-4">
                By accessing or using TenRent's transparent bidding platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. The Bidding Process</h2>
              <p className="mb-4">
                TenRent provides a platform for landlords to list properties and for prospective tenants to place bids. 
                All bids are considered expressions of interest. While we encourage fair play, placing a bid does not legally bind you to a tenancy agreement until a formal contract is signed.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>Landlords retain the right to accept any bid based on their own criteria, not exclusively the highest monetary value.</li>
                <li>Users found placing fraudulent bids to artificially inflate prices will be permanently banned from the platform.</li>
                <li>Holding deposits are processed securely via Stripe and are subject to their specific terms of service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="mb-4">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You must provide accurate and complete information upon registration and maintain the accuracy of such information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
              <p className="mb-4">
                TenRent acts as an intermediary platform. We do not own or manage the properties listed, nor do we guarantee the condition of the properties. TenRent shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use the Service.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
