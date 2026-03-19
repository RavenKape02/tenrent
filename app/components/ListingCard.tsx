'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ListingRead } from '../lib/api';
import { getListingImageUrl } from '../lib/api';
import CountdownTimer from './CountdownTimer';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Accepting Bids',
  bidding_closed: 'Bidding Closed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

interface ListingCardProps {
  listing: ListingRead;
  /** Optional: show as compact card (e.g. in landlord dashboard) */
  compact?: boolean;
  /** Optional: show "View Bids" instead of "View & Bid" for landlord */
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
  const address =
    [listing.address_line_1, listing.address_line_2].filter(Boolean).join(', ') +
    `, ${listing.city}, ${listing.state}`;
  const isActive = listing.status === 'active';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <div className="relative">
        {photo ? (
          <Image
            src={photo}
            alt={address}
            width={376}
            height={277}
            className="w-full h-48 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
            <span>No photo</span>
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded uppercase font-semibold ${
            isActive ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          {STATUS_LABELS[listing.status] ?? listing.status}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 flex-shrink-0"
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
          <span className="truncate">{listing.city}, {listing.state}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-1">
          {listing.address_line_1}
          {listing.address_line_2 ? `, ${listing.address_line_2}` : ''}
        </h3>

        {!compact && (
          <>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Base Rent:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCents(listing.monthly_rent)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Min Bid:</span>
                <span className="text-sm font-semibold text-[#ff214f]">
                  +{formatCents(listing.minimum_bid)}
                </span>
              </div>
            </div>

            {isActive && (
              <div className="flex items-center gap-2 mb-3 text-orange-600 bg-orange-50 px-3 py-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm font-semibold">
                  <CountdownTimer endIso={listing.bidding_end} />
                </span>
              </div>
            )}

            {listing.description && (
              <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                {listing.description}
              </p>
            )}
          </>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 bg-blue-50 border border-blue-500/30 rounded px-2 py-2 w-fit">
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">
                {listing.bedrooms}
              </span>
              <p className="text-gray-500 text-[10px]">bedrooms</p>
            </div>
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">
                {Number(listing.bathrooms)}
              </span>
              <p className="text-gray-500 text-[10px]">bathrooms</p>
            </div>
            {listing.square_feet != null && (
              <div className="text-center">
                <span className="text-blue-600 font-bold text-sm">
                  {listing.square_feet}
                </span>
                <p className="text-gray-500 text-[10px]">sq ft</p>
              </div>
            )}
          </div>
          <Link
            href={`/listings/${listing.id}`}
            className="bg-[#14395b] text-white px-4 py-3 rounded-lg hover:bg-[#0d2a42] transition-colors w-full font-semibold text-center"
          >
            {asLandlord ? 'View listing' : 'View & Bid'}
          </Link>
        </div>
      </div>
    </div>
  );
}
