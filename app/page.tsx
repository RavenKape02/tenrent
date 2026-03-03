import Image from "next/image";

// Hero section images
const heroPhoneImage =
  "https://www.figma.com/api/mcp/asset/fbf51885-b446-46eb-b09f-1e773bb637e4";
const heroPoolImage =
  "https://www.figma.com/api/mcp/asset/aeeae5d0-eb83-449f-a0b7-e555ced9233b";
const heroArchImage1 =
  "https://www.figma.com/api/mcp/asset/4381d5ed-04c0-4d83-a54e-bb7247ff8d2d";
const heroArchImage2 =
  "https://www.figma.com/api/mcp/asset/3f40a612-a0b0-4524-8e36-012cd5932f71";
const heroArchImage3 =
  "https://www.figma.com/api/mcp/asset/d26c6d7b-1ca3-4c13-a783-9cb767ad10a1";

// Listing images
const listingImage =
  "https://www.figma.com/api/mcp/asset/92928cbf-c2d5-4fc0-b76d-e0477b83c28b";
const agentAvatar =
  "https://www.figma.com/api/mcp/asset/c69de2a6-93b0-475c-a6d9-c577666abb28";

// Apartment type images
const deluxeImage =
  "https://www.figma.com/api/mcp/asset/73d463c1-a4e3-4722-93ca-fc0b23e91418";
const doubleHeightImage =
  "https://www.figma.com/api/mcp/asset/47069225-29cf-452d-a5a7-5e59729fb1d9";
const studioImage =
  "https://www.figma.com/api/mcp/asset/ca2bfa64-3d3e-44f3-888e-4c08656f6ac5";

