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
  const isRenter = user?.user_type === "renter";
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
      if (isRenter) {
        params.status = "active";
      } else if (status) {
        params.status = status as ListingStatus;
      }
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
  }, [status, isRenter]);

  useEffect(() => {
    if (isRenter && status !== "active") setStatus("active");
  }, [isRenter, status]);

  const isLandlord = user?.user_type === "landlord";

  return (
    <ListingsShell>
      {/* Hero */}
      <div className="mb-8 ds-card-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="ds-pill ds-pill-cyan inline-flex px-3 py-1 rounded-full mb-4 text-[12px] uppercase tracking-[0.16em]">
              Live Marketplace
            </p>
            <h1 className="ds-h4 tracking-tight">
              {isRenter
                ? "Active Listings"
                : status === "active"
                  ? "Active Listings"
                  : status
                    ? `Listings: ${STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}`
                    : "All Listings"}
            </h1>
            <p className="ds-body mt-2">
              Discover verified homes and place bids with confidence.
            </p>
          </div>
          {isLandlord && (
            <Link
              href="/landlord/listings/new"
              className="ds-btn ds-btn-primary h-11 px-5 text-[14px] rounded-[10px] shrink-0"
            >
              <span className="text-base">+</span> New Listing
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <ListingsCard className="mb-8 p-5">
        <p className="ds-caption text-cyan-300/70 uppercase tracking-[0.16em] text-[12px] mb-4">
          Filters
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {!isRenter && (
            <div>
              <label className="ds-input-label">Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus((e.target.value || "") as ListingStatus | "")
                }
                className="ds-input"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option
                    key={o.value || "all"}
                    value={o.value}
                    className="text-gray-900 bg-[#0b1320]"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="ds-input-label">City</label>
            <input
              type="text"
              placeholder="e.g. New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="ds-input"
            />
          </div>
          <div>
            <label className="ds-input-label">Min Rent ($)</label>
            <input
              type="number"
              placeholder="0"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className="ds-input"
            />
          </div>
          <div>
            <label className="ds-input-label">Max Rent ($)</label>
            <input
              type="number"
              placeholder="0"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="ds-input"
            />
          </div>
          <div>
            <label className="ds-input-label">Bedrooms (min)</label>
            <input
              type="number"
              min={0}
              placeholder="Any"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="ds-input"
            />
          </div>
          <div>
            <label className="ds-input-label">Available before</label>
            <input
              type="date"
              value={availableBefore}
              onChange={(e) => setAvailableBefore(e.target.value)}
              className="ds-input"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchListings}
            className="ds-btn ds-btn-primary h-10 px-5 text-[14px] rounded-[8px]"
          >
            Apply Filters
          </button>
        </div>
      </ListingsCard>

      {error && (
        <div className="ds-pill-red px-4 py-3 rounded-[10px] mb-6 text-[13px]">
          {error}
        </div>
      )}

      {loading ? (
        <ListingsSpinner />
      ) : listings.length === 0 ? (
        <ListingsCard className="text-center p-12">
          <p className="ds-body mb-4">No listings match your filters.</p>
          <button
            onClick={() => {
              setCity("");
              setMinRent("");
              setMaxRent("");
              setBedrooms("");
              setAvailableBefore("");
              setStatus(isRenter ? "active" : "");
              setTimeout(fetchListings, 0);
            }}
            className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
          >
            Clear filters
          </button>
        </ListingsCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="ds-fade-in"
              style={{ animationDelay: `${listings.indexOf(listing) * 40}ms` }}
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
