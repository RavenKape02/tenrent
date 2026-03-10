'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { listingsAPI, type ListingRead, type ListingStatus } from '../lib/api';
import ListingCard from '../components/ListingCard';

const STATUS_OPTIONS: { value: ListingStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'bidding_closed', label: 'Bidding Closed' },
  { value: 'completed', label: 'Completed' },
];

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [city, setCity] = useState('');
  const [status, setStatus] = useState<ListingStatus | ''>('active');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [availableBefore, setAvailableBefore] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof listingsAPI.list>[0] = {
        limit: 50,
      };
      if (status) params.status = status as ListingStatus;
      if (city.trim()) params.city = city.trim();
      if (minRent.trim()) params.min_rent = parseInt(minRent, 10) * 100;
      if (maxRent.trim()) params.max_rent = parseInt(maxRent, 10) * 100;
      if (bedrooms.trim()) params.bedrooms = parseInt(bedrooms, 10);
      if (availableBefore.trim()) params.available_before = availableBefore;
      const data = await listingsAPI.list(params);
      setListings(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [status]);

  const isLandlord = user?.user_type === 'landlord';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0fa8e2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-gray-900 font-semibold text-2xl">TenRent</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/listings" className="text-[#0fa8e2] font-semibold">
              Browse Listings
            </Link>
            {user ? (
              <>
                {isLandlord ? (
                  <Link
                    href="/landlord"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Landlord Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/renter"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    My Bids
                  </Link>
                )}
                {isLandlord && (
                  <Link
                    href="/landlord/listings/new"
                    className="bg-[#ff214f] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
                  >
                    + Create Listing
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/"
                className="bg-[#0fa8e2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0d8ec4] transition-colors"
              >
                Sign in to bid
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {status === 'active'
              ? 'Active Listings'
              : status
                ? `Listings: ${STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}`
                : 'All Listings'}
          </h1>
          {isLandlord && (
            <Link
              href="/landlord/listings/new"
              className="inline-flex items-center gap-2 bg-[#ff214f] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
            >
              <span>+</span> Create New Listing
            </Link>
          )}
        </div>

        {/* Filters — only show for browse (e.g. active or all) */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Filters</p>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus((e.target.value || '') as ListingStatus | '')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[140px]"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Rent ($)</label>
              <input
                type="number"
                placeholder="0"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Rent ($)</label>
              <input
                type="number"
                placeholder="0"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bedrooms (min)</label>
              <input
                type="number"
                min={0}
                placeholder="Any"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Available before</label>
              <input
                type="date"
                value={availableBefore}
                onChange={(e) => setAvailableBefore(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={fetchListings}
              className="bg-[#0fa8e2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0d8ec4] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">No listings match your filters.</p>
            <button
              onClick={() => {
                setCity('');
                setMinRent('');
                setMaxRent('');
                setBedrooms('');
                setAvailableBefore('');
                setStatus('');
                setTimeout(fetchListings, 0);
              }}
              className="text-[#0fa8e2] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                asLandlord={isLandlord && listing.landlord_id === user?.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
