"use client";
import { useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import AmbientSwirlBackground from "@/components/effects/AmbientSwirlBackground";
import ProximityGlowText from "@/components/ui/ProximityGlowText";
import IntroOverlay from "@/components/ui/IntroOverlay";
import EarthScrollSection from "@/components/sections/EarthScrollSection/EarthScrollSection";

function usePreloadEarthTextures() {
    // lightweight, runs once at page mount so textures are in cache
    useEffect(() => {
        useTexture.preload("/textures/earth_color.jpg");
        useTexture.preload("/textures/earth_bump.jpg");
        useTexture.preload("/textures/earth_night.jpg");
        useTexture.preload("/textures/earth_clouds.jpg");
    }, []);
}

export default function Page() {
    usePreloadEarthTextures();

    const [showIntro, setShowIntro] = useState(false);
    const [leavingHero, setLeavingHero] = useState(false);
    const [overlayKey, setOverlayKey] = useState(0);
    const [showEarth, setShowEarth] = useState(false);
    const earthRef = useRef<HTMLElement | null>(null);

    const handleContinue = () => {
        setLeavingHero(true);
        setTimeout(() => {
            setShowIntro(false);
            setTimeout(() => setShowEarth(true), 300);
        }, 700);
    };

    useEffect(() => {
        if (showEarth && earthRef.current) {
            earthRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showEarth]);

    return (
        <>
            <AmbientSwirlBackground
                backgroundColor="hsl(210 50% 6%)"
                particleCount={500}
                gatherMs={3500}
                explodeMs={2500}
                holeRadiusRatio={0.5}
                explosionBase={7}
                explosionSpread={5}
                explosionDecay={0.986}
                afterglowNoise={0.3}
                afterglowSpeed={0.3}
                whirlpoolSpin={2.5}
                persistAfterglow
                onWhirlpoolComplete={() => {
                    setOverlayKey((k) => k + 1);
                    setShowIntro(true);
                }}
                ignoreWhirlpoolSelector=".no-whirlpool"
                shiftUp={leavingHero}
            />

            <ProximityGlowText forceHide={showIntro} />

            {showIntro && (
                <div className="no-whirlpool">
                    <IntroOverlay
                        key={overlayKey}
                        show={showIntro}
                        isLeaving={leavingHero}
                        onAbout={handleContinue}
                    />
                </div>
            )}

            {showEarth && (
                <section
                    ref={earthRef as any}
                    style={{ opacity: 0, animation: "fadeIn .35s ease forwards" }}
                >
                    <EarthScrollSection />
                </section>
            )}

            <main className="pointer-events-none relative z-10 grid min-h-screen place-items-center" />
        </>
    );
}
