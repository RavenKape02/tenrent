import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

const heroPoolImage = "/hero1.jpg";
const heroArchImage1 = "/hero2.jpg";
const heroArchImage2 = "/hero3.jpg";
const heroArchImage3 = "/hero4.jpg";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-7 rounded-full border border-cyan-200/25 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <div className="w-6 h-[1px] bg-cyan-300/70"></div>
            <span className="text-cyan-100/90 text-sm uppercase tracking-[0.18em]">
              Live Bid Marketplace
            </span>
          </div>

          <h1
            className={`${cormorant.className} text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[0.92] mb-7`}
          >
            Secure Your Next
            <br />
            Home Before It
            <br />
            Hits The Crowd
          </h1>

          <p className="max-w-xl text-slate-300 text-base md:text-lg leading-relaxed mb-9">
            TenRent lets renters and landlords meet in a transparent premium
            auction flow, where speed and trust decide the best match.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/listings"
              className="flex items-center justify-center gap-3 bg-linear-to-r from-cyan-500 to-sky-600 text-white rounded-full px-8 py-4 hover:from-cyan-400 hover:to-sky-500 transition-all shadow-[0_12px_35px_rgba(8,145,178,0.4)]"
            >
              <span className="text-lg">Browse Properties</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-3 border border-white/35 bg-white/5 text-white rounded-full px-8 py-4 hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">List Your Property</span>
            </Link>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute -top-8 right-0 w-[400px] h-[250px] bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15" />

          <div className="relative mt-32 grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-3">
              <div className="flex gap-3">
                <div className="w-32 h-24 rounded-xl overflow-hidden border border-white/15">
                  <Image
                    src={heroArchImage2}
                    alt="Property"
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-xl overflow-hidden border border-white/15">
                  <Image
                    src={heroArchImage1}
                    alt="Property"
                    width={160}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/15">
                  <Image
                    src={heroArchImage1}
                    alt="Property"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-xl overflow-hidden border border-white/15">
                  <Image
                    src={heroArchImage3}
                    alt="Property"
                    width={160}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
              <Image
                src={heroPoolImage}
                alt="Pool Property"
                width={200}
                height={256}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className={`${cormorant.className} text-white text-center text-2xl leading-tight`}
                >
                  Make your next move
                  <br />
                  with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
