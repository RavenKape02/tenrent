"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { listingsAPI, type ListingRead } from "../lib/api";
import ListingCard from "./ListingCard";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function ActiveAuctions() {
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsAPI
      .list({ status: "active", limit: 8 })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 mb-3">
            Available Now
          </p>
          <h2
            className={`${cormorant.className} text-4xl md:text-5xl font-semibold text-white mb-4`}
          >
            Active Auctions
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Properties accepting bids right now. Place your bid before time runs
            out!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-300/25 border-t-cyan-300" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-slate-300 mb-4">
              No active listings at the moment.
            </p>
            <Link
              href="/listings"
              className="inline-block bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/15 transition-colors"
            >
              Browse all listings
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/listings"
                className="inline-block bg-linear-to-r from-cyan-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_10px_28px_rgba(8,145,178,0.32)]"
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
