'use client';

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";

// Hero section images
const heroPhoneImage =
  "https://www.figma.com/api/mcp/asset/fbf51885-b446-46eb-b09f-1e773bb637e4";
const heroPoolImage =
  "https://www.figma.com/api/mcp/asset/aeeae5d0-eb83-449f-a0b7-e555ced9233b";
const heroArchImage1 =
  "https://www.figma.com/api/mcp/asset/4381d5ed-04c0-4d83-a54e-bb7247ff8d2d";
const heroArchImage2 =
  "https://www.figma.com/api/mcp/asset/3f40a612-a0b0-4524-8e36-012cd5932f71";
const heroArchImage3 =
  "https://www.figma.com/api/mcp/asset/d26c6d7b-1ca3-4c13-a783-9cb767ad10a1";

export default function Home() {
  const { user, logout } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
      <SignUpModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />

      {/* Header */}
      <header className="bg-[#0fa8e2] py-4 px-6 md:px-24 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#0fa8e2] font-bold text-xl">T</span>
            </div>
            <span className="text-white font-semibold text-2xl md:text-3xl">
              Tenrent
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#"
              className="text-white text-lg hover:underline underline underline-offset-4"
            >
              Home
            </a>
            <a href="#" className="text-white text-lg hover:underline">
              Browse Listings
            </a>
            <a href="#" className="text-white text-lg hover:underline">
              How It Works
            </a>
            {user ? (
              <>
                <span className="text-white text-sm">
                  Welcome, {user.first_name}!
                </span>
                <button 
                  onClick={logout}
                  className="bg-white text-[#0fa8e2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowSignIn(true)}
                  className="bg-white text-[#0fa8e2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setShowSignUp(true)}
                  className="bg-[#ff214f] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
          <button className="text-white md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#090a0c] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-24 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-[2px] bg-gray-500"></div>
                <span className="text-gray-500 text-lg">
                  Win your dream rental
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
                Bid for Priority Access
                <br />
                to Premium Rentals
                <br />
                Through Transparent Competition
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-3 bg-[#ff214f] text-white rounded-full px-8 py-4 hover:bg-[#e01d45] transition-colors">
                  <span className="text-lg">Browse Properties</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button className="flex items-center justify-center gap-3 border-2 border-white text-white rounded-full px-8 py-4 hover:bg-white hover:text-[#090a0c] transition-colors">
                  <span className="text-lg">List Your Property</span>
                </button>
              </div>
            </div>

            {/* Hero Images Grid */}
            <div className="hidden lg:block relative">
              {/* Frosted glass panel */}
              <div className="absolute -top-8 right-0 w-[400px] h-[250px] bg-white/20 backdrop-blur-sm rounded-lg shadow-lg"></div>

              {/* Image collage */}
              <div className="relative mt-32 grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-32 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={heroArchImage2}
                        alt="Property"
                        width={128}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="w-40 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={heroArchImage1}
                        alt="Property"
                        width={160}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-32 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={heroArchImage1}
                        alt="Property"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="w-40 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={heroArchImage3}
                        alt="Property"
                        width={160}
                        height={128}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden h-64">
                  <Image
                    src={heroPoolImage}
                    alt="Pool Property"
                    width={200}
                    height={256}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-center text-xl font-light">
                      Let&apos;s purchase your
                      <br />
                      dream place
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Property Cards */}
        <div className="bg-[#090a0c] pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-24">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl text-white font-light">
                How It Works
              </h2>
              <p className="text-gray-400 mt-4">
                Three simple steps to win your dream rental
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#ff214f] rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Browse Listings
                </h3>
                <p className="text-gray-400">
                  Explore available properties with active bidding windows
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#ff214f] rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Place Your Bid
                </h3>
                <p className="text-gray-400">
                  Offer a premium for priority consideration
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#ff214f] rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Win & Apply
                </h3>
                <p className="text-gray-400">
                  Highest bidder gets exclusive first access
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Auctions Section */}
      <section className="bg-[#14395b] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Active Auctions
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Properties accepting bids right now. Place your bid before time runs out!
            </p>
          </div>

          {/* Property Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <PropertyCard key={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
          </div>
        </div>
      </section>

      {/* Why Choose TenRent Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#186aa5] mb-4">
              Why Choose TenRent?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A transparent and fair marketplace for competitive rental markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#186aa5] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transparent Pricing
              </h3>
              <p className="text-gray-600">
                See exactly what others are willing to pay. No hidden fees or surprises.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#186aa5] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fair Competition
              </h3>
              <p className="text-gray-600">
                Everyone gets an equal shot at their dream place. May the best bid win.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#186aa5] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Funds held safely until bidding ends. Full refund if you don't win.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#14395b] text-white px-10 py-5 rounded-2xl text-xl hover:bg-[#0d2a42] transition-colors shadow-md">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Landlord CTA Section */}
      <section className="bg-[#14395b] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Are You a Property Owner?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              List your property and let renters compete for it. Discover the true market value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">$250</div>
              <p className="text-gray-300">Average Premium Earned</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">7 Days</div>
              <p className="text-gray-300">Typical Bidding Window</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <p className="text-gray-300">You Keep of Premium</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="bg-[#ff214f] text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-[#e01d45] transition-colors shadow-lg">
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d2135] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#0fa8e2] font-bold text-xl">T</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  TenRent
                </span>
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
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
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
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    How Bidding Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Term & Condition
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
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
            <p className="text-gray-400 text-sm">
              © Copyright 2026, TenRent.com
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Terms & Condition | Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Property Card Component
function PropertyCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <div className="relative">
        <Image
          src="https://www.figma.com/api/mcp/asset/92928cbf-c2d5-4fc0-b76d-e0477b83c28b"
          alt="Property"
          width={376}
          height={277}
          className="w-full h-48 object-cover"
          unoptimized
        />
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded uppercase font-semibold">
          Accepting Bids
        </span>
        {/* Heart/Save Icon */}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Knightsbridge</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-3">Apartment London</h3>
        
        {/* Bidding Information */}
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Base Rent:</span>
            <span className="text-sm font-semibold text-gray-900">$1,500/mo</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">High Bid:</span>
            <span className="text-lg font-bold text-[#ff214f]">+$200</span>
          </div>
          <div className="border-t border-blue-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Total:</span>
              <span className="text-base font-bold text-blue-600">$1,700/mo</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 mb-3 text-orange-600 bg-orange-50 px-3 py-2 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-semibold">Ends in: 2d 14h</span>
        </div>

        <p className="text-gray-500 text-xs mb-4 line-clamp-2">
          Beautiful Huge 1 family House in heart of westbury newly Renovated
          With New Furniture
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 bg-blue-50 border border-blue-500/30 rounded px-2 py-2 w-fit">
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
              <p className="text-gray-500 text-[10px]">bedrooms</p>
            </div>
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
              <p className="text-gray-500 text-[10px]">bathrooms</p>
            </div>
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">1776</span>
              <p className="text-gray-500 text-[10px]">squre ft</p>
            </div>
          </div>
          <button className="bg-[#14395b] text-white px-4 py-3 rounded-lg hover:bg-[#0d2a42] transition-colors w-full font-semibold">
            View & Bid
          </button>
        </div>
      </div>
    </div>
  );
}

// Social Button Component
function SocialButton({ icon }: { icon: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#186aa5] flex items-center justify-center cursor-pointer hover:bg-[#0fa8e2] transition-colors">
      {icon === "facebook" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
        </svg>
      )}
      {icon === "twitter" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
        </svg>
      )}
      {icon === "instagram" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )}
      {icon === "dribbble" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z" />
        </svg>
      )}
    </div>
  );
}
