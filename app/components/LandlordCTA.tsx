"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listingsAPI, type MarketInsights } from "../lib/api";

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
        <div className="mb-10">
          <p className="ds-caption ds-pill-cyan inline-flex px-3 py-1 rounded-full mb-4 text-[12px] uppercase tracking-[0.16em] text-center md:text-left">
            Landlord Control Room
          </p>
          <h2 className="ds-h3 text-center md:text-left leading-[0.95]">
            Open Your Listing
            <br />
            To Serious Demand
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-6 items-start">
          {/* Left panel — Market Pulse */}
          <div className="ds-card-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="ds-pill ds-pill-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.14em] font-medium">
                  Live Session
                </span>
              </div>
              <span className="ds-small uppercase tracking-[0.14em]">
                Market Pulse
              </span>
            </div>

            <div className="space-y-2.5">
              {pulseEvents.map((event) => (
                <div
                  key={event}
                  className="flex items-center gap-3 ds-panel rounded-lg px-3 py-2.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="ds-footnote text-white/80 text-[13px]">{event}</span>
                </div>
              ))}
            </div>

            {loading && (
              <p className="mt-4 ds-small">
                Loading live metrics...
              </p>
            )}

            <Link
              href="/signup"
              className="ds-btn ds-btn-primary w-full mt-7 h-12 rounded-[10px] text-[15px]"
            >
              Open your listing to serious renters
            </Link>

            <Link
              href="/listings"
              className="ds-btn ds-btn-ghost w-full mt-3 h-11 rounded-[10px] text-[14px]"
            >
              Browse active listings
            </Link>
          </div>

          {/* Right panel — Momentum Board */}
          <div className="ds-card-lg p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="ds-caption text-cyan-300/80 uppercase tracking-[0.16em] text-[12px]">
                Listing Momentum Board
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="h-2 w-2 rounded-full bg-sky-400/70" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {momentumTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="ds-panel rounded-[10px] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="ds-footnote text-white/80 text-[13px] truncate mr-2">{tile.title}</p>
                    <span className="ds-pill ds-pill-cyan text-[11px] px-2 py-0.5 font-medium">
                      {tile.trend}
                    </span>
                  </div>

                  <div className="h-20 flex items-end gap-1.5">
                    {tile.bars.map((value, idx) => (
                      <div
                        key={`${tile.title}-${idx}`}
                        className="flex-1 rounded-t bg-gradient-to-t from-cyan-600/30 to-cyan-400/70 transition-all duration-300"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {!loading && momentumTiles.length === 0 && (
                <div className="sm:col-span-2 ds-panel rounded-[10px] p-4">
                  <p className="ds-footnote">
                    No listing momentum yet. Publish active listings to start
                    seeing bid trends.
                  </p>
                </div>
              )}
            </div>

            {/* Queue Health */}
            <div className="mt-5 ds-panel rounded-[10px] p-4 md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="ds-small uppercase tracking-[0.14em] text-cyan-300/70 text-[11px]">
                    Queue Health
                  </p>
                  <p className="mt-1 ds-footnote text-white/80">{queueHealth}</p>
                  <div className="mt-2.5 inline-flex items-baseline gap-2 ds-pill ds-pill-cyan rounded-lg px-2.5 py-1.5">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-cyan-300/60">
                      Avg Premium
                    </span>
                    <span className="text-[15px] font-semibold text-cyan-100">
                      {avgPremiumText}
                    </span>
                  </div>
                  <p className="mt-2 ds-small">
                    {compactContext}
                  </p>
                </div>

                <div className="shrink-0 ds-panel rounded-[10px] px-4 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-cyan-300/60">
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
