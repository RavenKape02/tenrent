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

function timeUntil(endIso: string): string {
  const end = new Date(endIso);
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${minutes}m left`;
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
          <span className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            You own this listing
          </span>
          <Link
            href={`/landlord/listings/${listing.id}/edit`}
            className="bg-linear-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all"
          >
            Edit listing
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500/85 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-500 disabled:opacity-50 transition-colors"
          >
            {deleting ? "Deleting..." : "Delete listing"}
          </button>
        </div>
      )}

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
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPhotoIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      index === photoIndex
                        ? "bg-cyan-300"
                        : "bg-white/45 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video flex items-center justify-center text-slate-400 bg-[#08101d]">
            No photos available
          </div>
        )}
      </ListingsCard>

      <ListingsCard className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          {listing.address_line_1}
          {listing.address_line_2 ? `, ${listing.address_line_2}` : ""}
        </h1>
        <p className="text-slate-300 mb-4">
          {listing.city}, {listing.state} {listing.zip_code}
        </p>

        <div className="flex flex-wrap gap-4 text-slate-200">
          <span>
            <strong>{listing.bedrooms}</strong> bed
          </span>
          <span>
            <strong>{Number(listing.bathrooms)}</strong> bath
          </span>
          {listing.square_feet != null && (
            <span>
              <strong>{listing.square_feet}</strong> sq ft
            </span>
          )}
        </div>
      </ListingsCard>

      <ListingsCard className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Rent & Bidding
        </h2>
        <div className="grid gap-3">
          <div className="flex justify-between text-slate-300">
            <span>Base rent</span>
            <span className="font-semibold text-white">
              {formatCents(listing.monthly_rent)}/mo
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Minimum bid (premium)</span>
            <span className="font-semibold text-cyan-200">
              +{formatCents(listing.minimum_bid)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Available</span>
            <span>{formatDate(listing.available_date)}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Bidding ends</span>
            <span>{formatDate(listing.bidding_end)}</span>
          </div>
        </div>

        {isActive && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            {timeUntil(listing.bidding_end)}
          </div>
        )}
      </ListingsCard>

      {listing.description && (
        <ListingsCard className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {listing.description}
          </p>
        </ListingsCard>
      )}

      {isRenter && isActive && (
        <ListingsCard className="bg-linear-to-br from-cyan-500/12 to-sky-500/10 border-cyan-300/25">
          <h2 className="text-lg font-semibold text-white mb-2">
            Ready to bid?
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Place a premium bid to get priority consideration. Minimum bid: +
            {formatCents(listing.minimum_bid)}.
          </p>
          <Link
            href={`/listings/${listing.id}/bid`}
            className="inline-block bg-linear-to-r from-cyan-500 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all"
          >
            Place bid
          </Link>
        </ListingsCard>
      )}

      {!user && isActive && (
        <ListingsCard className="text-center">
          <p className="text-slate-300 mb-3">
            Sign in as a renter to place a bid.
          </p>
          <Link
            href="/signin"
            className="text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
          >
            Sign in
          </Link>
        </ListingsCard>
      )}

      {isLandlord && !isOwner && (
        <ListingsCard className="text-center">
          <p className="text-slate-300">
            This listing belongs to another landlord account.
          </p>
        </ListingsCard>
      )}
    </ListingsShell>
  );
}
