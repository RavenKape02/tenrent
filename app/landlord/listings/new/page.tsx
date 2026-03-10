'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { listingsAPI, type ListingCreatePayload, type ListingStatus } from '../../../lib/api';

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active (publish)' },
];

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const rentCents = Math.round(parseFloat(monthly_rent || '0') * 100);
    const minBidCents = Math.round(parseFloat(minimum_bid || '0') * 100);
    if (rentCents <= 0 || minBidCents <= 0) {
      setError('Rent and minimum bid must be greater than 0');
      return;
    }
    const payload: ListingCreatePayload = {
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
      available_date: available_date || new Date().toISOString().slice(0, 10),
      bidding_start: bidding_start ? new Date(bidding_start).toISOString() : new Date().toISOString(),
      bidding_end: bidding_end ? new Date(bidding_end).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      minimum_bid: minBidCents,
      status,
    };
    setSubmitting(true);
    try {
      const created = await listingsAPI.create(payload);
      router.push(`/landlord/listings/${created.id}/edit`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.user_type !== 'landlord') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Only landlords can create listings.</p>
        <Link href="/landlord" className="ml-2 text-[#0fa8e2] font-semibold">Go to dashboard</Link>
      </div>
    );
  }

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
          <Link href="/landlord" className="text-gray-600 hover:text-gray-900">← Dashboard</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create new listing</h1>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2 (unit, etc.)</label>
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
                placeholder="e.g. NY"
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
              disabled={submitting}
              className="bg-[#ff214f] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e01d45] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating…' : 'Create listing'}
            </button>
            <Link
              href="/landlord"
              className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
