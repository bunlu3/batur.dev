"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./ProximityGlowText.module.css";

type Props = {
    text?: string;
    forceHide?: boolean;
};

export default function ProximityGlowText({
                                              text = "Click Anywhere To Continue",
                                              forceHide = false,
                                          }: Props) {
    const h1Ref = useRef<HTMLHeadingElement | null>(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (forceHide) setHidden(true);
    }, [forceHide]);

    useEffect(() => {
        const el = h1Ref.current;
        if (!el) return;

        let raf = 0;
        let targetPx = 0.5, targetPy = 0.5, px = 0.5, py = 0.5, intensity = 0.15;

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            targetPx = (e.clientX - r.left) / r.width;
            targetPy = (e.clientY - r.top) / r.height;
            const dx = targetPx - 0.5, dy = targetPy - 0.5;
            const d = Math.hypot(dx, dy);
            intensity = Math.max(0.15, 1 - d / 0.8);
        };

        const loop = () => {
            px += (targetPx - px) * 0.2;
            py += (targetPy - py) * 0.2;
            el.style.setProperty("--px", `${px * 100}%`);
            el.style.setProperty("--py", `${py * 100}%`);
            el.style.setProperty("--intensity", intensity.toString());
            raf = requestAnimationFrame(loop);
        };

        const onClick = () => setHidden(true);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onClick, { passive: true });
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onClick);
        };
    }, []);

    return (
        <div
            className={`fixed inset-0 z-20 select-none transition-opacity duration-700 ease-out ${
                hidden ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
        >
            <div className={styles.posWrap}>
                <div className={styles.posInner}>
                    <h1
                        ref={h1Ref}
                        className={[
                            styles.proxText,
                            "pointer-events-auto",
                            "m-0 leading-[1.05] text-center tracking-tight",
                            "text-[clamp(38px,7vw,120px)]",
                        ].join(" ")}
                    >
                        <span className="block">Click Anywhere To</span>
                        <span className="block">Continue</span>
                    </h1>
                </div>
            </div>
        </div>
    );
}
