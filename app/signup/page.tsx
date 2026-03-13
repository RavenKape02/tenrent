"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, APIError, UserCreate } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { getGoogleIdToken } from "../lib/googleAuth";

export default function SignUpPage() {
  const [formData, setFormData] = useState<UserCreate>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "renter",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData);

      const token = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      await login(token.access_token);

      if (formData.user_type === "landlord") {
        router.push("/landlord");
      } else {
        router.push("/renter");
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      // Returns a Google OAuth access token via popup
      const accessToken = await getGoogleIdToken();
      const token = await authAPI.loginWithGoogle({
        access_token: accessToken,
        user_type: formData.user_type,
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        phone: formData.phone || undefined,
      });

      await login(token.access_token);

      if (formData.user_type === "landlord") {
        router.push("/landlord");
      } else {
        router.push("/renter");
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-7.75 w-full rounded-lg border border-[#e5e5e5] bg-white px-2.5 py-2 text-[12px] text-gray-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] focus:border-[#0fa8e2] focus:outline-none focus:ring-1 focus:ring-[#0fa8e2]";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#47494a]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('/backgroundlogin.png')",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-8 pt-8 md:px-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
              <span className="text-lg font-bold text-[#0fa8e2]">T</span>
            </div>
            <span className="text-[25px] font-bold text-white">Tenrent</span>
          </Link>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-8 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
          {/* Left text */}
          <h1 className="hidden text-[50px] font-bold uppercase leading-tight text-white md:block">
            Find your
            <br />
            next home
          </h1>

          {/* Sign Up Card */}
          <div className="w-full max-w-96 rounded-[10px] bg-[#c4c2c2]/85 p-9 backdrop-blur-sm md:mr-8 lg:mr-16">
            <div className="mb-6 text-center">
              <h2 className="text-[16px] font-bold text-[#09090b]">SIGN UP</h2>
              <p className="mt-2 text-[12px] text-black">
                Create your TenRent account
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#808080] bg-white px-2.5 py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[12px] text-[#52525b]">
                {loading ? "Creating Account..." : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="my-3 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e5e5]" />
              <span className="text-[12px] text-[#52525b]">or</span>
              <div className="h-px flex-1 bg-[#e5e5e5]" />
            </div>

            {/* Form */}
            {error && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* User type */}
              <div>
                <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                  I am a
                </label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="renter">
                    Renter (Looking for properties)
                  </option>
                  <option value="landlord">
                    Landlord (Listing properties)
                  </option>
                </select>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                  Password (min 8 characters)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-[12px] font-bold text-[#52525b]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg border border-[#0a0a0a] bg-[#0a0a0a] px-2.5 py-2 text-[12px] font-bold text-[#fafafa] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] transition-colors hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Continue"}
              </button>
            </form>

            <p className="mt-4 text-center text-[12px] text-[#404040]">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-[#09090b] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
