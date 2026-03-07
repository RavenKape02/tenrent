import Image from "next/image";

const carouselImages = Array.from({ length: 9 }, (_, i) => `/room${i + 1}.jpg`);

export default function ImageCarousel() {
  return (
    <div className="pb-16">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl text-white font-light">
            Featured Properties
          </h2>
          <p className="text-gray-400 mt-4">
            Explore stunning rentals available now
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
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
                  className="object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
