// API client for TenRent backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
