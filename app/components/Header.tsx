"use client";

import Link from "next/link";
import { Manrope } from "next/font/google";
import { useAuth } from "../contexts/AuthContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/30 bg-white/6 px-4 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150 md:px-8 md:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-inner shadow-white/60">
            <span className="text-xl font-extrabold text-[#0b82ae]">T</span>
          </div>
          <span
            className={`${manrope.className} text-2xl font-semibold tracking-tight text-white md:text-3xl`}
          >
            Tenrent
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`${manrope.className} text-sm font-medium uppercase tracking-[0.12em] text-white/90 transition hover:text-white`}
          >
            Home
          </Link>
          <Link
            href="/listings"
            className={`${manrope.className} text-sm font-medium uppercase tracking-[0.12em] text-white/90 transition hover:text-white`}
          >
            Browse Listings
          </Link>
          <Link
            href="#"
            className={`${manrope.className} text-sm font-medium uppercase tracking-[0.12em] text-white/90 transition hover:text-white`}
          >
            How It Works
          </Link>
          {user ? (
            <>
              <span className={`${manrope.className} text-sm text-white/85`}>
                Welcome, {user.first_name}!
              </span>
              <button
                onClick={logout}
                className={`${manrope.className} rounded-xl border border-white/60 bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#0b82ae] shadow-sm shadow-cyan-100 transition hover:bg-white`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className={`${manrope.className} rounded-xl border border-white/60 bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#0b82ae] shadow-sm shadow-cyan-100 transition hover:bg-white`}
            >
              Sign In
            </Link>
          )}
        </nav>
        <button
          className="rounded-lg p-2 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Open menu"
        >
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
  );
}
