import SocialButton from "./SocialButton";

export default function Footer() {
  return (
    <footer className="bg-[#0d2135] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0fa8e2] font-bold text-xl">T</span>
              </div>
              <span className="text-white font-semibold text-xl">TenRent</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
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

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-medium mb-4">Help?</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  How Bidding Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Term & Condition
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-white font-medium mb-4">Address</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>113-115 Old Brompton Road</li>
              <li>SW7 3LE LONDON, UNITED KINGDOM</li>
              <li>website :www.mordern.com</li>
              <li>mobile</li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© Copyright 2026, TenRent.com</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Terms & Condition | Privacy Policy
          </p>
        </div>
      </div>
    </footer>
  );
}
