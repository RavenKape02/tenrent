"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { listingsAPI, type ListingRead } from "../lib/api";
import ListingCard from "./ListingCard";

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
          <p className="ds-caption ds-pill-cyan inline-flex px-3 py-1 rounded-full mb-4 text-[12px] uppercase tracking-[0.16em]">
            Available Now
          </p>
          <h2 className="ds-h3 mb-5">
            Active Auctions
          </h2>
          <p className="ds-body max-w-2xl mx-auto">
            Properties accepting bids right now. Place your bid before time runs
            out!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="ds-card-lg text-center p-12">
            <p className="ds-body mb-5">
              No active listings at the moment.
            </p>
            <Link
              href="/listings"
              className="ds-btn ds-btn-ghost h-10 px-5 text-[14px] rounded-[10px]"
            >
              Browse all listings
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="ds-fade-in"
                  style={{ animationDelay: `${listings.indexOf(listing) * 60}ms` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/listings"
                className="ds-btn ds-btn-primary h-11 px-6 text-[14px] rounded-[10px]"
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
