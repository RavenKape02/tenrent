'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  listingsAPI,
  getListingImageUrl,
  type ListingRead,
  type ListingCreatePayload,
  type ListingStatus,
  bidsAPI,
  type BidRead,
} from '../../../../lib/api';

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'bidding_closed', label: 'Bidding Closed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bids, setBids] = useState<BidRead[]>([]);
  const [loadingBids, setLoadingBids] = useState(true);

  const [address_line_1, setAddress_line_1] = useState('');
  const [address_line_2, setAddress_line_2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip_code, setZip_code] = useState('');
  const [monthly_rent, setMonthly_rent] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [square_feet, setSquare_feet] = useState('');
  const [description, setDescription] = useState('');
  const [available_date, setAvailable_date] = useState('');
  const [bidding_start, setBidding_start] = useState('');
  const [bidding_end, setBidding_end] = useState('');
  const [minimum_bid, setMinimum_bid] = useState('');
  const [status, setStatus] = useState<ListingStatus>('draft');

  useEffect(() => {
    if (!id) return;
    listingsAPI
      .get(id)
      .then((l) => {
        setListing(l);
        setAddress_line_1(l.address_line_1);
        setAddress_line_2(l.address_line_2 || '');
        setCity(l.city);
        setState(l.state);
        setZip_code(l.zip_code);
        setMonthly_rent(String((l.monthly_rent / 100).toFixed(2)));
        setBedrooms(String(l.bedrooms));
        setBathrooms(String(l.bathrooms));
        setSquare_feet(l.square_feet != null ? String(l.square_feet) : '');
        setDescription(l.description || '');
        setAvailable_date(l.available_date.slice(0, 10));
        setBidding_start(l.bidding_start.slice(0, 16));
        setBidding_end(l.bidding_end.slice(0, 16));
        setMinimum_bid(String((l.minimum_bid / 100).toFixed(2)));
        setStatus(l.status);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingBids(true);
    bidsAPI
      .getForListing(id)
      .then(setBids)
      .catch(() => setBids([]))
      .finally(() => setLoadingBids(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setError(null);
    const rentCents = Math.round(parseFloat(monthly_rent || '0') * 100);
    const minBidCents = Math.round(parseFloat(minimum_bid || '0') * 100);
    if (rentCents <= 0 || minBidCents <= 0) {
      setError('Rent and minimum bid must be greater than 0');
      return;
    }
    const payload: Partial<ListingCreatePayload> = {
      address_line_1: address_line_1.trim(),
      address_line_2: address_line_2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zip_code: zip_code.trim(),
      monthly_rent: rentCents,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseFloat(bathrooms) || 0,
      square_feet: square_feet.trim() ? parseInt(square_feet, 10) : undefined,
      description: description.trim() || undefined,
      available_date: available_date || undefined,
      bidding_start: bidding_start ? new Date(bidding_start).toISOString() : undefined,
      bidding_end: bidding_end ? new Date(bidding_end).toISOString() : undefined,
      minimum_bid: minBidCents,
      status,
    };
    setSaving(true);
    try {
      const updated = await listingsAPI.update(listing.id, payload);
      setListing(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!listing || !e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const currentCount = listing.photos?.length ?? 0;
    if (currentCount + files.length > 10) {
      setError(`Max 10 photos. You have ${currentCount}. Remove some first.`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const updated = await listingsAPI.uploadPhotos(listing.id, files);
      setListing(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!listing || !confirm('Remove this photo?')) return;
    try {
      await listingsAPI.deletePhoto(listing.id, index);
      const newPhotos = [...(listing.photos || [])];
      newPhotos.splice(index, 1);
      setListing({ ...listing, photos: newPhotos.length ? newPhotos : null });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (!user || user.user_type !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Only landlords can edit listings.</p>
        <Link href="/landlord" className="ml-2 text-[#0fa8e2] font-semibold">Dashboard</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2]"></div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
        <Link href="/landlord" className="ml-2 text-[#0fa8e2] font-semibold">Dashboard</Link>
      </div>
    );
  }

  if (!listing || listing.landlord_id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Listing not found or you don’t have permission to edit it.</p>
        <Link href="/landlord" className="ml-2 text-[#0fa8e2] font-semibold">Dashboard</Link>
      </div>
    );
  }

  const photos = listing.photos ?? [];
  const canAddPhotos = photos.length < 10;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/landlord" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0fa8e2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-gray-900 font-semibold text-2xl">TenRent</span>
          </Link>
          <div className="flex gap-4">
            <Link href={`/listings/${listing.id}`} className="text-gray-600 hover:text-gray-900">
              View listing
            </Link>
            <Link href="/landlord" className="text-gray-600 hover:text-gray-900">← Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit listing</h1>
        <p className="text-gray-600 mb-6">{listing.address_line_1}, {listing.city}</p>

        {/* Bids on this listing */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Bids</h2>
          {loadingBids ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0fa8e2]" />
            </div>
          ) : bids.length === 0 ? (
            <p className="text-sm text-gray-600">No bids yet.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      ${(bid.amount / 100).toFixed(2)} / mo • {bid.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Placed {new Date(bid.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photos — Landlord only */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Photos ({photos.length}/10)</h2>
          <div className="flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <div key={i} className="relative group">
                <Image
                  src={getListingImageUrl(url)}
                  alt={`Photo ${i + 1}`}
                  width={120}
                  height={90}
                  className="rounded-lg object-cover w-[120px] h-[90px]"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {canAddPhotos && (
              <label className="w-[120px] h-[90px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#0fa8e2] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
                <span className="text-gray-500 text-sm">{uploading ? '…' : '+ Add'}</span>
              </label>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1 *</label>
            <input
              type="text"
              required
              value={address_line_1}
              onChange={(e) => setAddress_line_1(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2</label>
            <input
              type="text"
              value={address_line_2}
              onChange={(e) => setAddress_line_2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP code *</label>
            <input
              type="text"
              required
              value={zip_code}
              onChange={(e) => setZip_code(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 max-w-[140px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly rent ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={monthly_rent}
                onChange={(e) => setMonthly_rent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum bid ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={minimum_bid}
                onChange={(e) => setMinimum_bid(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
              <input
                type="number"
                min="0"
                required
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sq ft</label>
              <input
                type="number"
                min="0"
                value={square_feet}
                onChange={(e) => setSquare_feet(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available date *</label>
            <input
              type="date"
              required
              value={available_date}
              onChange={(e) => setAvailable_date(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 max-w-[200px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bidding starts *</label>
              <input
                type="datetime-local"
                required
                value={bidding_start}
                onChange={(e) => setBidding_start(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bidding ends *</label>
              <input
                type="datetime-local"
                required
                value={bidding_end}
                onChange={(e) => setBidding_end(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 max-w-[200px]"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0fa8e2] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0d8ec4] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              View listing
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
