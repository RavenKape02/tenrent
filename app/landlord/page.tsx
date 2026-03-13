'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  listingsAPI,
  type ListingRead,
  type ListingStatus,
  type ListingSummary,
} from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import ListingCard from '../components/ListingCard';

const TABS: { value: ListingStatus | 'all'; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Drafts' },
  { value: 'bidding_closed', label: 'Bidding Closed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'all', label: 'All' },
];

export default function LandlordDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ListingStatus | 'all'>('active');
  const [summaries, setSummaries] = useState<Record<string, ListingSummary>>({});

  useEffect(() => {
    if (!loading && !user) router.push('/');
    else if (!loading && user && user.user_type !== 'landlord') router.push('/renter');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setFetchLoading(true);
    listingsAPI
      .list({ limit: 100 })
      .then((data) => {
        setListings(data.filter((l) => l.landlord_id === user.id));
      })
      .catch(() => setListings([]))
      .finally(() => setFetchLoading(false));
  }, [user?.id]);

  useEffect(() => {
    const loadSummaries = async () => {
      if (!listings.length) return;
      try {
        const results = await Promise.all(
          listings.map(async (l) => {
            try {
              const summary = await listingsAPI.getSummary(l.id);
              return [l.id, summary] as const;
            } catch {
              return [l.id, null] as const;
            }
          }),
        );
        setSummaries((prev) => {
          const next = { ...prev };
          for (const [id, summary] of results) {
            if (summary) next[id] = summary;
          }
          return next;
        });
      } catch {
        // ignore summary errors
      }
    };
    loadSummaries();
  }, [listings]);

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

  if (!user || user.user_type !== 'landlord') {
    return null; // redirect handled above
  }

  const filtered =
    activeTab === 'all'
      ? listings
      : listings.filter((l) => l.status === activeTab);
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const draftCount = listings.filter((l) => l.status === 'draft').length;
  const closedCount = listings.filter((l) => l.status === 'bidding_closed').length;
  const completedCount = listings.filter((l) => l.status === 'completed').length;

  const formatCents = (cents: number) => `$${(cents / 100).toLocaleString()}`;

  return (
    <DashboardLayout role="landlord">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user.first_name}
            </h1>
            <p className="text-gray-600">
              Manage your listings and review bids. Only you can create, edit, or delete your listings.
            </p>
          </div>
          <Link
            href="/landlord/listings/new"
            className="inline-flex items-center gap-2 bg-[#ff214f] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors shrink-0"
          >
            <span>+</span> Create New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Drafts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{draftCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Bidding Closed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{closedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</p>
          </div>
        </div>

        {/* Tabs + List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-[#0fa8e2] text-[#0fa8e2]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {fetchLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0fa8e2]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'all' ? 'No listings yet' : `No ${activeTab} listings`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' || activeTab === 'draft'
                    ? 'Create your first listing to start receiving bids.'
                    : `You don't have any listings with status "${activeTab}".`}
                </p>
                {(activeTab === 'all' || activeTab === 'draft') && (
                  <Link
                    href="/landlord/listings/new"
                    className="inline-block bg-[#ff214f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
                  >
                    + Create Listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((listing) => (
                  <div key={listing.id} className="flex flex-col">
                    <ListingCard
                      listing={listing}
                      compact={false}
                      asLandlord
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {summaries[listing.id]
                        ? `${summaries[listing.id].total_bids} bid${summaries[listing.id].total_bids === 1 ? '' : 's'}${
                            summaries[listing.id].highest_bid
                              ? ` · High: +${formatCents(summaries[listing.id].highest_bid!)}`
                              : ''
                          }`
                        : 'Loading bid summary…'}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        href={`/landlord/listings/${listing.id}/edit`}
                        className="text-sm text-[#0fa8e2] font-medium hover:underline"
                      >
                        Edit / Bids
                      </Link>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-sm text-gray-600 font-medium hover:underline"
                      >
                        View
                      </Link>
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
