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
  const isLandlordDashboardActive = pathname.startsWith("/landlord");
  const isRenterDashboardActive = pathname.startsWith("/renter");

  const navLinkClass = (active: boolean) =>
    `relative px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
      active
        ? "text-[#67e8f9] bg-white/[0.08]"
        : "text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-white/[0.05]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div
          className="flex items-center justify-between rounded-[10px] px-5 py-3"
          style={{
            background: "rgba(11, 19, 32, 0.80)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 10px 10px rgba(0,0,0,0.10), 0 4px 4px rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.05)",
          }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center shadow-[0_6px_18px_rgba(6,182,212,0.35)] transition-shadow group-hover:shadow-[0_8px_24px_rgba(6,182,212,0.45)]">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              TenRent
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/" className={navLinkClass(isHomeActive)}>
              Home
            </Link>
            <Link href="/listings" className={navLinkClass(isListingsActive)}>
              Browse
            </Link>
            {user ? (
              <>
                {isLandlord ? (
                  <Link
                    href="/landlord"
                    className={navLinkClass(isLandlordDashboardActive)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/renter"
                    className={navLinkClass(isRenterDashboardActive)}
                  >
                    My Bids
                  </Link>
                )}

                <div className="w-px h-5 bg-white/10 mx-2" />

                {isLandlord && (
                  <Link
                    href="/landlord/listings/new"
                    className="ds-btn text-[13px] h-9 px-3 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-lg font-medium shadow-[0_4px_14px_rgba(6,182,212,0.30)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.40)] hover:from-cyan-400 hover:to-sky-500 transition-all"
                  >
                    <span className="text-base leading-none">+</span> New Listing
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-2 text-[13px] font-medium text-[rgba(255,255,255,0.5)] hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="ds-btn h-9 px-4 text-[13px] bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-lg font-medium shadow-[0_4px_14px_rgba(6,182,212,0.30)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.40)] hover:from-cyan-400 hover:to-sky-500 transition-all"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
