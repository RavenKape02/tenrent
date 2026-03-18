"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import {
  bidsAPI,
  listingsAPI,
  type ListingRead,
  type ListingSummary,
} from "../../../lib/api";
import {
  ListingsBackLink,
  ListingsCard,
  ListingsCenteredState,
  ListingsShell,
  ListingsSpinner,
} from "../../components/ListingsChrome";

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
  const [amountDollars, setAmountDollars] = useState("");
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

  const BID_INCREMENT_CENTS = 2500;

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
    if (amountDollars !== "") return;
    const cents = effectiveMinCents || listing.minimum_bid;
    setAmountDollars((cents / 100).toFixed(2));
  }, [listing, summaryLoading, effectiveMinCents, amountDollars]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !user) return;

    const amount = Math.round(parseFloat(amountDollars || "0") * 100);
    const minCents = effectiveMinCents || listing.minimum_bid;

    if (amount < minCents) {
      setError(`Minimum to lead is ${formatCents(minCents)}`);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await bidsAPI.place(listing.id, amount);
      router.push("/renter");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.user_type !== "renter") {
    return (
      <ListingsShell maxWidthClassName="max-w-3xl">
        <ListingsCenteredState
          title="Only renters can place bids"
          description="Switch to a renter account to submit bids on active listings."
          action={
            <Link
              href="/listings"
              className="text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
            >
              Browse listings
            </Link>
          }
        />
      </ListingsShell>
    );
  }

  if (loading || !listing) {
    return (
      <ListingsShell maxWidthClassName="max-w-3xl">
        <ListingsSpinner />
      </ListingsShell>
    );
  }

  if (listing.status !== "active") {
    return (
      <ListingsShell maxWidthClassName="max-w-3xl">
        <ListingsCenteredState
          title="This listing is not accepting bids"
          action={
            <ListingsBackLink
              href={`/listings/${listing.id}`}
              label="View listing"
            />
          }
        />
      </ListingsShell>
    );
  }

  return (
    <ListingsShell maxWidthClassName="max-w-3xl">
      <ListingsBackLink
        href={`/listings/${listing.id}`}
        label="Back to listing"
        className="mb-5"
      />

      <ListingsCard>
        <h1 className="text-2xl font-semibold text-white mb-1">Place a bid</h1>
        <p className="text-slate-300 mb-5">
          {listing.address_line_1}, {listing.city}
        </p>

        <div className="rounded-xl border border-white/10 bg-[#08101d]/90 p-4 mb-5 text-sm text-slate-300">
          <p>
            Base rent:{" "}
            <span className="text-white">
              {formatCents(listing.monthly_rent)}/mo
            </span>
          </p>
          <p className="mt-1">
            Minimum premium bid:{" "}
            <span className="text-white">
              {formatCents(listing.minimum_bid)}
            </span>
          </p>
          {summary?.highest_bid ? (
            <p className="mt-1 text-cyan-200">
              Current high bid: +{formatCents(summary.highest_bid)} · Minimum to
              lead: +{formatCents(effectiveMinCents || listing.minimum_bid)}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Your bid (premium per month, $)
            </label>
            <input
              type="number"
              step="0.01"
              min={(effectiveMinCents || listing.minimum_bid) / 100}
              required
              value={amountDollars}
              onChange={(e) => setAmountDollars(e.target.value)}
              placeholder={(
                (effectiveMinCents || listing.minimum_bid) / 100
              ).toFixed(2)}
              className="w-full rounded-xl border border-white/15 bg-white/5 text-slate-100 placeholder:text-slate-400 px-3 py-2 outline-none focus:border-cyan-400/70 transition-colors"
            />
          </div>

          {error && <div className="text-red-300 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-linear-to-r from-cyan-500 to-sky-600 text-white py-2.5 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 disabled:opacity-50 transition-all"
            >
              {submitting ? "Placing bid..." : "Place bid"}
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="bg-white/10 border border-white/20 text-slate-100 px-4 py-2.5 rounded-xl font-semibold hover:bg-white/15 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </ListingsCard>
    </ListingsShell>
  );
}
