import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TenRent - Bid for Your Dream Rental",
  description:
    "Transparent bidding marketplace for competitive rental markets. Win priority access to premium properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-[family-name:var(--font-outfit)]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
