import Image from "next/image";

const heroPoolImage = "/hero1.jpg";
const heroArchImage1 = "/hero2.jpg";
const heroArchImage2 = "/hero3.jpg";
const heroArchImage3 = "/hero4.jpg";

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-gray-500"></div>
            <span className="text-gray-500 text-lg">Win your dream rental</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
            Bid for Priority Access
            <br />
            to Premium Rentals
            <br />
            Through Transparent Competition
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-3 bg-[#ff214f] text-white rounded-full px-8 py-4 hover:bg-[#e01d45] transition-colors">
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
            </button>
            <button className="flex items-center justify-center gap-3 border-2 border-white text-white rounded-full px-8 py-4 hover:bg-white hover:text-[#090a0c] transition-colors">
              <span className="text-lg">List Your Property</span>
            </button>
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="hidden lg:block relative">
          {/* Frosted glass panel */}
          <div className="absolute -top-8 right-0 w-[400px] h-[250px] bg-white/20 backdrop-blur-sm rounded-lg shadow-lg"></div>

          {/* Image collage */}
          <div className="relative mt-32 grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-3">
              <div className="flex gap-3">
                <div className="w-32 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={heroArchImage2}
                    alt="Property"
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-lg overflow-hidden">
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
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={heroArchImage1}
                    alt="Property"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="w-40 h-32 rounded-lg overflow-hidden">
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
            <div className="relative rounded-2xl overflow-hidden h-64">
              <Image
                src={heroPoolImage}
                alt="Pool Property"
                width={200}
                height={256}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-center text-xl font-light">
                  Let&apos;s purchase your
                  <br />
                  dream place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
