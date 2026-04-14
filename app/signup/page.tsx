"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, APIError, UserCreate } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { getGoogleIdToken } from "../lib/googleAuth";
import TenRentLogo from "../components/TenRentLogo";

type SignUpFormData = Omit<UserCreate, "user_type"> & {
  user_type: UserCreate["user_type"] | "";
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromGoogle, setFromGoogle] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setFromGoogle(params.get("from") === "google");
  }, []);

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

    if (!formData.user_type) {
      setError("Please select whether you are a renter or landlord.");
      return;
    }

    setLoading(true);

    try {
      const payload: UserCreate = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type as UserCreate["user_type"],
        phone: formData.phone || undefined,
      };
      await authAPI.register(payload);

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

    if (!formData.user_type) {
      setError(
        "Please select whether you are a renter or landlord before continuing with Google.",
      );
      return;
    }

    setLoading(true);

    try {
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030711]">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/3 h-[40rem] w-[40rem] rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 h-[35rem] w-[35rem] rounded-full bg-sky-500/6 blur-[140px]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/backgroundlogin.png')" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-8 pt-8 md:px-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] shadow-[0_6px_18px_rgba(6,182,212,0.12)] transition-shadow group-hover:shadow-[0_8px_24px_rgba(6,182,212,0.18)]">
              <TenRentLogo />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              TenRent
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-8 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
          {/* Left heading */}
          <div className="hidden md:block">
            <h1 className="ds-h3 leading-[1.1]">
              Find your
              <br />
              next home
            </h1>
            <p className="ds-body mt-4 max-w-sm">
              Create your account and start exploring premium rental properties.
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="w-full max-w-md ds-card-lg p-8 md:mr-8 lg:mr-16">
            <div className="mb-6 text-center">
              <h2 className="ds-headline font-semibold">Sign Up</h2>
              <p className="ds-small mt-2">
                Create your TenRent account
              </p>
            </div>

            {fromGoogle && (
              <div className="mb-3 ds-pill-cyan px-3 py-2 rounded-lg text-[12px]">
                We couldn&apos;t find an existing account for that Google email.
                Please complete sign up first to choose your role.
              </div>
            )}

            {/* Google SSO */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="ds-btn ds-btn-ghost w-full h-10 rounded-lg text-[13px] mb-3 disabled:opacity-50"
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
              <span>
                {loading ? "Creating Account..." : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="ds-small">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 ds-pill-red px-3 py-2 rounded-lg text-[12px]">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="ds-input-label">I am a</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                  className="ds-input"
                >
                  <option value="" className="bg-[#0b1320]">Select an Option</option>
                  <option value="renter" className="bg-[#0b1320]">
                    Renter (Looking for properties)
                  </option>
                  <option value="landlord" className="bg-[#0b1320]">
                    Landlord (Listing properties)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="ds-input-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="ds-input"
                  />
                </div>
                <div>
                  <label className="ds-input-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="ds-input"
                  />
                </div>
              </div>

              <div>
                <label className="ds-input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="ds-input"
                />
              </div>

              <div>
                <label className="ds-input-label">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="ds-input"
                />
              </div>

              <div>
                <label className="ds-input-label">Password (min 8 characters)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="ds-input"
                />
              </div>

              <div>
                <label className="ds-input-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="ds-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ds-btn ds-btn-primary w-full h-10 rounded-lg text-[13px] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Continue"}
              </button>
            </form>

            <p className="mt-5 text-center ds-small">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
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
