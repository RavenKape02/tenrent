import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function LandlordCTA() {
  const pulseEvents = [
    "Verified renters entering",
    "Bid spread tightening",
    "Top offer re-ranked",
    "Priority queue updated",
  ];

  const momentumTiles = [
    { title: "Downtown Loft", trend: "+14%", bars: [42, 56, 67, 79, 86] },
    { title: "Riverside 2BR", trend: "+9%", bars: [38, 44, 52, 60, 71] },
    { title: "Uptown Studio", trend: "+11%", bars: [34, 48, 53, 66, 74] },
    { title: "Midtown Penthouse", trend: "+18%", bars: [46, 59, 70, 80, 92] },
  ];

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

            <Link
              href="/signup"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-linear-to-r from-cyan-500 to-sky-600 text-white px-6 py-3 rounded-2xl text-base font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_12px_30px_rgba(8,145,178,0.35)]"
            >
              Open your listing to serious renters
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
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#091323]/85 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">
                  Queue Health
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  Strong buyer intent across top neighborhoods
                </p>
              </div>
              <span className="text-2xl font-semibold text-white">A+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
