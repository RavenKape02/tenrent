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
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto" />
          <p className="mt-4 ds-footnote">Loading...</p>
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
      <main className="space-y-6">
        {/* Welcome */}
        <section className="ds-card-lg p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="ds-pill ds-pill-cyan inline-flex px-3 py-1 rounded-full mb-3 text-[11px] uppercase tracking-[0.14em]">
                Landlord Dashboard
              </p>
              <h1 className="ds-h4 mb-1">
                Welcome back, {user.first_name}
              </h1>
              <p className="ds-body">
                Manage your listings, monitor bidding activity, and optimize
                portfolio performance.
              </p>
            </div>
            <Link
              href="/landlord/listings/new"
              className="ds-btn ds-btn-accent h-11 px-5 text-[14px] rounded-[10px] shrink-0"
            >
              <span>+</span> Create New Listing
            </Link>
          </div>
        </section>

        {/* Stripe Connect */}
        {(!connectStatus?.account_id ||
          !connectStatus.charges_enabled ||
          !connectStatus.payouts_enabled) && (
          <div className="ds-card-lg p-5 border-amber-400/20">
            <p className="ds-footnote font-semibold text-amber-200">
              Connect Stripe to receive winning bid payouts.
            </p>

            {isTestMode ? (
              <>
                <p className="mt-1 ds-small text-amber-100/80">
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
                    className="ds-input flex-1"
                  />
                  <button
                    type="submit"
                    disabled={savingManualAccount || !manualAccountId.trim()}
                    className="ds-btn h-10 px-4 text-[13px] rounded-lg bg-amber-500 text-white border-none hover:bg-amber-400 disabled:opacity-50"
                  >
                    {savingManualAccount ? "Saving..." : "Save Account ID"}
                  </button>
                </form>
                {!connectLoading && connectStatus?.account_id && (
                  <p className="mt-2 ds-small text-amber-100/80">
                    Current Account: {connectStatus.account_id}
                  </p>
                )}
                {stripeMessage && (
                  <p className="mt-2 ds-small text-amber-200">{stripeMessage}</p>
                )}
              </>
            ) : (
              <>
                <p className="mt-1 ds-small text-amber-100/80">
                  Complete Stripe onboarding so charges and payouts are enabled
                  for your landlord account.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleStartConnect}
                    disabled={connectStarting}
                    className="ds-btn h-10 px-4 text-[13px] rounded-lg bg-amber-500 text-white border-none hover:bg-amber-400 disabled:opacity-50"
                  >
                    {connectStarting ? "Redirecting..." : "Connect Stripe"}
                  </button>
                  {!connectLoading && connectStatus?.account_id && (
                    <span className="ds-small text-amber-100/80">
                      Account: {connectStatus.account_id} · details submitted:{" "}
                      {connectStatus.details_submitted ? "yes" : "no"}
                    </span>
                  )}
                </div>
                {stripeMessage && (
                  <p className="mt-2 ds-small text-amber-200">{stripeMessage}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Charts */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Momentum chart */}
          <div className="xl:col-span-8 ds-card-lg p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="ds-caption text-cyan-300/70 uppercase tracking-[0.14em] text-[11px]">
                  Listing Momentum
                </p>
                <h3 className="mt-1 ds-headline">
                  Are you publishing consistently?
                </h3>
              </div>
              <span className="ds-pill ds-pill-cyan text-[11px]">
                Last 12 days
              </span>
            </div>

            <div className="ds-panel rounded-[10px] p-4">
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
                    <stop offset="0%" stopColor="rgb(34 211 238 / 0.30)" />
                    <stop offset="100%" stopColor="rgb(14 116 144 / 0.03)" />
                  </linearGradient>
                </defs>
                {listingMomentumChart.gridLines.map((y, index) => (
                  <line
                    key={index}
                    x1="0"
                    y1={y}
                    x2={listingMomentumChart.width}
                    y2={y}
                    stroke="rgb(148 163 184 / 0.12)"
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="ds-small">New in window</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {listingMomentum.recentTotal}
                  </p>
                </div>
                <div>
                  <p className="ds-small">Peak day</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {listingMomentum.peak} on {listingMomentum.peakLabel}
                  </p>
                </div>
                <div>
                  <p className="ds-small">Total bids</p>
                  <p className="mt-1 text-lg font-semibold text-cyan-300">
                    {totalBidsAcrossPortfolio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio mix */}
          <div className="xl:col-span-4 ds-card-lg p-6">
            <p className="ds-caption text-cyan-300/70 uppercase tracking-[0.14em] text-[11px]">
              Portfolio Mix
            </p>
            <h3 className="mt-1 ds-headline">Status Distribution</h3>

            <div className="mt-5 flex items-center gap-4">
              <div
                className="relative h-28 w-28 rounded-full"
                style={{
                  background: `conic-gradient(rgb(34 211 238) ${activeShare}%, rgb(255 255 255 / 0.06) ${activeShare}% 100%)`,
                }}
              >
                <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#0b1320]">
                  <p className="text-2xl font-bold text-white">
                    {activeShare}%
                  </p>
                  <p className="ds-small text-[10px] uppercase tracking-wider">
                    active
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="ds-footnote">
                  <span className="font-semibold text-cyan-300">{activeCount}</span> active
                </p>
                <p className="ds-footnote">
                  <span className="font-semibold text-amber-300">{draftCount}</span> drafts
                </p>
                <p className="ds-footnote">
                  <span className="font-semibold text-blue-300">{closedCount}</span> closed
                </p>
                <p className="ds-footnote">
                  <span className="font-semibold text-emerald-300">{completedCount}</span> completed
                </p>
              </div>
            </div>

            <div className="mt-6 ds-panel rounded-[10px] px-4 py-3">
              <p className="ds-small uppercase tracking-[0.12em] text-cyan-300/60 text-[10px]">
                Snapshot
              </p>
              <p className="mt-1 ds-footnote text-cyan-100">
                Highest current premium:{" "}
                {highestBidPremium > 0
                  ? `+${formatCents(highestBidPremium)}`
                  : "No active premiums yet"}
              </p>
            </div>
          </div>
        </section>

        {/* Listings table */}
        <div className="ds-card-lg overflow-hidden">
          <div className="border-b border-white/8">
            <nav className="flex overflow-x-auto -mb-px px-3">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-5 py-4 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === tab.value
                      ? "border-cyan-400 text-cyan-300"
                      : "border-transparent text-white/40 hover:text-white/70 hover:border-white/15"
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
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 ds-panel rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="ds-headline mb-2">
                  {activeTab === "all"
                    ? "No listings yet"
                    : `No ${activeTab} listings`}
                </h3>
                <p className="ds-body mb-6">
                  {activeTab === "all" || activeTab === "draft"
                    ? "Create your first listing to start receiving bids."
                    : `You don't have any listings with status "${activeTab}".`}
                </p>
                {(activeTab === "all" || activeTab === "draft") && (
                  <Link
                    href="/landlord/listings/new"
                    className="ds-btn ds-btn-accent h-10 px-5 text-[14px] rounded-[10px]"
                  >
                    + Create Listing
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((listing) => (
                  <div key={listing.id} className="flex flex-col">
                    <ListingCard listing={listing} compact={false} asLandlord />
                    <p className="mt-2 ds-small">
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
                        className="ds-footnote text-cyan-300 font-medium hover:text-cyan-200 transition-colors"
                      >
                        Edit / Bids
                      </Link>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="ds-footnote text-white/50 font-medium hover:text-white transition-colors"
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
