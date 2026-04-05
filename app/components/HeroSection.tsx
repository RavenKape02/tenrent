const headingLines = ["Bid for rentals", "with confidence."];

export default function HeroSection() {
  let characterIndex = 0;

  return (
    <section
      id="home-hero"
      className="relative min-h-svh overflow-hidden bg-black text-white antialiased"
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/l6EzZafb1Pk?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=l6EzZafb1Pk&modestbranding=1&playsinline=1"
            title="Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.10),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center py-8 sm:py-10 lg:py-14">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-end">
            <div className="max-w-3xl">
              <div
                className="inline-flex -translate-y-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/80 opacity-0 backdrop-blur-sm"
                style={{ animation: "hero-fade-in 900ms ease forwards 450ms" }}
              >
                Rental bidding platform
              </div>

              <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
                {headingLines.map((line, lineIndex) => (
                  <span key={line} className="block">
                    {line.split("").map((char) => {
                      const currentIndex = characterIndex;
                      characterIndex += 1;

                      return (
                        <span
                          key={`${lineIndex}-${currentIndex}`}
                          className="inline-block opacity-0"
                          style={{
                            transform: "translateX(-18px)",
                            animation: "hero-char-in 500ms ease forwards",
                            animationDelay: `${200 + currentIndex * 30}ms`,
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>

              <p
                className="mt-7 max-w-2xl text-base text-gray-300 opacity-0 sm:text-lg"
                style={{ animation: "hero-fade-in 1000ms ease forwards 800ms" }}
              >
                TenRent helps renters place competitive bids and helps landlords
                compare offers with clarity, speed, and less back-and-forth.
              </p>
            </div>

            <div className="flex min-h-56 items-end justify-start lg:justify-end">
              <div
                className="liquid-glass rounded-xl px-5 py-4 text-lg font-light text-white opacity-0 sm:text-xl lg:text-2xl"
                style={{
                  animation: "hero-fade-in 1000ms ease forwards 1400ms",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                Fair bids. Clear terms. Faster leasing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
