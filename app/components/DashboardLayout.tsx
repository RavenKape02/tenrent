"use client";

import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "landlord" | "renter";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#05090f] text-slate-100 relative overflow-x-clip">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/8 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
