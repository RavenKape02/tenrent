"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isLandlord = user?.user_type === "landlord";
  const isHomeActive = pathname === "/";
  const isListingsActive = pathname.startsWith("/listings");

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070c14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-linear-to-br from-cyan-400 to-sky-600 rounded-xl flex items-center justify-center shadow-[0_10px_30px_rgba(14,165,233,0.35)]">
            <span className="text-white font-black text-xl">T</span>
          </div>
          <span className="text-slate-100 font-semibold text-2xl tracking-tight">
            TenRent
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`transition-colors ${
              isHomeActive
                ? "text-cyan-300 font-semibold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/listings"
            className={`transition-colors ${
              isListingsActive
                ? "text-cyan-300 font-semibold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Browse Listings
          </Link>
          {user ? (
            <>
              {isLandlord ? (
                <Link
                  href="/landlord"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Landlord Dashboard
                </Link>
              ) : (
                <Link
                  href="/renter"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  My Bids
                </Link>
              )}
              {isLandlord && (
                <Link
                  href="/landlord/listings/new"
                  className="bg-white/10 border border-white/20 text-cyan-200 px-4 py-2 rounded-xl font-semibold hover:bg-white/15 hover:border-cyan-300/40 transition-all"
                >
                  + Create Listing
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-white/5 border border-white/20 text-slate-200 px-4 py-2 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="bg-linear-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all"
            >
              Sign in to bid
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
