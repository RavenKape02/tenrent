"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, APIError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { getGoogleIdToken } from "../lib/googleAuth";
import TenRentLogo from "../components/TenRentLogo";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const accessToken = await getGoogleIdToken();
      const token = await authAPI.loginWithGoogle({ access_token: accessToken });
      await login(token.access_token);

      const userData = await authAPI.getCurrentUser();

      if (userData.user_type === "landlord") {
        router.push("/landlord");
      } else {
        router.push("/renter");
      }
    } catch (err) {
      if (err instanceof APIError) {
        if (
          err.status === 400 &&
          err.message === "User type is required to create a new account with Google"
        ) {
          router.push("/signup?from=google");
          return;
        } else {
          setError(err.message);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await authAPI.login({ email, password });
      await login(token.access_token);

      const userData = await authAPI.getCurrentUser();

      if (userData.user_type === "landlord") {
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030711]">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-[40rem] w-[40rem] rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[35rem] w-[35rem] rounded-full bg-sky-500/6 blur-[140px]" />
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
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
          {/* Left heading */}
          <div className="hidden md:block">
            <h1 className="ds-h3 leading-[1.1]">
              Start looking for
              <br />
              rentals
            </h1>
            <p className="ds-body mt-4 max-w-sm">
              Sign in to access your dashboard and start bidding on premium properties.
            </p>
          </div>

          {/* Sign In Card */}
          <div className="w-full max-w-sm ds-card-lg p-8 md:mr-8 lg:mr-16">
            <div className="mb-6 text-center">
              <h2 className="ds-headline font-semibold">Sign In</h2>
              <p className="ds-small mt-2">
                Welcome back! Please sign in to continue
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
                {loading ? "Signing in..." : "Continue with Google"}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="ds-input-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ds-input"
                />
              </div>

              <div>
                <label className="ds-input-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="ds-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ds-btn ds-btn-primary w-full h-10 rounded-lg text-[13px] disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <p className="mt-5 text-center ds-small">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
