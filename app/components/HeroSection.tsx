import Image from "next/image";
import Link from "next/link";

const heroPoolImage = "/hero1.jpg";
const heroArchImage1 = "/hero2.jpg";
const heroArchImage2 = "/hero3.jpg";
const heroArchImage3 = "/hero4.jpg";

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 py-16 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative z-10 ds-fade-in">
          {/* Badge */}
          <div className="ds-pill ds-pill-cyan mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[12px] uppercase tracking-[0.16em] font-medium">
              Live Bid Marketplace
            </span>
          </div>

          {/* Heading */}
          <h1 className="ds-h1 text-white leading-[0.95] mb-7">
            Secure Your Next
            <br />
            Home Before It
            <br />
            Hits The Crowd
          </h1>

          {/* Subtitle */}
          <p className="ds-body max-w-md mb-10">
            TenRent lets renters and landlords meet in a transparent premium
            auction flow, where speed and trust decide the best match.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/listings"
              className="ds-btn ds-btn-primary h-12 px-6 text-[15px] rounded-[10px]"
            >
              <span>Browse Properties</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              className="ds-btn ds-btn-ghost h-12 px-6 text-[15px] rounded-[10px]"
            >
              List Your Property
            </Link>
          </div>
        </div>

        {/* Image Grid */}
        <div className="hidden lg:block relative">
          {/* Decorative glass panel */}
          <div
            className="absolute -top-8 right-0 w-[400px] h-[250px] rounded-[10px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          />

          <div className="relative mt-32 grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-3">
              <div className="flex gap-3">
                <div className="w-32 h-24 rounded-[10px] overflow-hidden border border-white/10">
                  <Image
                    src={heroArchImage2}
                    alt="Property"
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-[10px] overflow-hidden border border-white/10">
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
                <div className="w-32 h-32 rounded-[10px] overflow-hidden border border-white/10">
                  <Image
                    src={heroArchImage1}
                    alt="Property"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-[10px] overflow-hidden border border-white/10">
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
            <div className="relative rounded-[10px] overflow-hidden h-64 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <Image
                src={heroPoolImage}
                alt="Pool Property"
                width={200}
                height={256}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <p className="text-white text-center text-lg font-semibold leading-tight tracking-[-0.02em]">
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
