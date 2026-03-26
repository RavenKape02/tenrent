"use client";

import Link from "next/link";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** 'landlord' | 'renter' — enforces which dashboard this is */
  role: "landlord" | "renter";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const isLandlord = user?.user_type === "landlord";
  const isRenterTheme = role === "renter";

  const navBaseClass = "text-gray-600 hover:text-gray-900";
  const activeClass = "text-[#0fa8e2] font-semibold";

  return (
    <div
      className={
        isRenterTheme
          ? "min-h-screen bg-[#05090f] text-slate-100 relative overflow-x-clip"
          : "min-h-screen bg-gray-50"
      }
    >
      {isRenterTheme && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        </div>
      )}

      {isRenterTheme ? (
        <div className="relative z-10">
          <Header />
        </div>
      ) : (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#0fa8e2] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-gray-900 font-semibold text-2xl">
                TenRent
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/listings" className={navBaseClass}>
                Browse Listings
              </Link>
              {isLandlord ? (
                <>
                  <Link
                    href="/landlord"
                    className={role === "landlord" ? activeClass : navBaseClass}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/landlord/listings/new"
                    className="bg-[#ff214f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
                  >
                    + Create Listing
                  </Link>
                </>
              ) : (
                <Link href="/renter" className={navBaseClass}>
                  My Bids
                </Link>
              )}
              {user && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-8 h-8 bg-[#0fa8e2] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </div>
                    <span className="text-sm hidden sm:inline">
                      {user.first_name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-800 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>
      )}

      <div className={isRenterTheme ? "relative z-10" : ""}>{children}</div>
    </div>
  );
}
