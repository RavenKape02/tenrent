export default function LandlordCTA() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Are You a Property Owner?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            List your property and let renters compete for it. Discover the true
            market value.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">$250</div>
            <p className="text-gray-300">Average Premium Earned</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">7 Days</div>
            <p className="text-gray-300">Typical Bidding Window</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">85%</div>
            <p className="text-gray-300">You Keep of Premium</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <button className="bg-[#ff214f] text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-[#e01d45] transition-colors shadow-lg">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  );
}
