import Header from "../components/Header";
import Footer from "../components/Footer";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030711] text-slate-100 relative overflow-x-clip flex flex-col">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-teal-900/10 blur-[120px]" />
      </div>

      <Header />

      <main className="relative z-10 flex-grow max-w-4xl mx-auto px-6 md:px-24 py-24 w-full">
        <div className="ds-card-lg p-8 md:p-14 ds-fade-in">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <ShieldAlert className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="ds-h4 mb-1">Privacy Policy</h1>
              <p className="ds-footnote text-slate-400">Effective Date: April 22, 2026</p>
            </div>
          </div>
          
          <div className="space-y-8 ds-body text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Your Privacy Matters</h2>
              <p className="mb-4">
                At TenRent, we are committed to protecting your personal data and respecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our transparent rental bidding platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li><strong className="text-slate-200">Account Information:</strong> Name, email address, phone number, and password used to create and authenticate your account.</li>
                <li><strong className="text-slate-200">Profile Data:</strong> Employment status, income brackets, and rental history used to strengthen your tenant profile for landlords.</li>
                <li><strong className="text-slate-200">Financial Data:</strong> Payment information processed securely by our payment providers (e.g., Stripe). We do not store full credit card details on our servers.</li>
                <li><strong className="text-slate-200">Activity Data:</strong> Bidding history, saved properties, search queries, and communication with landlords through the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Data</h2>
              <p className="mb-4">
                We use your data primarily to facilitate the bidding process and ensure a safe, trustworthy environment. This includes verifying user identities, communicating bid updates, processing holding deposits, and preventing fraud.
              </p>
              <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/10 mt-4">
                <p className="text-sm text-cyan-200/80">
                  <strong className="text-cyan-100">Visibility Note:</strong> When you place a bid, the landlord sees your offer amount and general profile strength indicators. Your direct personal contact information (email, phone number) remains completely private until a bid is officially accepted by both parties.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
              <p className="mb-4">
                We implement a variety of security measures to maintain the safety of your personal information. Your data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
