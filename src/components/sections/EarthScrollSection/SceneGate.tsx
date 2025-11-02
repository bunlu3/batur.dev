"use client";
import { Html, useProgress } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import SwapText from "@/components/ui/SwapText";
import styles from "./SceneGate.module.css";

/** Fullscreen loader that fades out after the first compile */
export default function SceneGate() {
    const { progress } = useProgress(); // 0..100 from drei
    const [visible, setVisible] = useState(true);
    const [alpha, setAlpha] = useState(1);

    // When progress hits 100, wait a hair for textures to upload, then fade
    useEffect(() => {
        if (progress >= 100 && visible) {
            const id = requestAnimationFrame(() => {
                const t = setTimeout(() => {
                    setAlpha(0);
                    const t2 = setTimeout(() => setVisible(false), 350);
                    return () => clearTimeout(t2);
                }, 120);
                return () => clearTimeout(t);
            });
            return () => cancelAnimationFrame(id);
        }
    }, [progress, visible]);

    if (!visible) return null;

    return (
        // Html renders inside the R3F canvas but we make it fullscreen
        <Html fullscreen transform={false}>
            <div
                className={styles.gate}
                style={
                    {
                        opacity: alpha,
                        ["--swap-stagger" as any]: "22ms", // same per-char delay you use elsewhere
                    } as React.CSSProperties
                }
            >
                {/* Star / nebula backdrop */}
                <div className={styles.stars1} />
                <div className={styles.stars2} />
                <div className={styles.stars3} />

                {/* Center card */}
                <div className={styles.center}>
                    <div className={styles.card}>
                        {/* ring loader */}
                        <div className={styles.ring} />

                        {/* BIG TITLE with swap animation */}
                        <div className={`swap-animate ${styles.titleWrap}`}>
                            <SwapText text="Preparing the globe…" className={styles.title} />
                        </div>

                        {/* subline (also swap, smaller and calmer) */}
                        <div
                            className={`swap-animate ${styles.subWrap}`}
                            aria-live="polite"
                        >
                            <SwapText
                                text={`${Math.round(progress)}% • streaming textures`}
                                className={styles.sub}
                            />
                        </div>

                        {/* progress bar */}
                        <div className={styles.barOuter}>
                            <div
                                className={styles.barInner}
                                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* local keyframes for non-module-able bits (if any) */}
                <style>{keyframes}</style>
            </div>
        </Html>
    );
}

const keyframes = `
@keyframes sg_spin { to { transform: rotate(360deg); } }
@keyframes sg_sheen {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
/* optional: if you want extra drift you can leave these as-is, CSS module handles base visuals */
`;
