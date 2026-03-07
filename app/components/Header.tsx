"use client";

import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function Header({ onSignIn, onSignUp }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#0fa8e2] py-4 px-6 md:px-24 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0fa8e2] font-bold text-xl">T</span>
          </div>
          <span className="text-white font-semibold text-2xl md:text-3xl">
            Tenrent
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a
            href="#"
            className="text-white text-lg hover:underline underline underline-offset-4"
          >
            Home
          </a>
          <a href="#" className="text-white text-lg hover:underline">
            Browse Listings
          </a>
          <a href="#" className="text-white text-lg hover:underline">
            How It Works
          </a>
          {user ? (
            <>
              <span className="text-white text-sm">
                Welcome, {user.first_name}!
              </span>
              <button
                onClick={logout}
                className="bg-white text-[#0fa8e2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="bg-white text-[#0fa8e2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="bg-[#ff214f] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#e01d45] transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
        <button className="text-white md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
