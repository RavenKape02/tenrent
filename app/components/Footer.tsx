import Link from "next/link";
import SocialButton from "./SocialButton";
import TenRentLogo from "./TenRentLogo";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-8">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] shadow-[0_6px_18px_rgba(6,182,212,0.12)]">
                  <TenRentLogo />
                </div>
                <span className="text-white font-semibold text-lg tracking-tight">
                  TenRent
                </span>
              </div>
              <p className="ds-footnote mb-6 leading-relaxed max-w-[220px]">
                Transparent bidding marketplace
                <br />
                for competitive rental markets
              </p>
              <div className="flex gap-2">
                <SocialButton icon="facebook" />
                <SocialButton icon="twitter" />
                <SocialButton icon="instagram" />
                <SocialButton icon="dribbble" />
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="ds-caption uppercase tracking-[0.12em] text-white/90 mb-5 font-semibold">
                Useful Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="ds-caption uppercase tracking-[0.12em] text-white/90 mb-5 font-semibold">
                Help
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-bidding-works"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    How Bidding Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="ds-footnote hover:text-cyan-300 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="ds-caption uppercase tracking-[0.12em] text-white/90 mb-5 font-semibold">
                Address
              </h3>
              <ul className="space-y-3">
                <li className="ds-footnote">113-115 Old Brompton Road</li>
                <li className="ds-footnote">SW7 3LE LONDON, UNITED KINGDOM</li>
                <li className="ds-footnote">website: www.tenrent.com</li>
                <li className="ds-footnote">mobile</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="ds-small">
              © Copyright 2026, TenRent.com
            </p>
            <p className="ds-small mt-4 md:mt-0">
              Terms & Condition | Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
