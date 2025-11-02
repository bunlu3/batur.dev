"use client";
import React, { useEffect, useState } from "react";

export default function SceneGateOverlay({ show }: { show: boolean }) {
    const [alpha, setAlpha] = useState(1);

    useEffect(() => {
        if (!show) {
            const id = requestAnimationFrame(() => setAlpha(0));
            return () => cancelAnimationFrame(id);
        } else {
            setAlpha(1);
        }
    }, [show]);

    if (!show && alpha === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                pointerEvents: "auto",
                opacity: alpha,
                transition: "opacity 360ms ease",
                background:
                    "radial-gradient(1200px 600px at 20% 15%, rgba(60,160,255,.15), transparent 60%)," +
                    "radial-gradient(1000px 800px at 80% 70%, rgba(0,220,255,.12), transparent 55%)," +
                    "linear-gradient(180deg, hsl(210 30% 6%), hsl(210 35% 5%))",
            }}
        >
            <div style={star(1, 24, 0.35, 70)} />
            <div style={star(2, 16, 0.5, 120)} />
            <div style={star(3, 8, 0.75, 180)} />

            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div
                    style={{
                        width: 280,
                        maxWidth: "90vw",
                        padding: "20px 22px",
                        borderRadius: 18,
                        background: "hsla(210, 40%, 7%, .6)",
                        border: "1px solid hsl(195 70% 40% / .25)",
                        boxShadow: "0 20px 80px hsl(210 50% 2% / .5), inset 0 1px 0 hsl(0 0% 100% / .06)",
                        backdropFilter: "blur(8px)",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            margin: "0 auto 14px",
                            borderRadius: "50%",
                            border: "3px solid rgba(137,230,255,.9)",
                            borderRightColor: "transparent",
                            animation: "sg_spin 950ms linear infinite",
                            filter: "drop-shadow(0 0 6px rgba(137,230,255,.65))",
                        }}
                    />
                    <div style={{ fontWeight: 800, letterSpacing: ".03em", marginBottom: 6 }}>
                        Preparing the globe…
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9, letterSpacing: ".02em" }}>
                        optimizing textures & lighting
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes sg_spin { to { transform: rotate(360deg) } }
        @keyframes drift1 { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-60px,20px,0)} }
        @keyframes drift2 { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(80px,-40px,0)} }
        @keyframes drift3 { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-100px,-60px,0)} }
        @keyframes twinkle { 0%,100%{opacity:.9} 50%{opacity:.65} }
      `}</style>
        </div>
    );
}

function star(idx:number, blur:number, op:number, speed:number): React.CSSProperties {
    return {
        position: "absolute",
        inset: 0,
        backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.9), transparent 60%)," +
            "radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,.75), transparent 60%)," +
            "radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,.8), transparent 60%)," +
            "radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,.85), transparent 60%)",
        backgroundSize: "24px 24px",
        filter: `blur(${blur}px)`,
        mixBlendMode: "screen",
        opacity: op,
        animation: `drift${idx} ${speed}s linear infinite, twinkle ${speed*1.2}s ease-in-out infinite`,
    };
}
