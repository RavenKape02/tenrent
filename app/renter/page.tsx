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
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto" />
          <p className="mt-4 ds-footnote">Loading...</p>
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
      alert(e instanceof Error ? e.message : "Unable to withdraw bid");
    } finally {
      setWithdrawingId(null);
    }
  };

  const statusPillClass = (status: BidStatus) => {
    const bucket = bucketStatus(status);
    if (bucket === "active") return "ds-pill-cyan";
    if (bucket === "won") return "ds-pill-green";
    return "ds-pill-neutral";
  };

  return (
    <DashboardLayout role="renter">
      <main className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome */}
        <section className="ds-card-lg p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="ds-pill ds-pill-cyan inline-flex px-3 py-1 rounded-full mb-3 text-[11px] uppercase tracking-[0.14em]">
                Renter Dashboard
              </p>
              <h1 className="ds-h4 mb-1">
                Welcome back, {user.first_name}
              </h1>
              <p className="ds-body">
                Track your active bids, see where you are leading, and jump into
                new listings.
              </p>
              <p className="mt-2 ds-small">
                Signed in as: {user.email} · Payment method:{" "}
                {user.stripe_payment_method_id ? "saved" : "not set"}
              </p>
            </div>
            <Link
              href="/listings"
              className="ds-btn ds-btn-primary h-10 px-5 text-[14px] rounded-[10px] shrink-0"
            >
              Browse Listings
            </Link>
          </div>
        </section>

        {/* Payment method warning */}
        {!user.stripe_payment_method_id && (
          <div className="ds-card-lg p-5 border-amber-400/20">
            <p className="ds-footnote font-semibold text-amber-200">
              Add a payment method before placing bids.
            </p>
            <p className="mt-1 ds-small text-amber-100/80">
              Use Stripe secure card entry to save your bidding payment method.
            </p>
            <div className="mt-3">
              <Link
                href="/renter/payment-method"
                className="ds-btn h-9 px-4 text-[13px] rounded-lg bg-amber-500 text-white border-none hover:bg-amber-400"
              >
                Add payment method
              </Link>
            </div>
          </div>
        )}

        {/* Charts */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Momentum chart */}
          <div className="xl:col-span-8 ds-card-lg p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="ds-caption text-cyan-300/70 uppercase tracking-[0.14em] text-[11px]">
                  Bid Momentum
                </p>
                <h3 className="mt-1 ds-headline">
                  Are you gaining traction this week?
                </h3>
              </div>
              <span className="ds-pill ds-pill-cyan text-[11px]">
                Last 10 days
              </span>
            </div>

            <div className="ds-panel rounded-[10px] p-4">
              <svg
                viewBox={`0 0 ${momentumChart.width} ${momentumChart.height}`}
                className="h-32 w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34 211 238 / 0.30)" />
                    <stop offset="100%" stopColor="rgb(14 116 144 / 0.03)" />
                  </linearGradient>
                </defs>
                {momentumChart.gridLines.map((y, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={momentumChart.width}
                    y2={y}
                    stroke="rgb(148 163 184 / 0.12)"
                    strokeWidth="1"
                  />
                ))}
                <path d={momentumChart.areaPath} fill="url(#momentumFill)" />
                <polyline
                  points={momentumChart.linePath}
                  fill="none"
                  stroke="rgb(103 232 249)"
                  strokeWidth="2"
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

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="ds-small">Bids in window</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {momentum.recentTotal}
                  </p>
                </div>
                <div>
                  <p className="ds-small">Peak day</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {momentum.peak} on {momentum.peakLabel}
                  </p>
                </div>
                <div>
                  <p className="ds-small">Current streak</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-300">
                    {momentum.currentStreak} day
                    {momentum.currentStreak === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            {outbidCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 ds-panel rounded-[10px] px-4 py-3 border-amber-400/15">
                <p className="ds-footnote text-amber-200">
                  {outbidCount} bid{outbidCount === 1 ? " is" : "s are"}{" "}
                  currently outbid.
                </p>
                {latestOutbid && (
                  <Link
                    href={`/listings/${latestOutbid.listing_id}`}
                    className="ds-footnote text-amber-300 font-medium hover:text-amber-200 transition-colors"
                  >
                    Review latest outbid listing
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Lead control */}
          <div className="xl:col-span-4 ds-card-lg p-6">
            <p className="ds-caption text-cyan-300/70 uppercase tracking-[0.14em] text-[11px]">
              Lead Control
            </p>
            <h3 className="mt-1 ds-headline">Competitive Position</h3>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background: `conic-gradient(rgb(34 211 238) ${leadShare}%, rgb(255 255 255 / 0.06) ${leadShare}% 100%)`,
                }}
              >
                <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#0b1320]">
                  <p className="text-2xl font-bold text-white">{leadShare}%</p>
                  <p className="ds-small text-[10px] uppercase tracking-wider">
                    leading
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="ds-footnote">
                  <span className="font-semibold text-cyan-300">{leadingCount}</span> leading
                </p>
                <p className="ds-footnote">
                  <span className="font-semibold text-amber-300">{outbidCount}</span> outbid
                </p>
                <p className="ds-footnote">
                  <span className="font-semibold text-emerald-300">{wonCount}</span> won
                </p>
                <p className="ds-small">
                  {contestedCount > 0
                    ? `${contestedCount} bids currently contested`
                    : "No active competition yet"}
                </p>
              </div>
            </div>

            <div className="mt-6 ds-panel rounded-[10px] px-4 py-3">
              <p className="ds-small uppercase tracking-[0.12em] text-cyan-300/60 text-[10px]">
                Next move
              </p>
              <p className="mt-1 ds-footnote text-cyan-100">
                {outbidCount > 0
                  ? "Prioritize listings where you were recently outbid to regain lead momentum."
                  : "Momentum is stable. Consider expanding to one more listing to increase win odds."}
              </p>
            </div>
          </div>
        </section>

        {/* My Bids */}
        <div className="ds-card-lg overflow-hidden">
          <div className="border-b border-white/8">
            <nav className="flex items-center justify-between px-6 py-4">
              <span className="ds-footnote text-cyan-300 font-semibold">
                My Bids
              </span>
              <span className="ds-pill ds-pill-cyan text-[11px]">
                {bids.length} total
              </span>
            </nav>
          </div>
          <div className="p-6">
            {loadingBids ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              </div>
            ) : bids.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ds-panel">
                  <svg
                    className="h-7 w-7 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="ds-headline mb-2">No bids yet</h3>
                <p className="ds-body mb-6 max-w-md mx-auto">
                  Browse active listings and place a bid to get priority
                  consideration. Your bids will appear here.
                </p>
                <Link
                  href="/listings"
                  className="ds-btn ds-btn-primary h-10 px-6 text-[14px] rounded-[10px]"
                >
                  Browse Listings
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex flex-col gap-3 ds-panel rounded-[10px] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="ds-body-medium text-[14px]">
                        Bid: ${(bid.amount / 100).toFixed(2)} / mo premium
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className={`ds-pill ${statusPillClass(bid.status)} text-[11px]`}>
                          {bid.status}
                        </span>
                        <span className="ds-small">
                          Placed {new Date(bid.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 ds-small">
                        Listing ID: {bid.listing_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <Link
                        href={`/listings/${bid.listing_id}`}
                        className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
                      >
                        View listing
                      </Link>
                      {bid.status === "active" && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(bid)}
                          disabled={withdrawingId === bid.id}
                          className="ds-small text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
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
