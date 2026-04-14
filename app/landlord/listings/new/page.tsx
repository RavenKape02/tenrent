"use client";

import Image from "next/image";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Home,
  DollarSign,
  Camera,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Clock,
  ImagePlus,
  Bed,
  Bath,
  Ruler,
  CalendarDays,
  Gavel,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  listingsAPI,
  type ListingCreatePayload,
  type ListingStatus,
} from "../../../lib/api";
import { ListingsShell } from "../../../listings/components/ListingsChrome";
import { UsCityStatePickers } from "../../../components/UsCityStatePickers";

/* ────────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────────── */

const STEPS = [
  { label: "Location", icon: MapPin },
  { label: "Details", icon: Home },
  { label: "Pricing", icon: DollarSign },
  { label: "Photos & Review", icon: Camera },
] as const;

const STATUS_OPTIONS: { value: ListingStatus; label: string; desc: string }[] =
  [
    { value: "draft", label: "Draft", desc: "Save and publish later" },
    {
      value: "active",
      label: "Active",
      desc: "Publish immediately and start receiving bids",
    },
  ];

const BEDROOM_PRESETS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

const BATHROOM_PRESETS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];

const DESC_SOFT_LIMIT = 1000;

const STEP_FIELDS: Record<number, string[]> = {
  0: ["address_line_1", "city", "state", "zip_code"],
  1: ["bedrooms", "bathrooms", "available_date"],
  2: ["monthly_rent", "minimum_bid", "bidding_start", "bidding_end"],
  3: [],
};

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toDatetimeStr(d: Date) {
  return `${toDateStr(d)}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function calcBiddingDuration(start: string, end: string): string | null {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (isNaN(ms) || ms <= 0) return null;
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const parts: string[] = [];
  if (d) parts.push(`${d} day${d !== 1 ? "s" : ""}`);
  if (h) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
  return parts.join(", ") || "Less than an hour";
}

const fadeIn = (delayMs = 0) =>
  ({
    animation: `ds-fade-in 0.4s ease-out ${delayMs}ms backwards`,
  }) as React.CSSProperties;

/* ────────────────────────────────────────────────────────────────
   Micro-components
   ──────────────────────────────────────────────────────────────── */

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] uppercase tracking-[0.14em] text-cyan-300/70 font-medium mb-3 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-[12px] text-red-400">{msg}</p>;
}

function PillSelector({
  presets,
  value,
  onChange,
  customLabel,
  customMin,
  customStep = 1,
  error,
}: {
  presets: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  customLabel: string;
  customMin: number;
  customStep?: number;
  error?: string;
}) {
  const isPreset = presets.some((p) => p.value === value);
  const [showCustom, setShowCustom] = useState(!isPreset && value !== "");

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => {
              onChange(p.value);
              setShowCustom(false);
            }}
            className={[
              "h-9 min-w-[44px] px-3.5 rounded-full text-[13px] font-medium transition-all duration-200 border cursor-pointer",
              value === p.value && !showCustom
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setShowCustom(true);
            if (!value || parseFloat(value) < customMin)
              onChange(String(customMin));
          }}
          className={[
            "h-9 min-w-[44px] px-3.5 rounded-full text-[13px] font-medium transition-all duration-200 border cursor-pointer",
            showCustom
              ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
              : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80",
          ].join(" ")}
        >
          {customLabel}
        </button>
      </div>

      {showCustom && (
        <input
          type="number"
          min={customMin}
          step={customStep}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ds-input w-24 h-9 text-center"
          placeholder={`${customMin}+`}
          autoFocus
        />
      )}

      <FieldError msg={error} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main page
   ──────────────────────────────────────────────────────────────── */

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  /* ── Wizard state ────────────────────────────────────────────── */
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  /* ── Form fields ─────────────────────────────────────────────── */
  const [address_line_1, setAddress_line_1] = useState("");
  const [address_line_2, setAddress_line_2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip_code, setZip_code] = useState("");
  const [monthly_rent, setMonthly_rent] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [square_feet, setSquare_feet] = useState("");
  const [description, setDescription] = useState("");
  const [available_date, setAvailable_date] = useState("");
  const [bidding_start, setBidding_start] = useState("");
  const [bidding_end, setBidding_end] = useState("");
  const [minimum_bid, setMinimum_bid] = useState("");
  const [status, setStatus] = useState<ListingStatus>("draft");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);

  /* ── Smart defaults ──────────────────────────────────────────── */
  useEffect(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    const weekLater = new Date(nextHour.getTime() + 7 * 86_400_000);
    setAvailable_date(toDateStr(now));
    setBidding_start(toDatetimeStr(nextHour));
    setBidding_end(toDatetimeStr(weekLater));
  }, []);

  /* ── Photo preview URLs ──────────────────────────────────────── */
  useEffect(() => {
    const urls = selectedPhotos.map((f) => URL.createObjectURL(f));
    setPhotoPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [selectedPhotos]);

  /* ── Derived data ────────────────────────────────────────────── */
  const duration = useMemo(
    () => calcBiddingDuration(bidding_start, bidding_end),
    [bidding_start, bidding_end],
  );

  const allErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!address_line_1.trim()) e.address_line_1 = "Required";
    if (!city.trim()) e.city = "Required";
    if (!state.trim()) e.state = "Required";
    if (!zip_code.trim()) e.zip_code = "Required";
    if (bedrooms === "") e.bedrooms = "Select bedrooms";
    if (bathrooms === "") e.bathrooms = "Select bathrooms";
    if (!available_date) e.available_date = "Required";
    const rent = parseFloat(monthly_rent);
    if (!monthly_rent || isNaN(rent) || rent <= 0)
      e.monthly_rent = "Enter a valid amount";
    const bid = parseFloat(minimum_bid);
    if (!minimum_bid || isNaN(bid) || bid <= 0)
      e.minimum_bid = "Enter a valid amount";
    if (!bidding_start) e.bidding_start = "Required";
    if (!bidding_end) e.bidding_end = "Required";
    else if (bidding_start && new Date(bidding_end) <= new Date(bidding_start))
      e.bidding_end = "Must be after start date";
    return e;
  }, [
    address_line_1,
    city,
    state,
    zip_code,
    bedrooms,
    bathrooms,
    available_date,
    monthly_rent,
    minimum_bid,
    bidding_start,
    bidding_end,
  ]);

  const stepValid = (idx: number) =>
    (STEP_FIELDS[idx] || []).every((f) => !allErrors[f]);

  const showErr = (field: string) =>
    touched.has(field) ? allErrors[field] : undefined;

  const errStyle = (field: string): React.CSSProperties | undefined =>
    showErr(field) ? { borderColor: "rgba(248, 113, 113, 0.5)" } : undefined;

  const completedFields = [
    address_line_1,
    city,
    state,
    zip_code,
    bedrooms,
    bathrooms,
    monthly_rent,
    minimum_bid,
  ].filter(Boolean).length;
  const completionPct = Math.round((completedFields / 8) * 100);

  /* ── Touch helpers ───────────────────────────────────────────── */
  const touch = (field: string) =>
    setTouched((prev) => new Set(prev).add(field));

  const touchStep = (idx: number) =>
    setTouched((prev) => {
      const next = new Set(prev);
      (STEP_FIELDS[idx] || []).forEach((f) => next.add(f));
      return next;
    });

  /* ── Navigation ──────────────────────────────────────────────── */
  const goNext = () => {
    touchStep(step);
    if (!stepValid(step)) {
      setError("Please fill in all required fields before continuing.");
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Photo handlers ──────────────────────────────────────────── */
  const addPhotos = useCallback((files: File[]) => {
    setSelectedPhotos((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 10) {
        setError("Maximum 10 photos allowed. Remove some first.");
        return prev;
      }
      setError(null);
      return combined;
    });
  }, []);

  const removePhoto = useCallback((idx: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handlePhotoInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) addPhotos(files);
      e.target.value = "";
    },
    [addPhotos],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length) addPhotos(files);
    },
    [addPhotos],
  );

  /* ── Submit ──────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      if (!stepValid(i)) {
        setStep(i);
        touchStep(i);
        setError("Please fix all errors before submitting.");
        return;
      }
    }
    setError(null);
    const rentCents = Math.round(parseFloat(monthly_rent) * 100);
    const minBidCents = Math.round(parseFloat(minimum_bid) * 100);

    const payload: ListingCreatePayload = {
      address_line_1: address_line_1.trim(),
      address_line_2: address_line_2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      zip_code: zip_code.trim(),
      monthly_rent: rentCents,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseFloat(bathrooms) || 0,
      square_feet: square_feet.trim() ? parseInt(square_feet, 10) : undefined,
      description: description.trim() || undefined,
      available_date: available_date || new Date().toISOString().slice(0, 10),
      bidding_start: bidding_start
        ? new Date(bidding_start).toISOString()
        : new Date().toISOString(),
      bidding_end: bidding_end
        ? new Date(bidding_end).toISOString()
        : new Date(Date.now() + 7 * 86_400_000).toISOString(),
      minimum_bid: minBidCents,
      status,
    };

    setSubmitting(true);
    try {
      const created = await listingsAPI.create(payload);
      if (selectedPhotos.length > 0) {
        try {
          const photoFiles = [...selectedPhotos];
          await listingsAPI.uploadPhotos(created.id, photoFiles);
        } catch {
          router.push(`/listings/${created.id}?upload=failed`);
          return;
        }
      }
      router.push(`/listings/${created.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Auth guard ──────────────────────────────────────────────── */
  if (!user || user.user_type !== "landlord") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <p className="ds-body">Only landlords can create listings.</p>
        <Link
          href="/landlord"
          className="ml-2 ds-footnote text-cyan-300 font-medium"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────────────
     Render
     ──────────────────────────────────────────────────────────────── */

  return (
    <ListingsShell maxWidthClassName="max-w-3xl">
      {/* Back link */}
      <Link
        href="/landlord"
        className="inline-flex items-center gap-2 ds-footnote text-white/60 hover:text-white transition-colors mb-6"
      >
        <span>←</span> Dashboard
      </Link>

      {/* ── Welcome header ──────────────────────────────────────── */}
      <div className="ds-card-lg p-6 md:p-8 mb-6" style={fadeIn(0)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="ds-pill ds-pill-cyan text-[11px] px-2.5 py-0.5 mb-3 inline-block">
              New Listing
            </span>
            <h1 className="ds-h5">List your property</h1>
            <p className="ds-body mt-1">
              Complete the steps below to create your rental listing.
            </p>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <p className="ds-small text-white/50">{completionPct}% complete</p>
            <div className="mt-1.5 h-1.5 w-28 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 transition-all duration-500 ease-out"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Step progress bar ───────────────────────────────────── */}
      <div className="mb-6" style={fadeIn(80)}>
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const completed = i < step;
            const current = i === step;
            return (
              <Fragment key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (i < step) {
                      setError(null);
                      setStep(i);
                    }
                  }}
                  className={[
                    "flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200",
                    completed ? "cursor-pointer hover:bg-white/5" : "",
                    current ? "bg-white/[0.06]" : "",
                    i > step ? "opacity-40 cursor-default" : "",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      completed
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                        : current
                          ? "bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.4)]"
                          : "bg-white/5 text-white/40 border border-white/10",
                    ].join(" ")}
                  >
                    {completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={[
                      "text-[13px] font-medium hidden sm:block transition-colors duration-200",
                      current ? "text-white" : "text-white/50",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </button>

                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-1 sm:mx-2 h-px bg-white/10 relative overflow-hidden rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-sky-500 transition-all duration-500 ease-out"
                      style={{ width: i < step ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Error banner ────────────────────────────────────────── */}
      {error && (
        <div
          className="ds-pill-red px-4 py-3 rounded-[10px] mb-6 text-[13px] flex items-center gap-2"
          style={fadeIn(0)}
        >
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Step content (key triggers re-mount animation) ──────── */}
      <div key={step} style={fadeIn(0)}>
        {/* ─────────────────── STEP 0 : LOCATION ──────────────── */}
        {step === 0 && (
          <div className="ds-card-lg p-6 md:p-8">
            <SectionLabel>Property Address</SectionLabel>
            <div
              className="ds-panel rounded-[10px] p-5 space-y-4"
              style={fadeIn(60)}
            >
              <div>
                <label className="ds-input-label">Address line 1 *</label>
                <input
                  type="text"
                  required
                  value={address_line_1}
                  onChange={(e) => setAddress_line_1(e.target.value)}
                  onBlur={() => touch("address_line_1")}
                  placeholder="123 Main Street"
                  className="ds-input"
                  style={errStyle("address_line_1")}
                />
                <FieldError msg={showErr("address_line_1")} />
              </div>

              <div>
                <label className="ds-input-label">
                  Address line 2 (unit, apt, etc.)
                </label>
                <input
                  type="text"
                  value={address_line_2}
                  onChange={(e) => setAddress_line_2(e.target.value)}
                  placeholder="Apt 4B"
                  className="ds-input"
                />
              </div>

              <UsCityStatePickers
                city={city}
                stateCode={state}
                onCityChange={(v) => {
                  setCity(v);
                  touch("city");
                }}
                onStateChange={(v) => {
                  setState(v);
                  touch("state");
                }}
              />

              <div>
                <label className="ds-input-label">ZIP code *</label>
                <input
                  type="text"
                  required
                  value={zip_code}
                  onChange={(e) => setZip_code(e.target.value)}
                  onBlur={() => touch("zip_code")}
                  placeholder="10001"
                  className="ds-input max-w-[160px]"
                  style={errStyle("zip_code")}
                />
                <FieldError msg={showErr("zip_code")} />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/[0.08]">
              <Link
                href="/landlord"
                className="ds-btn ds-btn-ghost h-10 px-5 text-[13px] rounded-[10px]"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={goNext}
                className="ds-btn ds-btn-primary h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                Next: Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── STEP 1 : DETAILS ───────────────── */}
        {step === 1 && (
          <div className="ds-card-lg p-6 md:p-8">
            <SectionLabel>Property Specifications</SectionLabel>
            <div
              className="ds-panel rounded-[10px] p-5 space-y-5"
              style={fadeIn(60)}
            >
              {/* Bedrooms */}
              <div>
                <label className="ds-input-label">Bedrooms *</label>
                <PillSelector
                  presets={BEDROOM_PRESETS}
                  value={bedrooms}
                  onChange={(v) => {
                    setBedrooms(v);
                    touch("bedrooms");
                  }}
                  customLabel="5+"
                  customMin={5}
                  customStep={1}
                  error={showErr("bedrooms")}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="ds-input-label">Bathrooms *</label>
                <PillSelector
                  presets={BATHROOM_PRESETS}
                  value={bathrooms}
                  onChange={(v) => {
                    setBathrooms(v);
                    touch("bathrooms");
                  }}
                  customLabel="4+"
                  customMin={4}
                  customStep={0.5}
                  error={showErr("bathrooms")}
                />
              </div>

              {/* Square feet */}
              <div>
                <label className="ds-input-label">Square feet (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={square_feet}
                  onChange={(e) => setSquare_feet(e.target.value)}
                  placeholder="e.g. 850"
                  className="ds-input max-w-[180px]"
                />
              </div>
            </div>

            <SectionLabel className="mt-6">Additional Info</SectionLabel>
            <div
              className="ds-panel rounded-[10px] p-5 space-y-4"
              style={fadeIn(140)}
            >
              {/* Description */}
              <div>
                <label className="ds-input-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="ds-input h-auto py-2.5 align-top"
                  placeholder="Describe the property, amenities, neighborhood, etc."
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-[12px] transition-colors ${
                      description.length > DESC_SOFT_LIMIT
                        ? "text-amber-400"
                        : "text-white/30"
                    }`}
                  >
                    {description.length} / {DESC_SOFT_LIMIT}
                  </span>
                </div>
              </div>

              {/* Available date */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="ds-input-label mb-0">
                    Available date *
                  </label>
                  <span className="ds-pill ds-pill-cyan text-[10px] px-2 py-0">
                    Suggested
                  </span>
                </div>
                <input
                  type="date"
                  required
                  value={available_date}
                  onChange={(e) => setAvailable_date(e.target.value)}
                  onBlur={() => touch("available_date")}
                  className="ds-input max-w-[200px]"
                  style={errStyle("available_date")}
                />
                <FieldError msg={showErr("available_date")} />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={goBack}
                className="ds-btn ds-btn-ghost h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="ds-btn ds-btn-primary h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                Next: Pricing <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── STEP 2 : PRICING ───────────────── */}
        {step === 2 && (
          <div className="ds-card-lg p-6 md:p-8">
            <SectionLabel>Rent & Bidding</SectionLabel>
            <div className="ds-panel rounded-[10px] p-5" style={fadeIn(60)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Monthly rent */}
                <div>
                  <label className="ds-input-label">Monthly rent *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-0 bottom-0 flex items-center text-[14px] text-white/40 pointer-events-none select-none">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={monthly_rent}
                      onChange={(e) => setMonthly_rent(e.target.value)}
                      onBlur={() => touch("monthly_rent")}
                      placeholder="2,500.00"
                      className="ds-input"
                      style={{ paddingLeft: 28, ...errStyle("monthly_rent") }}
                    />
                  </div>
                  <FieldError msg={showErr("monthly_rent")} />
                  {monthly_rent && parseFloat(monthly_rent) > 0 && (
                    <p className="mt-1 text-[12px] text-white/30">
                      $
                      {parseFloat(monthly_rent).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                      /month
                    </p>
                  )}
                </div>

                {/* Minimum bid */}
                <div>
                  <label className="ds-input-label">Minimum bid *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-0 bottom-0 flex items-center text-[14px] text-white/40 pointer-events-none select-none">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={minimum_bid}
                      onChange={(e) => setMinimum_bid(e.target.value)}
                      onBlur={() => touch("minimum_bid")}
                      placeholder="2,000.00"
                      className="ds-input"
                      style={{ paddingLeft: 28, ...errStyle("minimum_bid") }}
                    />
                  </div>
                  <FieldError msg={showErr("minimum_bid")} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 mb-2">
              <SectionLabel className="mb-0">Bidding Window</SectionLabel>
              <span className="ds-pill ds-pill-cyan text-[10px] px-2 py-0">
                Suggested
              </span>
            </div>
            <div
              className="ds-panel rounded-[10px] p-5 space-y-4"
              style={fadeIn(140)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="ds-input-label">Bidding starts *</label>
                  <input
                    type="datetime-local"
                    required
                    value={bidding_start}
                    onChange={(e) => setBidding_start(e.target.value)}
                    onBlur={() => touch("bidding_start")}
                    className="ds-input"
                    style={errStyle("bidding_start")}
                  />
                  <FieldError msg={showErr("bidding_start")} />
                </div>
                <div>
                  <label className="ds-input-label">Bidding ends *</label>
                  <input
                    type="datetime-local"
                    required
                    value={bidding_end}
                    onChange={(e) => setBidding_end(e.target.value)}
                    onBlur={() => touch("bidding_end")}
                    className="ds-input"
                    style={errStyle("bidding_end")}
                  />
                  <FieldError msg={showErr("bidding_end")} />
                </div>
              </div>

              {/* Duration helper */}
              {duration && (
                <div className="flex items-center gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400/60" />
                  <span className="text-[12px] text-cyan-300/60">
                    Bidding window: {duration}
                  </span>
                </div>
              )}

              <p className="text-[12px] text-white/30">
                Default: starts in the next hour and runs for 7 days. Adjust as
                needed.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={goBack}
                className="ds-btn ds-btn-ghost h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="ds-btn ds-btn-primary h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                Next: Photos & Review <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────── STEP 3 : PHOTOS & REVIEW ───────── */}
        {step === 3 && (
          <div className="ds-card-lg p-6 md:p-8 relative">
            {/* Photos */}
            <SectionLabel>Photos</SectionLabel>
            <div className="ds-panel rounded-[10px] p-5" style={fadeIn(60)}>
              {/* Drop zone */}
              <label
                htmlFor="listing-photos"
                className={[
                  "flex flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
                  dragOver
                    ? "border-cyan-400 bg-cyan-500/[0.06]"
                    : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]",
                ].join(" ")}
                onDragEnter={(e) => {
                  e.preventDefault();
                  dragCounter.current++;
                  setDragOver(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => {
                  dragCounter.current--;
                  if (dragCounter.current <= 0) {
                    dragCounter.current = 0;
                    setDragOver(false);
                  }
                }}
                onDrop={handleDrop}
              >
                {dragOver ? (
                  <Upload className="w-8 h-8 text-cyan-400" />
                ) : (
                  <ImagePlus className="w-8 h-8 text-white/30" />
                )}
                <div className="text-center">
                  <p className="text-[14px] font-medium text-white/70">
                    {dragOver
                      ? "Drop your photos here"
                      : "Drag photos here or click to browse"}
                  </p>
                  <p className="ds-small mt-1">
                    JPG, PNG, WEBP &middot; up to 10 files
                  </p>
                </div>
              </label>
              <input
                id="listing-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoInput}
                className="hidden"
              />

              {/* Photo previews */}
              {selectedPhotos.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {photoPreviewUrls.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-[10px] border border-white/10"
                        style={fadeIn(idx * 50)}
                      >
                        <Image
                          src={url}
                          alt={`Photo ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Cover badge */}
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 ds-pill ds-pill-cyan text-[10px] px-2 py-0">
                            Cover
                          </span>
                        )}
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all duration-200"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2.5 ds-small">
                    {selectedPhotos.length} photo
                    {selectedPhotos.length !== 1 ? "s" : ""} selected
                    {selectedPhotos.length < 10 && (
                      <span className="text-white/30">
                        {" "}
                        &middot; {10 - selectedPhotos.length} remaining
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Publish status */}
            <SectionLabel className="mt-6">Publish Settings</SectionLabel>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              style={fadeIn(140)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={[
                    "relative p-4 rounded-[10px] border text-left transition-all duration-200",
                    status === opt.value
                      ? "border-cyan-400/30 bg-cyan-500/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {status === opt.value && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-cyan-300" />
                    </div>
                  )}
                  <p className="text-[14px] font-medium text-white">
                    {opt.label}
                  </p>
                  <p className="text-[12px] text-white/50 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {/* Review preview */}
            <SectionLabel className="mt-6">Review Your Listing</SectionLabel>
            <div
              className="rounded-[12px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] overflow-hidden"
              style={fadeIn(220)}
            >
              {/* ── Hero photo strip ─────────────────────────────── */}
              {photoPreviewUrls.length > 0 ? (
                <div className="flex gap-1 h-40 sm:h-48">
                  {/* Cover photo (large) */}
                  <div className="relative flex-1 min-w-0">
                    <Image
                      src={photoPreviewUrls[0]}
                      alt="Cover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute bottom-2 left-2 ds-pill ds-pill-cyan text-[10px] px-2 py-0.5 backdrop-blur-sm">
                      Cover
                    </span>
                  </div>
                  {/* Side thumbnails (up to 3) */}
                  {photoPreviewUrls.length > 1 && (
                    <div className="flex flex-col gap-1 w-28 sm:w-36 shrink-0">
                      {photoPreviewUrls.slice(1, 4).map((url, i) => (
                        <div
                          key={`review-thumb-${i}`}
                          className="relative flex-1 min-h-0 overflow-hidden"
                        >
                          <Image
                            src={url}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {/* +N overlay on last thumbnail */}
                          {i === 2 && photoPreviewUrls.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-[14px] font-semibold text-white">
                                +{photoPreviewUrls.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Empty-state placeholder */
                <div className="h-28 flex items-center justify-center border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-white/20">
                    <Camera className="w-5 h-5" />
                    <span className="text-[13px]">No photos added</span>
                  </div>
                </div>
              )}

              {/* ── Card body ────────────────────────────────────── */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* ── Address + status row ────────────────────────── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[18px] sm:text-[20px] font-semibold text-white leading-snug tracking-tight truncate">
                      {address_line_1 || "Your property address"}
                    </h3>
                    {(city || state || zip_code) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400/60 shrink-0" />
                        <p className="text-[13px] text-white/50 truncate">
                          {[address_line_2, city, state]
                            .filter(Boolean)
                            .join(", ")}{" "}
                          {zip_code}
                        </p>
                      </div>
                    )}
                  </div>
                  <span
                    className={[
                      "shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                      status === "active"
                        ? "text-emerald-300 bg-emerald-500/10 border-emerald-400/20"
                        : "text-amber-300 bg-amber-500/10 border-amber-400/20",
                    ].join(" ")}
                  >
                    {status === "active" ? "Active" : "Draft"}
                  </span>
                </div>

                {/* ── Price hero ──────────────────────────────────── */}
                {monthly_rent && parseFloat(monthly_rent) > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] sm:text-[32px] font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      $
                      {parseFloat(monthly_rent).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-[14px] text-white/40 font-medium">
                      /month
                    </span>
                  </div>
                ) : (
                  <p className="text-[14px] text-white/25 italic">
                    No rent set
                  </p>
                )}

                {/* ── Specs grid ──────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {bedrooms !== "" && (
                    <div className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                      <Bed className="w-4 h-4 text-cyan-400/60 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-white leading-none">
                          {bedrooms === "0" ? "Studio" : bedrooms}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          {bedrooms === "0"
                            ? ""
                            : `Bed${bedrooms !== "1" ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {bathrooms !== "" && (
                    <div className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                      <Bath className="w-4 h-4 text-cyan-400/60 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-white leading-none">
                          {bathrooms}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          Bath{bathrooms !== "1" ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  )}
                  {square_feet && (
                    <div className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                      <Ruler className="w-4 h-4 text-cyan-400/60 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-white leading-none">
                          {parseInt(square_feet).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          Sq ft
                        </p>
                      </div>
                    </div>
                  )}
                  {available_date && (
                    <div className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                      <CalendarDays className="w-4 h-4 text-cyan-400/60 shrink-0" />
                      <div>
                        <p className="text-[14px] font-medium text-white leading-none">
                          {new Date(available_date + "T00:00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5">
                          Available
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Description ─────────────────────────────────── */}
                {description && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="w-3.5 h-3.5 text-white/30" />
                      <p className="text-[11px] uppercase tracking-[0.12em] text-white/30 font-medium">
                        Description
                      </p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/50 line-clamp-3">
                      {description}
                    </p>
                  </div>
                )}

                {/* ── Bidding details ─────────────────────────────── */}
                <div className="rounded-[8px] bg-white/[0.03] border border-white/[0.06] p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Gavel className="w-3.5 h-3.5 text-cyan-400/50" />
                    <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-300/60 font-medium">
                      Bidding Details
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {minimum_bid && parseFloat(minimum_bid) > 0 && (
                      <div>
                        <p className="text-[11px] text-white/30 mb-0.5">
                          Min. Bid
                        </p>
                        <p className="text-[15px] font-semibold text-white">
                          $
                          {parseFloat(minimum_bid).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    )}
                    {duration && (
                      <div>
                        <p className="text-[11px] text-white/30 mb-0.5">
                          Duration
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          <p className="text-[13px] font-medium text-white/80">
                            {duration}
                          </p>
                        </div>
                      </div>
                    )}
                    {bidding_start && (
                      <div>
                        <p className="text-[11px] text-white/30 mb-0.5">
                          Starts
                        </p>
                        <p className="text-[13px] font-medium text-white/80">
                          {new Date(bidding_start).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation + Submit */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={goBack}
                className="ds-btn ds-btn-ghost h-10 px-5 text-[13px] rounded-[10px] flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="ds-btn ds-btn-accent h-11 px-6 text-[14px] rounded-[10px] disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create Listing"}
              </button>
            </div>

            {/* Submit overlay */}
            {submitting && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[16px] bg-[#0b1320]/90 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                <p className="ds-headline mt-4">Creating your listing...</p>
                <p className="ds-small mt-1 text-white/40">
                  This may take a moment
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ListingsShell>
  );
}
