"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageCarousel from "./components/ImageCarousel";
import ActiveAuctions from "./components/ActiveAuctions";
import LandlordCTA from "./components/LandlordCTA";
import Footer from "./components/Footer";

const Grainient = dynamic(() => import("@/components/Grainient"), {
  ssr: false,
});

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />

      <Header
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Grainient
            color1="#000938"
            color2="#000000"
            color3="#130349"
            timeSpeed={0.4}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={3.9}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.75}
          />
        </div>
        <div className="relative z-10">
          <HeroSection />
          <ImageCarousel />
          <ActiveAuctions />
          <LandlordCTA />
        </div>
      </section>

      <Footer />
    </div>
  );
}
