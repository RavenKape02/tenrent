// API client for TenRent backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Resolve listing photo URL (backend may return relative paths like /uploads/...) */
export function getListingImageUrl(photo: string): string {
  if (photo.startsWith('http')) return photo;
  return `${API_BASE_URL.replace(/\/$/, '')}${photo.startsWith('/') ? '' : '/'}${photo}`;
}

export interface UserCreate {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'landlord' | 'renter';
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserRead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'landlord' | 'renter';
  phone?: string;
  created_at: string;
  updated_at: string;
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers from options
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new APIError(response.status, error.detail || 'An error occurred');
  }

  return response.json();
}

/** Use for FormData (e.g. file upload); do not set Content-Type so browser sets multipart boundary */
async function fetchAPIFormData<T>(
  endpoint: string,
  options: RequestInit & { body?: FormData } = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.headers) {
    const existing = options.headers as Record<string, string>;
    Object.assign(headers, existing);
  }
  const { body, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: Object.keys(headers).length ? headers : undefined,
    body,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new APIError(response.status, error.detail || 'An error occurred');
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

// ============== Listings ==============

export type ListingStatus =
  | 'draft'
  | 'active'
  | 'bidding_closed'
  | 'completed'
  | 'cancelled';

export interface ListingRead {
  id: string;
  landlord_id: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  description: string | null;
  photos: string[] | null;
  available_date: string;
  bidding_start: string;
  bidding_end: string;
  minimum_bid: number;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ListingCreatePayload {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  description?: string;
  available_date: string;
  bidding_start: string;
  bidding_end: string;
  minimum_bid: number;
  status?: ListingStatus;
}

export interface ListListingsParams {
  status?: ListingStatus;
  city?: string;
  min_rent?: number;
  max_rent?: number;
  bedrooms?: number;
  available_before?: string;
  skip?: number;
  limit?: number;
}

export const listingsAPI = {
  async list(params: ListListingsParams = {}): Promise<ListingRead[]> {
    const search = new URLSearchParams();
    if (params.status != null) search.set('status', params.status);
    if (params.city) search.set('city', params.city);
    if (params.min_rent != null) search.set('min_rent', String(params.min_rent));
    if (params.max_rent != null) search.set('max_rent', String(params.max_rent));
    if (params.bedrooms != null) search.set('bedrooms', String(params.bedrooms));
    if (params.available_before) search.set('available_before', params.available_before);
    if (params.skip != null) search.set('skip', String(params.skip));
    if (params.limit != null) search.set('limit', String(params.limit));
    const qs = search.toString();
    return fetchAPI<ListingRead[]>(`/api/listings${qs ? `?${qs}` : ''}`);
  },

  async get(id: string): Promise<ListingRead> {
    return fetchAPI<ListingRead>(`/api/listings/${id}`);
  },

  async create(data: ListingCreatePayload): Promise<ListingRead> {
    return fetchAPI<ListingRead>('/api/listings/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ListingCreatePayload>): Promise<ListingRead> {
    return fetchAPI<ListingRead>(`/api/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'An error occurred' }));
      throw new APIError(res.status, err.detail || 'An error occurred');
    }
  },

  async uploadPhotos(listingId: string, files: File[]): Promise<ListingRead> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return fetchAPIFormData<ListingRead>(
      `/api/listings/${listingId}/photos`,
      { method: 'POST', body: formData }
    );
  },

  async deletePhoto(listingId: string, photoIndex: number): Promise<void> {
    const res = await fetch(
      `${API_BASE_URL}/api/listings/${listingId}/photos/${photoIndex}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'An error occurred' }));
      throw new APIError(res.status, err.detail || 'An error occurred');
    }
  },
};

// ============== Bids (renter only for place/withdraw; landlord for list) ==============

export type BidStatus =
  | 'active'
  | 'outbid'
  | 'won'
  | 'lost'
  | 'withdrawn'
  | 'refunded';

export interface BidRead {
  id: string;
  listing_id: string;
  renter_id: string;
  amount: number;
  status: BidStatus;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export const bidsAPI = {
  async place(listingId: string, amountCents: number): Promise<BidRead> {
    return fetchAPI<BidRead>(`/api/listings/${listingId}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount: amountCents }),
    });
  },

  async getMyBids(): Promise<BidRead[]> {
    return fetchAPI<BidRead[]>('/api/users/me/bids');
  },
};

export const authAPI = {
  async register(data: UserCreate): Promise<UserRead> {
    return fetchAPI<UserRead>('/auth/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginRequest): Promise<Token> {
    return fetchAPI<Token>('/auth/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<UserRead> {
    return fetchAPI<UserRead>('/auth/api/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return fetchAPI<void>('/auth/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },
};

export { APIError };
