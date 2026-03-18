import SocialButton from "./SocialButton";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-8 border-t border-white/10 bg-[#050c19]/75 backdrop-blur-xl pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-linear-to-br from-cyan-400 to-sky-600 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(14,165,233,0.35)]">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-white font-semibold text-xl">TenRent</span>
            </div>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Transparent bidding marketplace
              <br />
              for competitive rental markets
            </p>
            <div className="flex gap-3">
              <SocialButton icon="facebook" />
              <SocialButton icon="twitter" />
              <SocialButton icon="instagram" />
              <SocialButton icon="dribbble" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4 uppercase tracking-[0.08em] text-sm">
              Useful Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4 uppercase tracking-[0.08em] text-sm">
              Help
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  How Bidding Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  Term & Condition
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-300 hover:text-cyan-200 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4 uppercase tracking-[0.08em] text-sm">
              Address
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>113-115 Old Brompton Road</li>
              <li>SW7 3LE LONDON, UNITED KINGDOM</li>
              <li>website :www.mordern.com</li>
              <li>mobile</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © Copyright 2026, TenRent.com
          </p>
          <p className="text-slate-400 text-sm mt-4 md:mt-0">
            Terms & Condition | Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
