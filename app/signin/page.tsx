"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI, APIError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 md:flex-row md:items-center md:justify-between md:px-16 lg:px-24">
          {/* Left text */}
          <h1 className="hidden text-[50px] font-bold uppercase leading-tight text-white md:block">
            Start looking for
            <br />
            rentals
          </h1>

          {/* Sign In Card */}
          <div className="w-full max-w-87.75 rounded-[10px] bg-[#c4c2c2]/85 p-9 backdrop-blur-sm md:mr-8 lg:mr-16">
            <div className="mb-6 text-center">
              <h2 className="text-[16px] font-bold text-[#09090b]">SIGN IN</h2>
              <p className="mt-2 text-[12px] text-black">
                Welcome back! Please sign in to continue
              </p>
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#808080] bg-white px-2.5 py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] transition-colors hover:bg-gray-50"
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
                Continue with Google
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
              <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-[12px] text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-bold text-[#52525b]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-7.75 w-full rounded-lg border border-[#e5e5e5] bg-white px-2.5 py-2 text-[12px] text-gray-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] focus:border-[#0fa8e2] focus:outline-none focus:ring-1 focus:ring-[#0fa8e2]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-bold text-[#52525b]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-7.75 w-full rounded-lg border border-[#e5e5e5] bg-white px-2.5 py-2 text-[12px] text-gray-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] focus:border-[#0fa8e2] focus:outline-none focus:ring-1 focus:ring-[#0fa8e2]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg border border-[#0a0a0a] bg-[#0a0a0a] px-2.5 py-2 text-[12px] font-bold text-[#fafafa] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.11)] transition-colors hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <p className="mt-4 text-center text-[12px] text-[#404040]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#09090b] hover:underline"
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
