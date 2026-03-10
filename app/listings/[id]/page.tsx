'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { listingsAPI, getListingImageUrl, type ListingRead } from '../../lib/api';

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function timeUntil(endIso: string): string {
  const end = new Date(endIso);
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return 'Ended';
  const d = Math.floor(ms / (24 * 60 * 60 * 1000));
  const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h left`;
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${m}m left`;
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
        setError(e instanceof Error ? e.message : 'Failed to load listing');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && listing && listing.landlord_id === user.id;
  const isLandlord = user?.user_type === 'landlord';
  const isRenter = user?.user_type === 'renter';
  const isActive = listing?.status === 'active';

  const handleDelete = async () => {
    if (!listing || !confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(true);
    try {
      await listingsAPI.delete(listing.id);
      router.push('/landlord');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2]"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Listing not found'}</p>
          <Link href="/listings" className="text-[#0fa8e2] font-semibold hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [];
  const mainPhoto = photos[photoIndex]
    ? getListingImageUrl(photos[photoIndex])
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0fa8e2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-gray-900 font-semibold text-2xl">TenRent</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/listings" className="text-[#0fa8e2] font-semibold">Browse Listings</Link>
            {user && (
              isLandlord ? (
                <Link href="/landlord" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              ) : (
                <Link href="/renter" className="text-gray-600 hover:text-gray-900">My Bids</Link>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to listings
        </Link>

        {/* Actions: landlord owner only */}
        {isOwner && (
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              You own this listing
            </span>
            <Link
              href={`/landlord/listings/${listing.id}/edit`}
              className="bg-[#0fa8e2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0d8ec4] transition-colors"
            >
              Edit listing
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete listing'}
            </button>
          </div>
        )}

        {/* Photo gallery */}
        <div className="rounded-xl overflow-hidden bg-muted mb-8">
          {mainPhoto ? (
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={mainPhoto}
                alt={listing.address_line_1}
                fill
                className="object-cover"
                unoptimized
              />
              {photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i === photoIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] flex items-center justify-center text-muted-foreground">
              No photos
            </div>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {listing.address_line_1}
          {listing.address_line_2 ? `, ${listing.address_line_2}` : ''}
        </h1>
        <p className="text-gray-600 mb-4">
          {listing.city}, {listing.state} {listing.zip_code}
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <span className="inline-flex items-center gap-1 text-gray-700">
            <strong>{listing.bedrooms}</strong> bed
          </span>
          <span className="inline-flex items-center gap-1 text-gray-700">
            <strong>{Number(listing.bathrooms)}</strong> bath
          </span>
          {listing.square_feet != null && (
            <span className="inline-flex items-center gap-1 text-gray-700">
              <strong>{listing.square_feet}</strong> sq ft
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rent & Bidding</h2>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Base rent</span>
              <span className="font-semibold">{formatCents(listing.monthly_rent)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum bid (premium)</span>
              <span className="font-semibold text-[#ff214f]">+{formatCents(listing.minimum_bid)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Available</span>
              <span>{formatDate(listing.available_date)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Bidding ends</span>
              <span>{formatDate(listing.bidding_end)}</span>
            </div>
          </div>
          {isActive && (
            <div className="mt-4 flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              <span className="font-semibold">{timeUntil(listing.bidding_end)}</span>
            </div>
          )}
        </div>

        {listing.description && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}

        {/* Renter: Place bid CTA */}
        {isRenter && isActive && (
          <div className="bg-[#14395b] text-white rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Ready to bid?</h2>
            <p className="text-white/90 text-sm mb-4">
              Place a premium bid to get priority consideration. Minimum bid: +{formatCents(listing.minimum_bid)}.
            </p>
            <Link
              href={`/listings/${listing.id}/bid`}
              className="inline-block bg-[#ff214f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
            >
              Place bid
            </Link>
          </div>
        )}

        {!user && isActive && (
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-700 mb-3">Sign in as a renter to place a bid.</p>
            <Link href="/" className="text-[#0fa8e2] font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
