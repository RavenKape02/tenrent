import Image from "next/image";

export default function PropertyCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
      <div className="relative">
        <Image
          src="https://www.figma.com/api/mcp/asset/92928cbf-c2d5-4fc0-b76d-e0477b83c28b"
          alt="Property"
          width={376}
          height={277}
          className="w-full h-48 object-cover"
          unoptimized
        />
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded uppercase font-semibold">
          Accepting Bids
        </span>
        {/* Heart/Save Icon */}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
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
        <h3 className="font-bold text-gray-900 mb-3">Apartment London</h3>

        {/* Bidding Information */}
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Base Rent:</span>
            <span className="text-sm font-semibold text-gray-900">
              $1,500/mo
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">High Bid:</span>
            <span className="text-lg font-bold text-[#ff214f]">+$200</span>
          </div>
          <div className="border-t border-blue-200 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Total:</span>
              <span className="text-base font-bold text-blue-600">
                $1,700/mo
              </span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 mb-3 text-orange-600 bg-orange-50 px-3 py-2 rounded">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-semibold">Ends in: 2d 14h</span>
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
          <button className="bg-[#14395b] text-white px-4 py-3 rounded-lg hover:bg-[#0d2a42] transition-colors w-full font-semibold">
            View & Bid
          </button>
        </div>
      </div>
    </div>
  );
}
