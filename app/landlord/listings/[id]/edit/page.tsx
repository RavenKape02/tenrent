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
import { ListingsShell } from '../../../../listings/components/ListingsChrome';
import { UsCityStatePickers } from '../../../../components/UsCityStatePickers';
import { normalizeStoredState } from '../../../../lib/usGeo';

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
  /** US state as 2-letter code (e.g. NY) */
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
        setState(normalizeStoredState(l.state));
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
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <p className="ds-body">Only landlords can edit listings.</p>
        <Link href="/landlord" className="ml-2 ds-footnote text-cyan-300 font-medium">Dashboard</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <p className="ds-body text-red-300">{error}</p>
        <Link href="/landlord" className="ml-2 ds-footnote text-cyan-300 font-medium">Dashboard</Link>
      </div>
    );
  }

  if (!listing || listing.landlord_id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <p className="ds-body">Listing not found or you don&apos;t have permission to edit it.</p>
        <Link href="/landlord" className="ml-2 ds-footnote text-cyan-300 font-medium">Dashboard</Link>
      </div>
    );
  }

  const photos = listing.photos ?? [];
  const canAddPhotos = photos.length < 10;

  return (
    <ListingsShell maxWidthClassName="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/landlord"
          className="inline-flex items-center gap-2 ds-footnote text-white/60 hover:text-white transition-colors"
        >
          <span>←</span> Dashboard
        </Link>
        <Link
          href={`/listings/${listing.id}`}
          className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
        >
          View listing →
        </Link>
      </div>

      <div className="ds-card-lg p-6 md:p-8 mb-6">
        <h1 className="ds-h5 mb-1">Edit listing</h1>
        <p className="ds-footnote mb-6">{listing.address_line_1}, {listing.city}</p>

        {/* Bids section */}
        <div className="ds-panel rounded-[10px] p-4 mb-6">
          <h2 className="ds-headline text-[16px] mb-3">Bids</h2>
          {loadingBids ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            </div>
          ) : bids.length === 0 ? (
            <p className="ds-footnote">No bids yet.</p>
          ) : (
            <div className="space-y-2">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between ds-panel rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="ds-body-medium text-[13px]">
                      ${(bid.amount / 100).toFixed(2)} / mo
                    </p>
                    <p className="ds-small">
                      {bid.status} · {new Date(bid.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photos section */}
        <div className="ds-panel rounded-[10px] p-4 mb-6">
          <h2 className="ds-headline text-[16px] mb-3">Photos ({photos.length}/10)</h2>
          <div className="flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <div key={i} className="relative group">
                <Image
                  src={getListingImageUrl(url)}
                  alt={`Photo ${i + 1}`}
                  width={120}
                  height={90}
                  className="rounded-[10px] object-cover w-[120px] h-[90px] border border-white/10"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 text-white rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            {canAddPhotos && (
              <label className="w-[120px] h-[90px] border border-dashed border-white/20 rounded-[10px] flex items-center justify-center cursor-pointer hover:border-cyan-400/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
                <span className="ds-small">{uploading ? '…' : '+ Add'}</span>
              </label>
            )}
          </div>
        </div>

        {error && (
          <div className="ds-pill-red px-4 py-3 rounded-[10px] mb-6 text-[13px]">
            {error}
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ds-input-label">Address line 1 *</label>
            <input type="text" required value={address_line_1} onChange={(e) => setAddress_line_1(e.target.value)} className="ds-input" />
          </div>
          <div>
            <label className="ds-input-label">Address line 2</label>
            <input type="text" value={address_line_2} onChange={(e) => setAddress_line_2(e.target.value)} className="ds-input" />
          </div>
          <UsCityStatePickers
            city={city}
            stateCode={state}
            onCityChange={setCity}
            onStateChange={setState}
          />
          <div>
            <label className="ds-input-label">ZIP code *</label>
            <input type="text" required value={zip_code} onChange={(e) => setZip_code(e.target.value)} className="ds-input max-w-[140px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ds-input-label">Monthly rent ($) *</label>
              <input type="number" step="0.01" min="0" required value={monthly_rent} onChange={(e) => setMonthly_rent(e.target.value)} className="ds-input" />
            </div>
            <div>
              <label className="ds-input-label">Minimum bid ($) *</label>
              <input type="number" step="0.01" min="0" required value={minimum_bid} onChange={(e) => setMinimum_bid(e.target.value)} className="ds-input" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="ds-input-label">Bedrooms *</label>
              <input type="number" min="0" required value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="ds-input" />
            </div>
            <div>
              <label className="ds-input-label">Bathrooms *</label>
              <input type="number" step="0.1" min="0" required value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="ds-input" />
            </div>
            <div>
              <label className="ds-input-label">Sq ft</label>
              <input type="number" min="0" value={square_feet} onChange={(e) => setSquare_feet(e.target.value)} className="ds-input" />
            </div>
          </div>
          <div>
            <label className="ds-input-label">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="ds-input h-auto py-2" />
          </div>
          <div>
            <label className="ds-input-label">Available date *</label>
            <input type="date" required value={available_date} onChange={(e) => setAvailable_date(e.target.value)} className="ds-input max-w-[200px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ds-input-label">Bidding starts *</label>
              <input type="datetime-local" required value={bidding_start} onChange={(e) => setBidding_start(e.target.value)} className="ds-input" />
            </div>
            <div>
              <label className="ds-input-label">Bidding ends *</label>
              <input type="datetime-local" required value={bidding_end} onChange={(e) => setBidding_end(e.target.value)} className="ds-input" />
            </div>
          </div>
          <div>
            <label className="ds-input-label">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ListingStatus)} className="ds-input max-w-[200px]">
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0b1320]">{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="ds-btn ds-btn-primary h-11 px-6 text-[14px] rounded-[10px] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="ds-btn ds-btn-ghost h-11 px-6 text-[14px] rounded-[10px]"
            >
              View listing
            </Link>
          </div>
        </form>
      </div>
    </ListingsShell>
  );
}
