"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ListingRead } from "../lib/api";
import { getListingImageUrl } from "../lib/api";
import CountdownTimer from "./CountdownTimer";
import { usePhotoTransition } from "../contexts/PhotoTransitionContext";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Accepting Bids",
  bidding_closed: "Bidding Closed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_PILL: Record<string, string> = {
  active: "ds-pill-green",
  draft: "ds-pill-neutral",
  bidding_closed: "ds-pill-amber",
  completed: "ds-pill-cyan",
  cancelled: "ds-pill-red",
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

interface ListingCardProps {
  listing: ListingRead;
  compact?: boolean;
  asLandlord?: boolean;
}

export default function ListingCard({
  listing,
  compact = false,
  asLandlord = false,
}: ListingCardProps) {
  const photo =
    listing.photos && listing.photos.length > 0
      ? getListingImageUrl(listing.photos[0])
      : null;
  const isActive = listing.status === "active";
  const { setSource } = usePhotoTransition();
  const cardRef = useRef<HTMLDivElement>(null);

  /** Capture the card image rect so the overlay can animate from it. */
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const img = cardRef.current?.querySelector("img");
    if (img) {
      const r = img.getBoundingClientRect();
      setSource({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        src: img.src,
        photoCount: listing.photos?.length ?? 1,
      });
    }
  };

  return (
    <div ref={cardRef} className="ds-card ds-hover-lift overflow-hidden group">
      {/* Image — clickable, kicks off the photo transition overlay */}
      <Link
        href={`/listings/${listing.id}`}
        className="relative overflow-hidden block cursor-pointer"
        onClick={handleNavigate}
      >
        {photo ? (
          <Image
            src={photo}
            alt={`${listing.address_line_1}, ${listing.city}`}
            width={376}
            height={240}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-48 bg-white/[0.03] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 22V12h6v10"
              />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Status badge */}
        <span
          className={`ds-pill absolute top-3 left-3 ${STATUS_PILL[listing.status] ?? "ds-pill-neutral"}`}
        >
          {STATUS_LABELS[listing.status] ?? listing.status}
        </span>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="h-3.5 w-3.5 text-cyan-400/70 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="ds-small text-white/50 truncate">
            {listing.city}, {listing.state}
          </span>
        </div>

        {/* Address */}
        <h3 className="font-semibold text-[15px] text-white mb-3 line-clamp-1 leading-tight">
          {listing.address_line_1}
          {listing.address_line_2 ? `, ${listing.address_line_2}` : ""}
        </h3>

        {!compact && (
          <>
            {/* Pricing */}
            <div className="ds-panel rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="ds-small text-white/40">Base Rent</span>
                <span className="text-[14px] font-semibold text-white">
                  {formatCents(listing.monthly_rent)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="ds-small text-white/40">Min Bid</span>
                <span className="text-[14px] font-semibold text-cyan-300">
                  +{formatCents(listing.minimum_bid)}
                </span>
              </div>
            </div>

            {/* Countdown */}
            {isActive && (
              <div className="flex items-center gap-2 mb-3 ds-pill-amber px-3 py-2 rounded-lg">
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[13px] font-medium">
                  <CountdownTimer endIso={listing.bidding_end} />
                </span>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <p className="ds-small line-clamp-2 mb-3">
                {listing.description}
              </p>
            )}
          </>
        )}

        {/* Stats + CTA */}
        <div className="flex flex-col gap-3">
          {/* Property specs */}
          <div className="flex gap-2">
            <span className="ds-pill ds-pill-neutral text-[11px] px-2 py-1">
              {listing.bedrooms} bed
            </span>
            <span className="ds-pill ds-pill-neutral text-[11px] px-2 py-1">
              {Number(listing.bathrooms)} bath
            </span>
            {listing.square_feet != null && (
              <span className="ds-pill ds-pill-neutral text-[11px] px-2 py-1">
                {listing.square_feet} sqft
              </span>
            )}
          </div>

          <Link
            href={`/listings/${listing.id}`}
            className="ds-btn ds-btn-primary w-full text-[13px] h-10 rounded-lg"
            onClick={handleNavigate}
          >
            {asLandlord ? "View Listing" : "View & Bid"}
          </Link>
        </div>
      </div>
    </div>
  );
}
