"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { bidsAPI, type BidRead, type BidStatus } from "../lib/api";

type BidBucket = "active" | "pending" | "won" | "lost";

function bucketStatus(status: BidStatus): BidBucket {
  if (status === "active" || status === "outbid") return "active";
  if (status === "won") return "won";
  if (status === "withdrawn") return "lost";
  if (status === "refunded") return "lost";
  return "lost";
}

export default function RenterDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bids, setBids] = useState<BidRead[]>([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    else if (!loading && user && user.user_type !== "renter")
      router.push("/landlord");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.user_type !== "renter") return;
    setLoadingBids(true);
    bidsAPI
      .getMyBids()
      .then(setBids)
      .catch(() => setBids([]))
      .finally(() => setLoadingBids(false));
  }, [user?.id, user?.user_type]);

  const activeBids = useMemo(
    () => bids.filter((b) => bucketStatus(b.status) === "active"),
    [bids],
  );
  const leadingCount = useMemo(
    () => bids.filter((b) => b.status === "active").length,
    [bids],
  );
  const outbidCount = useMemo(
    () => bids.filter((b) => b.status === "outbid").length,
    [bids],
  );
  const wonCount = useMemo(
    () => bids.filter((b) => b.status === "won").length,
    [bids],
  );
  const contestedCount = useMemo(
    () => leadingCount + outbidCount,
    [leadingCount, outbidCount],
  );
  const leadShare = useMemo(
    () =>
      contestedCount > 0
        ? Math.round((leadingCount / contestedCount) * 100)
        : 0,
    [contestedCount, leadingCount],
  );
  const latestOutbid = useMemo(
    () =>
      bids
        .filter((b) => b.status === "outbid")
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0] ?? null,
    [bids],
  );

  const momentum = useMemo(() => {
    const dayCount = 10;
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(today);
    firstDay.setDate(firstDay.getDate() - (dayCount - 1));

    const dayStarts = Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + index);
      return date;
    });

    const counts = Array.from({ length: dayCount }, () => 0);

    for (const bid of bids) {
      const createdAt = new Date(bid.created_at);
      if (Number.isNaN(createdAt.getTime())) continue;

      createdAt.setHours(0, 0, 0, 0);
      const dayOffset = Math.floor(
        (createdAt.getTime() - dayStarts[0].getTime()) / oneDay,
      );

      if (dayOffset >= 0 && dayOffset < dayCount) {
        counts[dayOffset] += 1;
      }
    }

    const labels = dayStarts.map((date) =>
      date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    );
    const recentTotal = counts.reduce((sum, count) => sum + count, 0);
    const peak = Math.max(...counts, 0);
    const peakIndex = counts.findIndex((count) => count === peak);

    let currentStreak = 0;
    for (let index = counts.length - 1; index >= 0; index -= 1) {
      if (counts[index] > 0) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    return {
      counts,
      labels,
      recentTotal,
      peak,
      peakLabel: peakIndex >= 0 ? labels[peakIndex] : "-",
      currentStreak,
    };
  }, [bids]);

  const momentumChart = useMemo(() => {
    const width = 520;
    const height = 140;
    const padding = 14;
    const maxValue = Math.max(...momentum.counts, 1);
    const step =
      momentum.counts.length > 1
        ? (width - padding * 2) / (momentum.counts.length - 1)
        : 0;

    const points = momentum.counts.map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - (value / maxValue) * (height - padding * 2);
      return { x, y, value };
    });

    const linePath = points.map((point) => `${point.x},${point.y}`).join(" ");
    const areaPath = `M ${points[0].x} ${height - padding} L ${points
      .map((point) => `${point.x} ${point.y}`)
      .join(" L ")} L ${points[points.length - 1].x} ${height - padding} Z`;

    const gridLines = [0.25, 0.5, 0.75].map(
      (ratio) => height - padding - ratio * (height - padding * 2),
    );

    return { width, height, points, linePath, areaPath, gridLines, maxValue };
  }, [momentum.counts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0fa8e2] mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== "renter") {
    return null;
  }

  const handleWithdraw = async (bid: BidRead) => {
    if (bid.status !== "active") return;
    if (!confirm("Withdraw this bid? Your hold will be released if possible."))
      return;
    setWithdrawingId(bid.id);
    try {
      const updated = await bidsAPI.withdraw(bid.id);
      setBids((prev) => prev.map((b) => (b.id === bid.id ? updated : b)));
    } catch (e) {
      // Let backend enforce window/other rules; show generic alert
      alert(e instanceof Error ? e.message : "Unable to withdraw bid");
    } finally {
      setWithdrawingId(null);
    }
  };

  const statusPillClass = (status: BidStatus) => {
    const bucket = bucketStatus(status);
    if (bucket === "active") {
      return "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30";
    }
    if (bucket === "won") {
      return "bg-emerald-400/15 text-emerald-200 border border-emerald-400/30";
    }
    return "bg-slate-700/50 text-slate-200 border border-slate-500/40";
  };

  return (
    <DashboardLayout role="renter">
      <main className="relative max-w-7xl mx-auto px-6 py-8 space-y-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute top-32 -right-20 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        </div>

        <section className="rounded-3xl border border-white/10 bg-[#0b1320]/85 p-6 md:p-8 shadow-[0_20px_70px_rgba(2,6,23,0.45)] backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                Renter Dashboard
              </p>
              <h1 className="mb-1 text-3xl font-bold text-white">
                Welcome back, {user.first_name}
              </h1>
              <p className="text-slate-300">
                Track your active bids, see where you are leading, and jump into
                new listings.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Signed in as: {user.email} · Payment method:{" "}
                {user.stripe_payment_method_id ? "saved" : "not set"}
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_10px_28px_rgba(8,145,178,0.35)]"
            >
              Browse Listings
            </Link>
          </div>
        </section>

        {!user.stripe_payment_method_id && (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-200">
              Add a payment method before placing bids.
            </p>
            <p className="mt-1 text-sm text-amber-100/90">
              Use Stripe secure card entry to save your bidding payment method.
            </p>
            <div className="mt-3">
              <Link
                href="/renter/payment-method"
                className="inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
              >
                Add payment method
              </Link>
            </div>
          </div>
        )}

        {/* Performance Intelligence */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8 rounded-2xl border border-white/10 bg-[#0b1320]/85 p-6 shadow-[0_12px_50px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
                  Bid Momentum
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Are you gaining traction this week?
                </h3>
              </div>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                Last 10 days
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#08101b] p-4">
              <svg
                viewBox={`0 0 ${momentumChart.width} ${momentumChart.height}`}
                className="h-32 w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34 211 238 / 0.35)" />
                    <stop offset="100%" stopColor="rgb(14 116 144 / 0.05)" />
                  </linearGradient>
                </defs>
                {momentumChart.gridLines.map((y, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={momentumChart.width}
                    y2={y}
                    stroke="rgb(148 163 184 / 0.2)"
                    strokeWidth="1"
                  />
                ))}
                <path d={momentumChart.areaPath} fill="url(#momentumFill)" />
                <polyline
                  points={momentumChart.linePath}
                  fill="none"
                  stroke="rgb(103 232 249)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {momentumChart.points.map((point, index) => {
                  const isPeak =
                    point.value === momentumChart.maxValue && point.value > 0;
                  const isLatest = index === momentumChart.points.length - 1;
                  if (!isPeak && !isLatest) return null;
                  return (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={isLatest ? 4 : 3}
                      fill={isLatest ? "rgb(34 211 238)" : "rgb(134 239 172)"}
                    />
                  );
                })}
              </svg>

              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Bids in window</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {momentum.recentTotal}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Peak day</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {momentum.peak} on {momentum.peakLabel}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Current streak</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-200">
                    {momentum.currentStreak} day
                    {momentum.currentStreak === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            {outbidCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-300/25 bg-amber-400/10 px-4 py-3">
                <p className="text-sm text-amber-100">
                  {outbidCount} bid{outbidCount === 1 ? " is" : "s are"}{" "}
                  currently outbid.
                </p>
                {latestOutbid && (
                  <Link
                    href={`/listings/${latestOutbid.listing_id}`}
                    className="text-sm font-semibold text-amber-200 hover:text-amber-100"
                  >
                    Review latest outbid listing
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-white/10 bg-[#0b1320]/85 p-6 shadow-[0_12px_50px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
              Lead Control
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Competitive Position
            </h3>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background: `conic-gradient(rgb(34 211 238) ${leadShare}%, rgb(71 85 105 / 0.45) ${leadShare}% 100%)`,
                }}
              >
                <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#0b1320]">
                  <p className="text-2xl font-bold text-white">{leadShare}%</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-300">
                    leading
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-semibold text-cyan-200">
                    {leadingCount}
                  </span>{" "}
                  leading
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-amber-200">
                    {outbidCount}
                  </span>{" "}
                  outbid
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-emerald-200">
                    {wonCount}
                  </span>{" "}
                  won
                </p>
                <p className="text-slate-400 text-xs">
                  {contestedCount > 0
                    ? `${contestedCount} bids currently contested`
                    : "No active competition yet"}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-cyan-300/20 bg-cyan-500/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-cyan-200/80">
                Next move
              </p>
              <p className="mt-1 text-sm text-cyan-100">
                {outbidCount > 0
                  ? "Prioritize listings where you were recently outbid to regain lead momentum."
                  : "Momentum is stable. Consider expanding to one more listing to increase win odds."}
              </p>
            </div>
          </div>
        </section>

        {/* My Bids */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1320]/85 shadow-[0_12px_50px_rgba(2,6,23,0.5)] backdrop-blur-sm">
          <div className="border-b border-white/10">
            <nav className="flex items-center justify-between px-6 py-4">
              <span className="text-sm font-semibold text-[#0fa8e2]">
                My Bids
              </span>
              <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                {bids.length} total
              </span>
            </nav>
          </div>
          <div className="p-6">
            {loadingBids ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0fa8e2]" />
              </div>
            ) : bids.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg
                    className="h-8 w-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No bids yet
                </h3>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Browse active listings and place a bid to get priority
                  consideration. Your bids will appear here.
                </p>
                <Link
                  href="/listings"
                  className="inline-block rounded-lg bg-linear-to-r from-cyan-500 to-sky-600 px-6 py-3 font-semibold text-white hover:from-cyan-400 hover:to-sky-500 transition-all"
                >
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        Bid: ${(bid.amount / 100).toFixed(2)} / mo premium
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span
                          className={`rounded-full px-2 py-0.5 font-medium ${statusPillClass(bid.status)}`}
                        >
                          {bid.status}
                        </span>
                        <span>
                          Placed {new Date(bid.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Listing ID: {bid.listing_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <Link
                        href={`/listings/${bid.listing_id}`}
                        className="font-medium text-[#0fa8e2] hover:underline"
                      >
                        View listing
                      </Link>
                      {bid.status === "active" && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(bid)}
                          disabled={withdrawingId === bid.id}
                          className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {withdrawingId === bid.id
                            ? "Withdrawing…"
                            : "Withdraw"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
