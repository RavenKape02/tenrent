"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
  ssr: false,
});

export default function WhyChooseTenRent() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-24 flex items-center justify-center [&>div]:w-full!">
        <ModelViewer
          url="/ToyCar.glb"
          width={1000}
          height={500}
          modelXOffset={0}
          modelYOffset={0}
          enableMouseParallax={false}
          enableHoverRotation={false}
          enableManualRotation={true}
          environmentPreset="none"
          fadeIn={false}
          autoRotate={true}
          autoRotateSpeed={0.35}
          showScreenshotButton={false}
          autoFrame={true}
          ambientIntensity={1}
          keyLightIntensity={1.5}
          placeholderSrc={undefined}
          onModelLoaded={undefined}
        />
      </div>
    </section>
  );
}
