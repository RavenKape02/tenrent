"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

function TenRentLogo({
  size = 22,
  mono = false,
}: {
  size?: number;
  mono?: boolean;
}) {
  const id = mono ? "c3m" : "c3";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="64" x2="64" y2="0">
          <stop stopColor={mono ? "#ffffff" : "#06b6d4"} />
          <stop offset="1" stopColor={mono ? "#ffffff" : "#38bdf8"} />
        </linearGradient>
      </defs>
      <rect
        x="32"
        y="4"
        width="24"
        height="24"
        rx="5"
        transform="rotate(45 32 4)"
        fill={`url(#${id}g)`}
        opacity={mono ? 0.3 : 0.25}
      />
      <rect
        x="32"
        y="14"
        width="20"
        height="20"
        rx="4"
        transform="rotate(45 32 14)"
        fill={`url(#${id}g)`}
        opacity={mono ? 0.55 : 0.5}
      />
      <rect
        x="32"
        y="24"
        width="16"
        height="16"
        rx="3"
        transform="rotate(45 32 24)"
        fill={`url(#${id}g)`}
      />
    </svg>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const isLandlord = user?.user_type === "landlord";
  const isHomeActive = pathname === "/";
  const isListingsActive = pathname.startsWith("/listings");
  const isLandlordDashboardActive = pathname.startsWith("/landlord");
  const isRenterDashboardActive = pathname.startsWith("/renter");
  const isTransparentHomeHeader = isHomeActive && isHeroVisible;

  useEffect(() => {
    if (!isHomeActive) {
      setIsHeroVisible(false);
      return;
    }

    const heroSection = document.getElementById("home-hero");

    if (!heroSection) {
      setIsHeroVisible(window.scrollY < 80);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, [isHomeActive]);

  const navLinkClass = (active: boolean) =>
    `relative px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
      isTransparentHomeHeader
        ? active
          ? "text-white bg-white/[0.12]"
          : "text-[rgba(255,255,255,0.78)] hover:text-white hover:bg-white/[0.07]"
        : active
          ? "text-[#67e8f9] bg-white/[0.08]"
          : "text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-white/[0.05]"
    }`;

  return (
    <header
      className={`${isHomeActive ? "fixed" : "sticky"} top-0 z-50 w-full transition-all duration-300`}
    >
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div
          className="flex items-center justify-between rounded-[10px] px-5 py-3 transition-all duration-300"
          style={{
            background: isTransparentHomeHeader
              ? "transparent"
              : "rgba(11, 19, 32, 0.80)",
            border: isTransparentHomeHeader
              ? "1px solid transparent"
              : "1px solid rgba(255, 255, 255, 0.10)",
            backdropFilter: isTransparentHomeHeader ? "blur(0px)" : "blur(20px)",
            WebkitBackdropFilter: isTransparentHomeHeader
              ? "blur(0px)"
              : "blur(20px)",
            boxShadow: isTransparentHomeHeader
              ? "none"
              : "0 10px 10px rgba(0,0,0,0.10), 0 4px 4px rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.05)",
          }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                isTransparentHomeHeader
                  ? "border-white/10 bg-white/5"
                  : "border-white/10 bg-white/[0.06] shadow-[0_6px_18px_rgba(6,182,212,0.12)] group-hover:shadow-[0_8px_24px_rgba(6,182,212,0.18)]"
              }`}
            >
              <TenRentLogo mono={isTransparentHomeHeader} />
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
                className={`ds-btn h-9 px-4 text-[13px] rounded-lg font-medium transition-all ${
                  isTransparentHomeHeader
                    ? "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                    : "bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-[0_4px_14px_rgba(6,182,212,0.30)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.40)] hover:from-cyan-400 hover:to-sky-500"
                }`}
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
