'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { bidsAPI, type BidRead, type BidStatus } from '../lib/api';

type BidBucket = 'active' | 'pending' | 'won' | 'lost';

function bucketStatus(status: BidStatus): BidBucket {
  if (status === 'active' || status === 'outbid') return 'active';
  if (status === 'won') return 'won';
  if (status === 'withdrawn') return 'lost';
  if (status === 'refunded') return 'lost';
  return 'lost';
}

export default function RenterDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bids, setBids] = useState<BidRead[]>([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
    else if (!loading && user && user.user_type !== 'renter') router.push('/landlord');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.user_type !== 'renter') return;
    setLoadingBids(true);
    bidsAPI
      .getMyBids()
      .then(setBids)
      .catch(() => setBids([]))
      .finally(() => setLoadingBids(false));
  }, [user?.id, user?.user_type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2] mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== 'renter') {
    return null;
  }

  const activeBids = useMemo(
    () => bids.filter((b) => bucketStatus(b.status) === 'active'),
    [bids],
  );
  const leadingCount = useMemo(
    () => bids.filter((b) => b.status === 'active').length,
    [bids],
  );

  const handleWithdraw = async (bid: BidRead) => {
    if (bid.status !== 'active') return;
    if (!confirm('Withdraw this bid? Your hold will be released if possible.')) return;
    setWithdrawingId(bid.id);
    try {
      const updated = await bidsAPI.withdraw(bid.id);
      setBids((prev) => prev.map((b) => (b.id === bid.id ? updated : b)));
    } catch (e) {
      // Let backend enforce window/other rules; show generic alert
      alert(e instanceof Error ? e.message : 'Unable to withdraw bid');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <DashboardLayout role="renter">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome back, {user.first_name}
          </h1>
          <p className="text-gray-600">
            Browse listings and place bids. Only renters can bid on properties.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Bids</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeBids.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Leading</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{leadingCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Saved Listings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* My Bids */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <span className="px-6 py-4 text-sm font-semibold text-[#0fa8e2] border-b-2 border-[#0fa8e2]">
                My Bids
              </span>
            </nav>
          </div>
          <div className="p-6">
            {loadingBids ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0fa8e2]" />
              </div>
            ) : bids.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bids yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Browse active listings and place a bid to get priority consideration. Your bids will appear here.
                </p>
                <Link
                  href="/listings"
                  className="inline-block bg-[#0fa8e2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d8ec4] transition-colors"
                >
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Bid: ${(bid.amount / 100).toFixed(2)} / mo premium
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {bid.status} • Placed {new Date(bid.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/listings/${bid.listing_id}`}
                        className="text-[#0fa8e2] font-medium hover:underline"
                      >
                        View listing
                      </Link>
                      {bid.status === 'active' && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(bid)}
                          disabled={withdrawingId === bid.id}
                          className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {withdrawingId === bid.id ? 'Withdrawing…' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
