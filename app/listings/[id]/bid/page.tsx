"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import {
  authAPI,
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
    try {
      const freshUser = await authAPI.getCurrentUser();
      if (!freshUser.stripe_payment_method_id) {
        setError("Please add your Stripe payment method in renter dashboard first.");
        return;
      }
    } catch {
      setError("Unable to verify renter payment setup. Please sign in again.");
      return;
    }

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
              className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
            >
              Browse listings
            </Link>
          }
        />
      </ListingsShell>
    );
  }

  if (!user.stripe_payment_method_id) {
    return (
      <ListingsShell maxWidthClassName="max-w-3xl">
        <ListingsCenteredState
          title="Add payment method first"
          description="Please add your Stripe test payment method in the renter dashboard before placing bids."
          action={
            <Link
              href="/renter"
              className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
            >
              Go to renter dashboard
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
        <h1 className="ds-h5 mb-1">Place a bid</h1>
        <p className="ds-footnote mb-5">
          {listing.address_line_1}, {listing.city}
        </p>

        {/* Summary panel */}
        <div className="ds-panel rounded-[10px] p-4 mb-5">
          <p className="ds-footnote">
            Base rent:{" "}
            <span className="text-white font-medium">
              {formatCents(listing.monthly_rent)}/mo
            </span>
          </p>
          <p className="ds-footnote mt-1">
            Minimum premium bid:{" "}
            <span className="text-white font-medium">
              {formatCents(listing.minimum_bid)}
            </span>
          </p>
          {summary?.highest_bid ? (
            <p className="mt-1 ds-footnote text-cyan-300">
              Current high bid: +{formatCents(summary.highest_bid)} · Minimum to
              lead: +{formatCents(effectiveMinCents || listing.minimum_bid)}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="ds-input-label">
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
              className="ds-input h-11"
            />
          </div>

          {error && (
            <div className="ds-pill-red px-3 py-2 rounded-lg text-[13px]">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="ds-btn ds-btn-primary flex-1 h-11 rounded-[10px] text-[14px] disabled:opacity-50"
            >
              {submitting ? "Placing bid..." : "Place bid"}
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="ds-btn ds-btn-ghost h-11 px-5 rounded-[10px] text-[14px]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </ListingsCard>
    </ListingsShell>
  );
}
