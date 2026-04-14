"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  CalendarDays,
  Clock,
  Gavel,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Share2,
  Heart,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getListingImageUrl,
  listingsAPI,
  type ListingRead,
} from "../../lib/api";
import {
  ListingsShell,
  ListingsSpinner,
  ListingsCenteredState,
  ListingsBackLink,
} from "../components/ListingsChrome";
import CountdownTimer from "../../components/CountdownTimer";
import { usePhotoTransition } from "../../contexts/PhotoTransitionContext";

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Accepting Bids",
  bidding_closed: "Bidding Closed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  active: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/20",
  },
  draft: {
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-400/20",
  },
  bidding_closed: {
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    border: "border-sky-400/20",
  },
  completed: {
    text: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-400/20",
  },
  cancelled: {
    text: "text-red-300",
    bg: "bg-red-500/10",
    border: "border-red-400/20",
  },
};

const fadeIn = (delayMs = 0) =>
  ({
    animation: `ds-fade-in 0.4s ease-out ${delayMs}ms backwards`,
  }) as React.CSSProperties;

/* ────────────────────────────────────────────────────────────────
   Page component
   ──────────────────────────────────────────────────────────────── */

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const { source, setTargetRect } = usePhotoTransition();
  const galleryRef = useRef<HTMLDivElement>(null);

  const [listing, setListing] = useState<ListingRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  /* Measure the actual cover image position and report it to the overlay */
  useEffect(() => {
    if (!listing || !source || !galleryRef.current) return;
    // Wait one frame so layout is settled
    requestAnimationFrame(() => {
      const el = galleryRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const multi = (listing.photos?.length ?? 0) > 1;
      const gap = 6; // gap-1.5
      // Cover is the left half in multi-photo, full width in single
      const coverWidth = multi ? (r.width - gap) / 2 : r.width;
      setTargetRect({
        top: r.top,
        left: r.left,
        width: coverWidth,
        height: r.height,
      });
    });
    return () => setTargetRect(null);
  }, [listing, source, setTargetRect]);

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

  /* ── Loading / error states ──────────────────────────────────── */

  if (loading) {
    return (
      <ListingsShell maxWidthClassName="max-w-6xl">
        <ListingsSpinner />
      </ListingsShell>
    );
  }

  if (error || !listing) {
    return (
      <ListingsShell maxWidthClassName="max-w-6xl">
        <ListingsCenteredState
          title="Unable to load listing"
          description={error || "Listing not found"}
          action={<ListingsBackLink />}
        />
      </ListingsShell>
    );
  }

  /* ── Derived ─────────────────────────────────────────────────── */

  const photos =
    listing.photos && listing.photos.length > 0 ? listing.photos : [];
  const statusColor = STATUS_COLORS[listing.status] ?? STATUS_COLORS.draft;

  /* ────────────────────────────────────────────────────────────────
     Render
     ──────────────────────────────────────────────────────────────── */

  return (
    <ListingsShell maxWidthClassName="max-w-6xl">
      {/* ── Top bar: back + actions ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-5" style={fadeIn(0)}>
        <ListingsBackLink className="mb-0" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ds-btn ds-btn-ghost h-9 px-3 text-[13px] rounded-lg"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            type="button"
            className="ds-btn ds-btn-ghost h-9 px-3 text-[13px] rounded-lg"
          >
            <Heart className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* ── Photo gallery ───────────────────────────────────────── */}
      <div
        ref={galleryRef}
        className="rounded-[16px] overflow-hidden mb-6"
        style={fadeIn(0)}
      >
        {photos.length > 0 ? (
          <div className="relative">
            {/* Main layout: cover + side grid */}
            <div
              className={`grid gap-1.5 ${photos.length === 1 ? "" : "grid-cols-2"}`}
              style={{ maxHeight: 440 }}
            >
              {/* Cover image */}
              <button
                type="button"
                onClick={() => {
                  setPhotoIndex(0);
                  setLightboxOpen(true);
                }}
                className={`relative overflow-hidden cursor-pointer group ${
                  photos.length === 1 ? "aspect-[16/7]" : "row-span-2"
                }`}
                style={{ minHeight: photos.length > 1 ? 440 : undefined }}
              >
                <Image
                  src={getListingImageUrl(photos[0])}
                  alt={listing.address_line_1}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </button>

              {/* Side thumbnails (2×2 grid) */}
              {photos.length > 1 && (
                <div className="grid grid-cols-2 gap-1.5">
                  {photos.slice(1, 5).map((p, i) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPhotoIndex(i + 1);
                        setLightboxOpen(true);
                      }}
                      className="relative overflow-hidden cursor-pointer group"
                      style={{ minHeight: 214 }}
                    >
                      <Image
                        src={getListingImageUrl(p)}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      {/* +N overlay on last visible thumb */}
                      {i === 3 && photos.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-[18px] font-semibold text-white">
                            +{photos.length - 5} more
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Photo count badge */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 ds-btn ds-btn-ghost h-8 px-3 text-[12px] rounded-lg bg-black/50 border-white/20 hover:bg-black/70 backdrop-blur-sm"
              >
                View all {photos.length} photos
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-[16/7] flex items-center justify-center ds-body bg-white/[0.02] rounded-[16px] border border-white/[0.06]">
            No photos available
          </div>
        )}
      </div>

      {/* ── Two-column layout: content + sidebar ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="space-y-6 min-w-0">
          {/* ── Address & status ──────────────────────────────────── */}
          <div style={fadeIn(60)}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-white leading-tight tracking-tight">
                  {listing.address_line_1}
                  {listing.address_line_2 ? `, ${listing.address_line_2}` : ""}
                </h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-cyan-400/60 shrink-0" />
                  <p className="text-[15px] text-white/50">
                    {listing.city}, {listing.state} {listing.zip_code}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border ${statusColor.text} ${statusColor.bg} ${statusColor.border}`}
              >
                {STATUS_LABELS[listing.status] ?? listing.status}
              </span>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Link
                  href={`/landlord/listings/${listing.id}/edit`}
                  className="ds-btn ds-btn-ghost h-9 px-4 text-[13px] rounded-lg"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit listing
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ds-btn h-9 px-4 text-[13px] rounded-lg bg-red-500/10 text-red-300 border border-red-400/20 hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>

          {/* ── Specs grid ────────────────────────────────────────── */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            style={fadeIn(120)}
          >
            <div className="ds-panel rounded-[10px] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Bed className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-white leading-none">
                  {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  {listing.bedrooms === 0
                    ? ""
                    : `Bedroom${listing.bedrooms !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            <div className="ds-panel rounded-[10px] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Bath className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-white leading-none">
                  {Number(listing.bathrooms)}
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  Bathroom{Number(listing.bathrooms) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {listing.square_feet != null && (
              <div className="ds-panel rounded-[10px] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Ruler className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-white leading-none">
                    {listing.square_feet.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1">Sq ft</p>
                </div>
              </div>
            )}

            <div className="ds-panel rounded-[10px] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-white leading-none">
                  {new Date(
                    listing.available_date + "T00:00:00",
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-white/40 mt-1">Available</p>
              </div>
            </div>
          </div>

          {/* ── Description ───────────────────────────────────────── */}
          {listing.description && (
            <section className="ds-card-lg p-6" style={fadeIn(180)}>
              <h2 className="text-[11px] uppercase tracking-[0.14em] text-cyan-300/70 font-medium mb-3">
                About this property
              </h2>
              <p className="ds-body whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </section>
          )}

          {/* ── Bidding details ────────────────────────────────────── */}
          <section className="ds-card-lg p-6" style={fadeIn(240)}>
            <div className="flex items-center gap-2 mb-5">
              <Gavel className="w-4 h-4 text-cyan-400/60" />
              <h2 className="text-[11px] uppercase tracking-[0.14em] text-cyan-300/70 font-medium">
                Bidding Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="ds-panel rounded-[10px] p-4 text-center">
                  <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1.5">
                    Minimum Bid
                  </p>
                  <p className="text-[20px] font-bold text-cyan-300">
                    +{formatCents(listing.minimum_bid)}
                  </p>
                  <p className="text-[11px] text-white/30 mt-0.5">premium</p>
                </div>
                <div className="ds-panel rounded-[10px] p-4 text-center">
                  <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1.5">
                    Bidding Opens
                  </p>
                  <p className="text-[15px] font-semibold text-white">
                    {formatDateTime(listing.bidding_start)}
                  </p>
                </div>
                <div className="ds-panel rounded-[10px] p-4 text-center">
                  <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1.5">
                    Bidding Closes
                  </p>
                  <p className="text-[15px] font-semibold text-white">
                    {formatDateTime(listing.bidding_end)}
                  </p>
                </div>
              </div>

              {/* Countdown */}
              {isActive && (
                <div className="flex items-center gap-3 rounded-[10px] bg-gradient-to-r from-amber-500/[0.08] to-orange-500/[0.06] border border-amber-400/15 px-5 py-3.5">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-amber-200">
                      <CountdownTimer endIso={listing.bidding_end} />
                    </p>
                    <p className="text-[11px] text-amber-300/50 mt-0.5">
                      remaining to place your bid
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Non-owner landlord info */}
          {isLandlord && !isOwner && (
            <section className="ds-card-lg p-6 text-center" style={fadeIn(300)}>
              <p className="ds-body">
                This listing belongs to another landlord account.
              </p>
            </section>
          )}
        </div>

        {/* ════════════ RIGHT COLUMN — Sticky sidebar ════════════ */}
        <div className="lg:sticky lg:top-6" style={fadeIn(80)}>
          <div className="ds-card-lg p-6 overflow-hidden">
            {/* Price hero */}
            <div className="mb-5">
              <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1">
                Monthly Rent
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[36px] font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {formatCents(listing.monthly_rent)}
                </span>
                <span className="text-[15px] text-white/40 font-medium">
                  /month
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.08] mb-5" />

            {/* Quick facts */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="ds-footnote text-white/50">
                  Min bid premium
                </span>
                <span className="text-[14px] font-semibold text-cyan-300">
                  +{formatCents(listing.minimum_bid)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="ds-footnote text-white/50">Available</span>
                <span className="text-[14px] font-medium text-white">
                  {formatDate(listing.available_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="ds-footnote text-white/50">Status</span>
                <span
                  className={`text-[12px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor.text} ${statusColor.bg} ${statusColor.border}`}
                >
                  {STATUS_LABELS[listing.status] ?? listing.status}
                </span>
              </div>
            </div>

            {/* Countdown in sidebar */}
            {isActive && (
              <div className="flex items-center gap-2 rounded-[10px] bg-white/[0.04] border border-white/[0.08] px-4 py-3 mb-5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[13px] font-medium text-amber-200">
                  <CountdownTimer endIso={listing.bidding_end} />
                </span>
              </div>
            )}

            {/* CTA buttons */}
            {isRenter && isActive && (
              <Link
                href={`/listings/${listing.id}/bid`}
                className="ds-btn ds-btn-accent w-full h-12 text-[15px] rounded-[10px] font-semibold"
              >
                Place a Bid
              </Link>
            )}

            {!user && isActive && (
              <div className="text-center">
                <p className="ds-footnote mb-3">
                  Sign in as a renter to place a bid.
                </p>
                <Link
                  href="/signin"
                  className="ds-btn ds-btn-primary w-full h-11 text-[14px] rounded-[10px]"
                >
                  Sign in to bid
                </Link>
              </div>
            )}

            {isOwner && (
              <Link
                href={`/landlord/listings/${listing.id}/edit`}
                className="ds-btn ds-btn-primary w-full h-11 text-[14px] rounded-[10px]"
              >
                <Pencil className="w-4 h-4" /> Edit Listing
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox overlay ────────────────────────────────────── */}
      {lightboxOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full mx-4 aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getListingImageUrl(photos[photoIndex])}
              alt={`Photo ${photoIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-3 py-1.5 text-[13px] text-white/70 backdrop-blur-sm">
              {photoIndex + 1} / {photos.length}
            </div>

            {/* Nav arrows */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                    i === photoIndex
                      ? "border-cyan-400 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={getListingImageUrl(p)}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </ListingsShell>
  );
}
