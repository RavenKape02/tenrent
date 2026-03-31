"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  getListingImageUrl,
  listingsAPI,
  type ListingRead,
} from "../../lib/api";
import {
  ListingsBackLink,
  ListingsCard,
  ListingsCenteredState,
  ListingsShell,
  ListingsSpinner,
} from "../components/ListingsChrome";
import CountdownTimer from "../../components/CountdownTimer";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    listingsAPI
      .get(id)
      .then(setListing)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load listing");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && listing && listing.landlord_id === user.id;
  const isLandlord = user?.user_type === "landlord";
  const isRenter = user?.user_type === "renter";
  const isActive = listing?.status === "active";

  const handleDelete = async () => {
    if (!listing || !confirm("Are you sure you want to delete this listing?"))
      return;
    setDeleting(true);
    try {
      await listingsAPI.delete(listing.id);
      router.push("/landlord");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <ListingsShell maxWidthClassName="max-w-5xl">
        <ListingsSpinner />
      </ListingsShell>
    );
  }

  if (error || !listing) {
    return (
      <ListingsShell maxWidthClassName="max-w-5xl">
        <ListingsCenteredState
          title="Unable to load listing"
          description={error || "Listing not found"}
          action={<ListingsBackLink />}
        />
      </ListingsShell>
    );
  }

  const photos =
    listing.photos && listing.photos.length > 0 ? listing.photos : [];
  const mainPhoto = photos[photoIndex]
    ? getListingImageUrl(photos[photoIndex])
    : null;

  return (
    <ListingsShell maxWidthClassName="max-w-5xl">
      <ListingsBackLink className="mb-6" />

      {isOwner && (
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="ds-pill ds-pill-cyan">
            You own this listing
          </span>
          <Link
            href={`/landlord/listings/${listing.id}/edit`}
            className="ds-btn ds-btn-primary h-9 px-4 text-[13px] rounded-lg"
          >
            Edit listing
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ds-btn h-9 px-4 text-[13px] rounded-lg bg-red-500/80 text-white border-none hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete listing"}
          </button>
        </div>
      )}

      {/* Photo */}
      <ListingsCard className="p-0 overflow-hidden mb-6">
        {mainPhoto ? (
          <div className="relative aspect-video w-full">
            <Image
              src={mainPhoto}
              alt={listing.address_line_1}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPhotoIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-200 ${
                      index === photoIndex
                        ? "bg-cyan-400 w-5"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center ds-body bg-white/[0.02]">
            No photos available
          </div>
        )}
      </ListingsCard>

      {/* Address & specs */}
      <ListingsCard className="mb-6">
        <h1 className="ds-h5 mb-2">
          {listing.address_line_1}
          {listing.address_line_2 ? `, ${listing.address_line_2}` : ""}
        </h1>
        <p className="ds-footnote mb-4">
          {listing.city}, {listing.state} {listing.zip_code}
        </p>

        <div className="flex flex-wrap gap-3">
          <span className="ds-pill ds-pill-neutral">
            <strong className="text-white">{listing.bedrooms}</strong> bed
          </span>
          <span className="ds-pill ds-pill-neutral">
            <strong className="text-white">{Number(listing.bathrooms)}</strong> bath
          </span>
          {listing.square_feet != null && (
            <span className="ds-pill ds-pill-neutral">
              <strong className="text-white">{listing.square_feet}</strong> sqft
            </span>
          )}
        </div>
      </ListingsCard>

      {/* Rent & Bidding */}
      <ListingsCard className="mb-6">
        <h2 className="ds-headline mb-4">Rent & Bidding</h2>
        <div className="grid gap-3">
          <div className="flex justify-between ds-footnote">
            <span>Base rent</span>
            <span className="font-semibold text-white">
              {formatCents(listing.monthly_rent)}/mo
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between ds-footnote">
            <span>Minimum bid (premium)</span>
            <span className="font-semibold text-cyan-300">
              +{formatCents(listing.minimum_bid)}
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between ds-small">
            <span>Available</span>
            <span>{formatDate(listing.available_date)}</span>
          </div>
          <div className="flex justify-between ds-small">
            <span>Bidding ends</span>
            <span>{formatDate(listing.bidding_end)}</span>
          </div>
        </div>

        {isActive && (
          <div className="mt-4 ds-pill ds-pill-cyan">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <CountdownTimer endIso={listing.bidding_end} />
          </div>
        )}
      </ListingsCard>

      {/* Description */}
      {listing.description && (
        <ListingsCard className="mb-6">
          <h2 className="ds-headline mb-3">Description</h2>
          <p className="ds-body whitespace-pre-wrap leading-relaxed">
            {listing.description}
          </p>
        </ListingsCard>
      )}

      {/* Bid CTA */}
      {isRenter && isActive && (
        <ListingsCard className="ds-panel border-cyan-400/15">
          <h2 className="ds-headline mb-2">Ready to bid?</h2>
          <p className="ds-footnote mb-5">
            Place a premium bid to get priority consideration. Minimum bid: +
            {formatCents(listing.minimum_bid)}.
          </p>
          <Link
            href={`/listings/${listing.id}/bid`}
            className="ds-btn ds-btn-primary h-11 px-6 text-[14px] rounded-[10px]"
          >
            Place bid
          </Link>
        </ListingsCard>
      )}

      {!user && isActive && (
        <ListingsCard className="text-center">
          <p className="ds-body mb-3">
            Sign in as a renter to place a bid.
          </p>
          <Link
            href="/signin"
            className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
          >
            Sign in
          </Link>
        </ListingsCard>
      )}

      {isLandlord && !isOwner && (
        <ListingsCard className="text-center">
          <p className="ds-body">
            This listing belongs to another landlord account.
          </p>
        </ListingsCard>
      )}
    </ListingsShell>
  );
}
