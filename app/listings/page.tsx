"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { listingsAPI, type ListingRead, type ListingStatus } from "../lib/api";
import ListingCard from "../components/ListingCard";
import {
  ListingsCard,
  ListingsShell,
  ListingsSpinner,
} from "./components/ListingsChrome";

const STATUS_OPTIONS: { value: ListingStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "bidding_closed", label: "Bidding Closed" },
  { value: "completed", label: "Completed" },
];

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [city, setCity] = useState("");
  const [status, setStatus] = useState<ListingStatus | "">("active");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [availableBefore, setAvailableBefore] = useState("");

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
      setError(e instanceof Error ? e.message : "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [status]);

  const isLandlord = user?.user_type === "landlord";

  return (
    <ListingsShell>
      <div className="mb-8 rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80 mb-3">
              Live Marketplace
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              {status === "active"
                ? "Active Listings"
                : status
                  ? `Listings: ${STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}`
                  : "All Listings"}
            </h1>
            <p className="text-slate-300 mt-2 text-sm md:text-base">
              Discover verified homes and place bids with confidence.
            </p>
          </div>
          {isLandlord && (
            <Link
              href="/landlord/listings/new"
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_12px_30px_rgba(6,182,212,0.35)]"
            >
              <span>+</span> Create New Listing
            </Link>
          )}
        </div>
      </div>

      <ListingsCard className="mb-8 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 mb-4">
          Filters
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus((e.target.value || "") as ListingStatus | "")
              }
              className="w-full border border-white/15 bg-white/5 text-slate-100 rounded-xl px-3 py-2 text-sm min-w-35 outline-none focus:border-cyan-400/70 transition-colors"
            >
              {STATUS_OPTIONS.map((o) => (
                <option
                  key={o.value || "all"}
                  value={o.value}
                  className="text-slate-900"
                >
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Min Rent ($)
            </label>
            <input
              type="number"
              placeholder="0"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className="w-full border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Max Rent ($)
            </label>
            <input
              type="number"
              placeholder="0"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-full border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Bedrooms (min)
            </label>
            <input
              type="number"
              min={0}
              placeholder="Any"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Available before
            </label>
            <input
              type="date"
              value={availableBefore}
              onChange={(e) => setAvailableBefore(e.target.value)}
              className="w-full border border-white/15 bg-white/5 text-slate-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchListings}
            className="bg-linear-to-r from-cyan-500 to-sky-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_10px_24px_rgba(6,182,212,0.3)]"
          >
            Apply Filters
          </button>
        </div>
      </ListingsCard>

      {error && (
        <div className="bg-red-500/10 border border-red-400/40 text-red-200 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <ListingsSpinner />
      ) : listings.length === 0 ? (
        <ListingsCard className="text-center p-12">
          <p className="text-slate-300 mb-4">No listings match your filters.</p>
          <button
            onClick={() => {
              setCity("");
              setMinRent("");
              setMaxRent("");
              setBedrooms("");
              setAvailableBefore("");
              setStatus("");
              setTimeout(fetchListings, 0);
            }}
            className="text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
          >
            Clear filters
          </button>
        </ListingsCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="transition-transform duration-300 hover:-translate-y-1"
            >
              <ListingCard
                listing={listing}
                asLandlord={isLandlord && listing.landlord_id === user?.id}
              />
            </div>
          ))}
        </div>
      )}
    </ListingsShell>
  );
}
