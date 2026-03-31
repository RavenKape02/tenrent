import Image from "next/image";

const carouselImages = Array.from({ length: 9 }, (_, i) => `/room${i + 1}.jpg`);

export default function ImageCarousel() {
  return (
    <div className="pb-16">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="ds-h5 mb-3">
            Featured Properties
          </h2>
          <p className="ds-body">
            Explore stunning rentals available now
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[10px]">
          <div className="flex w-max animate-scroll">
            {[...carouselImages, ...carouselImages].map((src, i) => (
              <div
                key={i}
                className="relative w-[300px] h-[200px] md:w-[400px] md:h-[280px] flex-shrink-0 mx-2"
              >
                <Image
                  src={src}
                  alt={`Room ${(i % 9) + 1}`}
                  fill
                  className="object-cover rounded-[10px] border border-white/8"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
