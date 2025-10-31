"use client";
import { useState } from "react";
import AmbientSwirlBackground from "@/components/effects/AmbientSwirlBackground";
import ProximityGlowText from "@/components/ui/ProximityGlowText";
import IntroOverlay from "@/components/ui/IntroOverlay";

export default function Page() {
    const [showIntro, setShowIntro] = useState(false);

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
                persistAfterglow={true}
                onWhirlpoolComplete={() => setShowIntro(true)}
            />

            {/* Click-to-continue headline (yours) */}
            <ProximityGlowText forceHide={showIntro} />
            <IntroOverlay show={showIntro} />

            <main className="pointer-events-none relative z-10 grid min-h-screen place-items-center" />
        </>
    );
}
