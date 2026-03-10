'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingsAPI, type ListingRead } from '../lib/api';
import ListingCard from './ListingCard';

export default function ActiveAuctions() {
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsAPI
      .list({ status: 'active', limit: 8 })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Active Auctions
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Properties accepting bids right now. Place your bid before time runs out!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 mb-4">No active listings at the moment.</p>
            <Link
              href="/listings"
              className="inline-block bg-white/20 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Browse all listings
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/listings"
                className="inline-block bg-[#0fa8e2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d8ec4] transition-colors"
              >
                View all listings
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
