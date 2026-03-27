"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { listingsAPI, type MarketInsights } from "../lib/api";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function LandlordCTA() {
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsAPI
      .getMarketInsights(14)
      .then(setInsights)
      .catch(() => setInsights(null))
      .finally(() => setLoading(false));
  }, []);

  const pulseEvents = useMemo(() => {
    if (!insights) {
      return [
        "No live market metrics available yet",
        "Create a listing to begin collecting bid activity",
      ];
    }

    const premium = (insights.highest_premium_cents / 100).toLocaleString();
    const avgBids = insights.average_bids_per_listing.toFixed(2);

    return [
      `${insights.active_listings_count} active listings in market`,
      `${insights.total_bids_in_window} bids recorded in last ${insights.window_days} days`,
      `Top premium currently at $${premium} over minimum bid`,
      `${avgBids} average bids per active listing (${insights.average_premium_percent.toFixed(2)}% avg premium)`,
    ];
  }, [insights]);

  const momentumTiles = useMemo(() => {
    if (!insights) return [];

    return insights.listing_momentum.map((entry) => {
      const peak = Math.max(...entry.daily_bid_counts, 1);
      const bars = entry.daily_bid_counts.map((value) =>
        Math.max(14, Math.round((value / peak) * 100)),
      );

      const trend = `+$${(entry.premium_cents / 100).toLocaleString()}`;

      return {
        title: entry.title,
        trend,
        bars,
      };
    });
  }, [insights]);

  const queueHealth = useMemo(() => {
    if (!insights) return "No market activity yet";
    if (insights.average_bids_per_listing >= 5)
      return "Very strong competitive activity";
    if (insights.average_bids_per_listing >= 3)
      return "Healthy and consistent demand";
    if (insights.average_bids_per_listing >= 1) return "Early demand building";
    return "Low activity, opportunity to attract first movers";
  }, [insights]);

  const queueGrade = useMemo(() => {
    if (!insights) return "-";
    if (insights.average_bids_per_listing >= 5) return "A+";
    if (insights.average_bids_per_listing >= 3) return "A";
    if (insights.average_bids_per_listing >= 2) return "B";
    if (insights.average_bids_per_listing >= 1) return "C";
    return "D";
  }, [insights]);

  const avgPremiumText = useMemo(() => {
    if (!insights) return "--";
    return `${insights.average_premium_percent.toFixed(2)}%`;
  }, [insights]);

  const compactContext = useMemo(() => {
    if (!insights) return "No recent data yet";
    return `${insights.listings_closing_within_48h} listings close in 48h`;
  }, [insights]);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 mb-3 text-center md:text-left">
            Landlord Control Room
          </p>
          <h2
            className={`${cormorant.className} text-4xl md:text-6xl font-semibold text-white text-center md:text-left leading-[0.95]`}
          >
            Open Your Listing
            <br />
            To Serious Demand
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-8 items-start mt-10">
          <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                <span className="text-xs uppercase tracking-[0.15em] text-cyan-200">
                  Live Session
                </span>
              </div>
              <span className="text-xs text-slate-400 uppercase tracking-[0.16em]">
                Market Pulse
              </span>
            </div>

            <div className="space-y-3">
              {pulseEvents.map((event) => (
                <div
                  key={event}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1220]/80 px-3 py-2.5"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  <span className="text-sm text-slate-200">{event}</span>
                </div>
              ))}
            </div>

            {loading && (
              <p className="mt-4 text-xs text-slate-400">
                Loading live metrics...
              </p>
            )}

            <Link
              href="/signup"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-sky-600 text-white px-6 py-3 rounded-2xl text-base font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_12px_30px_rgba(8,145,178,0.35)]"
            >
              Open your listing to serious renters
            </Link>

            <Link
              href="/listings"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 text-slate-100 px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Browse active listings
            </Link>
          </div>

          <div className="rounded-3xl border border-white/15 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">
                Listing Momentum Board
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {momentumTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="rounded-2xl border border-white/10 bg-[#08101d]/85 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-slate-200">{tile.title}</p>
                    <span className="text-sm font-semibold text-cyan-200">
                      {tile.trend}
                    </span>
                  </div>

                  <div className="h-20 flex items-end gap-1.5">
                    {tile.bars.map((value, idx) => (
                      <div
                        key={`${tile.title}-${idx}`}
                        className="flex-1 rounded-t-md bg-linear-to-t from-cyan-600/35 to-cyan-300/85"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {!loading && momentumTiles.length === 0 && (
                <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-[#08101d]/85 p-4">
                  <p className="text-sm text-slate-300">
                    No listing momentum yet. Publish active listings to start
                    seeing bid trends.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#091323]/85 p-4 md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">
                    Queue Health
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{queueHealth}</p>
                  <div className="mt-2.5 inline-flex items-baseline gap-2 rounded-lg border border-cyan-300/20 bg-cyan-400/8 px-2.5 py-1.5">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/75">
                      Avg Premium
                    </span>
                    <span className="text-base font-semibold text-cyan-100">
                      {avgPremiumText}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {compactContext}
                  </p>
                </div>

                <div className="shrink-0 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
                    Grade
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {queueGrade}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