// Dream apartment section
const dreamApartmentImage =
  "https://www.figma.com/api/mcp/asset/da28cf0d-7a13-46d2-826d-8b50d8720325";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-[#0fa8e2] py-4 px-6 md:px-24 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#0fa8e2] font-bold text-xl">T</span>
            </div>
            <span className="text-white font-semibold text-2xl md:text-3xl">
              Tenrent
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#"
              className="text-white text-lg hover:underline underline underline-offset-4"
            >
              Home
            </a>
            <a href="#" className="text-white text-lg hover:underline">
              Leases
            </a>
            <a href="#" className="text-white text-lg hover:underline">
              About
            </a>
          </nav>
          <button className="text-white md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#090a0c] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-24 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-[2px] bg-gray-500"></div>
                <span className="text-gray-500 text-lg">
                  Let&apos;s find yours Dream..
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-8">
                Building award
                <br />
                winning properties across
                <br />
                London UK and the All world
              </h1>
              <button className="flex items-center gap-3 border-2 border-[#ff214f] text-[#ff214f] rounded-full px-8 py-4 hover:bg-[#ff214f] hover:text-white transition-colors">
                <span className="text-lg">Create listing</span>
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

        {/* Bottom Property Cards */}
        <div className="bg-[#090a0c] pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-24">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl text-white font-light">
                HI, What do you want to your
                <br />
                <span className="text-[#ff214f]">Dream Apartment</span>
              </h2>
              <p className="text-gray-400 mt-4">
                Select a Apartment type below to begins
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lease Houses Section */}
      <section className="bg-[#14395b] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Lease Houses
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The Most frequently searched and most popular apartment of the
              application will be in the list
            </p>
          </div>

          {/* Property Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <PropertyCard key={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
          </div>
        </div>
      </section>

      {/* Buy Dream Apartment Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#186aa5] leading-tight mb-8">
                Buy
                <br />
                Dream Apartment
                <br />
                In Prime location
              </h2>
              <button className="bg-[#14395b] text-white px-10 py-5 rounded-2xl text-xl hover:bg-[#0d2a42] transition-colors shadow-md">
                See All Apartment
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={dreamApartmentImage}
                  alt="Dream Apartment"
                  width={860}
                  height={550}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>
              {/* Play button overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#186aa5] ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apartment Types Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">
              HI, What do you want to your dream Apartment
            </h2>
            <p className="text-gray-500">
              Select a Apartment type below to begins
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ApartmentTypeCard image={deluxeImage} title="Deluxe Portion" />
            <ApartmentTypeCard
              image={doubleHeightImage}
              title="Double Height"
            />
            <ApartmentTypeCard image={deluxeImage} title="Penthouse" />
            <ApartmentTypeCard image={studioImage} title="The Studio" />
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-800"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="bg-[#14395b] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="text-center mb-12">
            <p className="text-white/70 text-lg mb-2">Apartments</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Featured Listings
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<ParkingIcon />} title="Parking Space" />
            <FeatureCard icon={<SwimmingIcon />} title="Swimming Poll" />
            <FeatureCard
              icon={<SecurityIcon />}
              title="Private Security"
              active
            />
            <FeatureCard icon={<MedicalIcon />} title="Medical Center" />
            <FeatureCard icon={<LibraryIcon />} title="Library Area" />
            <FeatureCard icon={<BedIcon />} title="King Size Beds" />
            <FeatureCard icon={<SmartHomeIcon />} title="Smart Home" />
            <FeatureCard icon={<PlaygroundIcon />} title="Kids Playland" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d2135] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#0d2135] font-bold text-xl">L</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  Lease Property
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                The most beautiful exclusive
                <br />
                properties and luxury apartments
              </p>
              <div className="flex gap-3">
                <SocialButton icon="facebook" />
                <SocialButton icon="twitter" />
                <SocialButton icon="instagram" />
                <SocialButton icon="dribbble" />
              </div>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-white font-medium mb-4">Useful Links</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-white font-medium mb-4">Help?</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Term & Condition
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-white font-medium mb-4">Address</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>113-115 Old Brompton Road</li>
                <li>SW7 3LE LONDON, UNITED KINGDOM</li>
                <li>website :www.mordern.com</li>
                <li>mobile</li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © Copyright 2022, mordenhomes.com
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Terms & Condition | Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Property Card Component
function PropertyCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="relative">
        <Image
          src="https://www.figma.com/api/mcp/asset/92928cbf-c2d5-4fc0-b76d-e0477b83c28b"
          alt="Property"
          width={376}
          height={277}
          className="w-full h-48 object-cover"
          unoptimized
        />
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded uppercase">
          Accepting Bids
        </span>
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          <Image
            src="https://www.figma.com/api/mcp/asset/c69de2a6-93b0-475c-a6d9-c577666abb28"
            alt="Agent"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Knightsbridge</span>
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-gray-900">Apartment London</h3>
          <div className="text-right flex-shrink-0">
            <span className="text-gray-500 text-xs">Tenrent fee :</span>
            <span className="text-blue-600 font-bold ml-1">$500</span>
          </div>
        </div>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2">
          Beautiful Huge 1 family House in heart of westbury newly Renovated
          With New Furniture
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 bg-blue-50 border border-blue-500/30 rounded px-2 py-2 w-fit">
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
              <p className="text-gray-500 text-[10px]">bedrooms</p>
            </div>
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
              <p className="text-gray-500 text-[10px]">bathrooms</p>
            </div>
            <div className="text-center">
              <span className="text-blue-600 font-bold text-sm">1776</span>
              <p className="text-gray-500 text-[10px]">squre ft</p>
            </div>
          </div>
          <button className="bg-[#14395b] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#0d2a42] transition-colors w-full">
            <span className="text-xs">Place Bid</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.5 3A2.5 2.5 0 0 1 20 5.5v.5h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1v-.5A2.5 2.5 0 0 1 6.5 3h11zM18 10H6v9h12v-9zm2-2V7H4v1h16zM6.5 5a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5h-11z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Apartment Type Card Component
function ApartmentTypeCard({ image, title }: { image: string; title: string }) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-shadow cursor-pointer">
      <div className="rounded-2xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          width={316}
          height={224}
          className="w-full h-40 object-cover"
          unoptimized
        />
      </div>
      <p className="text-center text-gray-500 text-lg">{title}</p>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 text-center ${active ? "bg-[#186aa5]" : "bg-white"} transition-colors cursor-pointer hover:bg-[#186aa5] group`}
    >
      <div
        className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center ${active ? "text-white" : "text-[#14395b] group-hover:text-white"}`}
      >
        {icon}
      </div>
      <p
        className={`font-medium ${active ? "text-white" : "text-gray-700 group-hover:text-white"}`}
      >
        {title}
      </p>
    </div>
  );
}

// Social Button Component
function SocialButton({ icon }: { icon: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#186aa5] flex items-center justify-center cursor-pointer hover:bg-[#0fa8e2] transition-colors">
      {icon === "facebook" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
        </svg>
      )}
      {icon === "twitter" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
        </svg>
      )}
      {icon === "instagram" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )}
      {icon === "dribbble" && (
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z" />
        </svg>
      )}
    </div>
  );
}

// Icons for Feature Cards
function ParkingIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
    </svg>
  );
}

function SwimmingIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zM8.67 12c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.12-.07.26-.15.41-.23L10.48 5C10.18 4.39 9.55 4 8.86 4c-.68 0-1.31.39-1.62 1l-5.97 11.22c.29-.07.58-.22.86-.37.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.35 1.17.15z" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  );
}

function SmartHomeIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function PlaygroundIcon() {
  return (
    <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  );
}
