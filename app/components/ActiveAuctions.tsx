import PropertyCard from "./PropertyCard";

export default function ActiveAuctions() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Active Auctions
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Properties accepting bids right now. Place your bid before time runs
            out!
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
  );
}
