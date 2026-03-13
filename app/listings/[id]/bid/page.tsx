'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { listingsAPI, bidsAPI, type ListingRead, type ListingSummary } from '../../../lib/api';

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export default function PlaceBidPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const listingId = params.id as string;

  const [listing, setListing] = useState<ListingRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountDollars, setAmountDollars] = useState('');
  const [summary, setSummary] = useState<ListingSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (!listingId) return;
    listingsAPI
      .get(listingId)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [listingId]);

  useEffect(() => {
    if (!listingId) return;
    listingsAPI
      .getSummary(listingId)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, [listingId]);

  const BID_INCREMENT_CENTS = 2500; // $25 increment

  const effectiveMinCents = useMemo(() => {
    if (!listing) return 0;
    const baseMin = listing.minimum_bid;
    const highest = summary?.highest_bid ?? 0;
    if (highest && highest >= baseMin) {
      return highest + BID_INCREMENT_CENTS;
    }
    return baseMin;
  }, [listing, summary]);

  useEffect(() => {
    if (!listing || summaryLoading) return;
    if (amountDollars !== '') return;
    const cents = effectiveMinCents || listing.minimum_bid;
    setAmountDollars((cents / 100).toFixed(2));
  }, [listing, summaryLoading, effectiveMinCents, amountDollars]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !user) return;
    const amount = Math.round(parseFloat(amountDollars || '0') * 100);
    const minCents = effectiveMinCents || listing.minimum_bid;
    if (amount < minCents) {
      setError(`Minimum to lead is ${formatCents(minCents)}`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await bidsAPI.place(listing.id, amount);
      router.push('/renter');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.user_type !== 'renter') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Only renters can place bids.</p>
          <Link href="/listings" className="text-[#0fa8e2] font-semibold hover:underline">
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2]" />
      </div>
    );
  }

  if (listing.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-2">This listing is not accepting bids.</p>
          <Link href={`/listings/${listing.id}`} className="text-[#0fa8e2] font-semibold hover:underline">
            View listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Place a bid</h1>
        <p className="text-gray-600 text-sm mb-6">
          {listing.address_line_1}, {listing.city}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          Base rent: {formatCents(listing.monthly_rent)}/mo · Minimum premium bid: {formatCents(listing.minimum_bid)}
        </p>
        {summary && summary.highest_bid && (
          <p className="text-xs text-gray-600 mb-4">
            Current high bid: +{formatCents(summary.highest_bid)} · Minimum to lead:{' '}
            +{formatCents(effectiveMinCents || listing.minimum_bid)}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your bid (premium per month, $)
            </label>
            <input
              type="number"
              step="0.01"
              min={(effectiveMinCents || listing.minimum_bid) / 100}
              required
              value={amountDollars}
              onChange={(e) => setAmountDollars(e.target.value)}
              placeholder={((effectiveMinCents || listing.minimum_bid) / 100).toFixed(2)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#ff214f] text-white py-2.5 rounded-lg font-semibold hover:bg-[#e01d45] disabled:opacity-50"
            >
              {submitting ? 'Placing bid…' : 'Place bid'}
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-300 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
