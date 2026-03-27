"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  authAPI,
  listingsAPI,
  type StripeConnectStatusResponse,
  type ListingRead,
  type ListingStatus,
  type ListingSummary,
} from "../lib/api";
import ListingCard from "../components/ListingCard";
import { ListingsShell } from "../listings/components/ListingsChrome";

const TABS: { value: ListingStatus | "all"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "bidding_closed", label: "Bidding Closed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

export default function LandlordDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingRead[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ListingStatus | "all">("active");
  const [summaries, setSummaries] = useState<Record<string, ListingSummary>>(
    {},
  );
  const [connectStatus, setConnectStatus] =
    useState<StripeConnectStatusResponse | null>(null);
  const [connectLoading, setConnectLoading] = useState(true);
  const [connectStarting, setConnectStarting] = useState(false);
  const [stripeMessage, setStripeMessage] = useState<string | null>(null);

  const isTestMode = process.env.NEXT_PUBLIC_STRIPE_TEST_MODE === "true";
  const [manualAccountId, setManualAccountId] = useState("");
  const [savingManualAccount, setSavingManualAccount] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
    else if (!loading && user && user.user_type !== "landlord")
      router.push("/renter");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setFetchLoading(true);
    listingsAPI
      .list({ limit: 100 })
      .then((data) => {
        setListings(data.filter((l) => l.landlord_id === user.id));
      })
      .catch(() => setListings([]))
      .finally(() => setFetchLoading(false));
  }, [user?.id]);

  useEffect(() => {
    const loadSummaries = async () => {
      if (!listings.length) return;
      try {
        const results = await Promise.all(
          listings.map(async (l) => {
            try {
              const summary = await listingsAPI.getSummary(l.id);
              return [l.id, summary] as const;
            } catch {
              return [l.id, null] as const;
            }
          }),
        );
        setSummaries((prev) => {
          const next = { ...prev };
          for (const [id, summary] of results) {
            if (summary) next[id] = summary;
          }
          return next;
        });
      } catch {
        // ignore summary errors
      }
    };
    loadSummaries();
  }, [listings]);

  useEffect(() => {
    if (!user || user.user_type !== "landlord") return;
    setConnectLoading(true);
    authAPI
      .getStripeConnectStatus()
      .then(setConnectStatus)
      .catch(() => setConnectStatus(null))
      .finally(() => setConnectLoading(false));
  }, [user?.id, user?.user_type]);

  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? listings
        : listings.filter((l) => l.status === activeTab),
    [activeTab, listings],
  );
  const activeCount = useMemo(
    () => listings.filter((l) => l.status === "active").length,
    [listings],
  );
  const draftCount = useMemo(
    () => listings.filter((l) => l.status === "draft").length,
    [listings],
  );
  const closedCount = useMemo(
    () => listings.filter((l) => l.status === "bidding_closed").length,
    [listings],
  );
  const completedCount = useMemo(
    () => listings.filter((l) => l.status === "completed").length,
    [listings],
  );
  const totalCount = listings.length;
  const activeShare = useMemo(
    () => (totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0),
    [activeCount, totalCount],
  );

  const listingMomentum = useMemo(() => {
    const dayCount = 12;
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

    for (const listing of listings) {
      const createdAt = new Date(listing.created_at);
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

    return {
      counts,
      labels,
      recentTotal,
      peak,
      peakLabel: peakIndex >= 0 ? labels[peakIndex] : "-",
    };
  }, [listings]);

  const listingMomentumChart = useMemo(() => {
    const width = 560;
    const height = 150;
    const padding = 14;
    const maxValue = Math.max(...listingMomentum.counts, 1);
    const step =
      listingMomentum.counts.length > 1
        ? (width - padding * 2) / (listingMomentum.counts.length - 1)
        : 0;

    const points = listingMomentum.counts.map((value, index) => {
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
  }, [listingMomentum.counts]);

  const totalBidsAcrossPortfolio = useMemo(
    () =>
      Object.values(summaries).reduce(
        (sum, summary) => sum + (summary?.total_bids ?? 0),
        0,
      ),
    [summaries],
  );

  const highestBidPremium = useMemo(
    () =>
      Object.values(summaries).reduce(
        (max, summary) => Math.max(max, summary?.highest_bid ?? 0),
        0,
      ),
    [summaries],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05090f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300 mx-auto" />
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.user_type !== "landlord") {
    return null;
  }

  const formatCents = (cents: number) => `$${(cents / 100).toLocaleString()}`;

  const handleStartConnect = async () => {
    setConnectStarting(true);
    setStripeMessage(null);
    try {
      const res = await authAPI.beginStripeConnectOnboarding();
      window.location.href = res.url;
    } catch (err) {
      setStripeMessage(
        err instanceof Error
          ? err.message
          : "Failed to start Stripe onboarding",
      );
    } finally {
      setConnectStarting(false);
    }
  };

  const handleManualAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAccountId.trim()) return;
    setSavingManualAccount(true);
    setStripeMessage(null);
    try {
      await authAPI.setStripeAccount(manualAccountId.trim());
      setStripeMessage("Stripe account ID saved successfully");
      setManualAccountId("");
      const status = await authAPI.getStripeConnectStatus();
      setConnectStatus(status);
    } catch (err) {
      setStripeMessage(
        err instanceof Error ? err.message : "Failed to save account ID",
      );
    } finally {
      setSavingManualAccount(false);
    }
  };

  return (
    <ListingsShell>
      <main className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-[#0b1320]/85 p-6 md:p-8 shadow-[0_20px_70px_rgba(2,6,23,0.45)] backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/80">
                Landlord Dashboard
              </p>
              <h1 className="mb-1 text-3xl font-bold text-white">
                Welcome back, {user.first_name}
              </h1>
              <p className="text-slate-300">
                Manage your listings, monitor bidding activity, and optimize
                portfolio performance.
              </p>
            </div>
            <Link
              href="/landlord/listings/new"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-600 px-5 py-3 font-semibold text-white transition-all hover:from-pink-400 hover:to-rose-500 shadow-[0_10px_28px_rgba(236,72,153,0.35)] shrink-0"
            >
              <span>+</span> Create New Listing
            </Link>
          </div>
        </section>

        {(!connectStatus?.account_id ||
          !connectStatus.charges_enabled ||
          !connectStatus.payouts_enabled) && (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-amber-200">
              Connect Stripe to receive winning bid payouts.
            </p>

            {isTestMode ? (
              <>
                <p className="mt-1 text-sm text-amber-100/90">
                  <strong>Test Mode:</strong> Manually enter a Stripe connected
                  account ID to start testing immediately.
                </p>
                <form
                  onSubmit={handleManualAccountSubmit}
                  className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <input
                    type="text"
                    value={manualAccountId}
                    onChange={(e) => setManualAccountId(e.target.value)}
                    placeholder="acct_..."
                    className="flex-1 rounded-lg border border-amber-300/40 bg-[#0b1320]/70 px-3 py-2 text-sm text-amber-100 placeholder:text-amber-200/50 focus:border-amber-300/70 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={savingManualAccount || !manualAccountId.trim()}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
                  >
                    {savingManualAccount ? "Saving..." : "Save Account ID"}
                  </button>
                </form>
                {!connectLoading && connectStatus?.account_id && (
                  <p className="mt-2 text-xs text-amber-100/90">
                    Current Account: {connectStatus.account_id}
                  </p>
                )}
                {stripeMessage && (
                  <p className="mt-2 text-xs text-amber-200">{stripeMessage}</p>
                )}
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-amber-100/90">
                  Complete Stripe onboarding so charges and payouts are enabled
                  for your landlord account.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleStartConnect}
                    disabled={connectStarting}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
                  >
                    {connectStarting ? "Redirecting..." : "Connect Stripe"}
                  </button>
                  {!connectLoading && connectStatus?.account_id && (
                    <span className="text-xs text-amber-100/90">
                      Account: {connectStatus.account_id} · details submitted:{" "}
                      {connectStatus.details_submitted ? "yes" : "no"}
                    </span>
                  )}
                </div>
                {stripeMessage && (
                  <p className="mt-2 text-xs text-amber-200">{stripeMessage}</p>
                )}
              </>
            )}
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8 rounded-2xl border border-white/10 bg-[#0b1320]/85 p-6 shadow-[0_12px_50px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
                  Listing Momentum
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Are you publishing consistently?
                </h3>
              </div>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
                Last 12 days
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#08101b] p-4">
              <svg
                viewBox={`0 0 ${listingMomentumChart.width} ${listingMomentumChart.height}`}
                className="h-32 w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="landlordMomentumFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="rgb(34 211 238 / 0.35)" />
                    <stop offset="100%" stopColor="rgb(14 116 144 / 0.05)" />
                  </linearGradient>
                </defs>
                {listingMomentumChart.gridLines.map((y, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={listingMomentumChart.width}
                    y2={y}
                    stroke="rgb(148 163 184 / 0.2)"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={listingMomentumChart.areaPath}
                  fill="url(#landlordMomentumFill)"
                />
                <polyline
                  points={listingMomentumChart.linePath}
                  fill="none"
                  stroke="rgb(103 232 249)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">New in window</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {listingMomentum.recentTotal}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Peak day</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {listingMomentum.peak} on {listingMomentum.peakLabel}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Total bids</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-200">
                    {totalBidsAcrossPortfolio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 rounded-2xl border border-white/10 bg-[#0b1320]/85 p-6 shadow-[0_12px_50px_rgba(2,6,23,0.45)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
              Portfolio Mix
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Status Distribution
            </h3>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background: `conic-gradient(rgb(34 211 238) ${activeShare}%, rgb(71 85 105 / 0.45) ${activeShare}% 100%)`,
                }}
              >
                <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#0b1320]">
                  <p className="text-2xl font-bold text-white">
                    {activeShare}%
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-300">
                    active
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-semibold text-cyan-200">
                    {activeCount}
                  </span>{" "}
                  active
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-amber-200">
                    {draftCount}
                  </span>{" "}
                  drafts
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-blue-200">
                    {closedCount}
                  </span>{" "}
                  closed
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-emerald-200">
                    {completedCount}
                  </span>{" "}
                  completed
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-cyan-300/20 bg-cyan-500/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-cyan-200/80">
                Snapshot
              </p>
              <p className="mt-1 text-sm text-cyan-100">
                Highest current premium:{" "}
                {highestBidPremium > 0
                  ? `+${formatCents(highestBidPremium)}`
                  : "No active premiums yet"}
              </p>
            </div>
          </div>
        </section>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1320]/85 shadow-[0_12px_50px_rgba(2,6,23,0.5)] backdrop-blur-sm">
          <div className="border-b border-white/10">
            <nav className="flex overflow-x-auto -mb-px px-3">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? "border-cyan-300 text-cyan-300"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {fetchLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-400/25 border-t-cyan-300" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {activeTab === "all"
                    ? "No listings yet"
                    : `No ${activeTab} listings`}
                </h3>
                <p className="text-slate-300 mb-6">
                  {activeTab === "all" || activeTab === "draft"
                    ? "Create your first listing to start receiving bids."
                    : `You don't have any listings with status "${activeTab}".`}
                </p>
                {(activeTab === "all" || activeTab === "draft") && (
                  <Link
                    href="/landlord/listings/new"
                    className="inline-block rounded-lg bg-linear-to-r from-pink-500 to-rose-600 px-6 py-3 font-semibold text-white hover:from-pink-400 hover:to-rose-500 transition-all"
                  >
                    + Create Listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((listing) => (
                  <div key={listing.id} className="flex flex-col">
                    <ListingCard listing={listing} compact={false} asLandlord />
                    <p className="mt-2 text-xs text-slate-300">
                      {summaries[listing.id]
                        ? `${summaries[listing.id].total_bids} bid${summaries[listing.id].total_bids === 1 ? "" : "s"}${
                            summaries[listing.id].highest_bid
                              ? ` · High: +${formatCents(summaries[listing.id].highest_bid!)}`
                              : ""
                          }`
                        : "Loading bid summary..."}
                    </p>
                    <div className="mt-2 flex gap-3">
                      <Link
                        href={`/landlord/listings/${listing.id}/edit`}
                        className="text-sm text-cyan-300 font-medium hover:text-cyan-200"
                      >
                        Edit / Bids
                      </Link>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-sm text-slate-300 font-medium hover:text-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </ListingsShell>
  );
}
