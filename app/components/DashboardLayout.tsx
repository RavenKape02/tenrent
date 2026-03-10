'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** 'landlord' | 'renter' — enforces which dashboard this is */
  role: 'landlord' | 'renter';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth();
  const isLandlord = user?.user_type === 'landlord';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0fa8e2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-gray-900 font-semibold text-2xl">TenRent</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/listings"
              className="text-gray-600 hover:text-gray-900"
            >
              Browse Listings
            </Link>
            {isLandlord ? (
              <>
                <Link
                  href="/landlord"
                  className={role === 'landlord' ? 'text-[#0fa8e2] font-semibold' : 'text-gray-600 hover:text-gray-900'}
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
              <Link
                href="/renter"
                className={role === 'renter' ? 'text-[#0fa8e2] font-semibold' : 'text-gray-600 hover:text-gray-900'}
              >
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
                  <span className="text-sm hidden sm:inline">{user.first_name}</span>
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
      {children}
    </div>
  );
}
