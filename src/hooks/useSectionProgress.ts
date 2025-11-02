"use client";
import { useEffect, useRef, useState } from "react";

export default function useSectionProgress(sectionId: string) {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const el = document.getElementById(sectionId);
        if (!el) return;

        const calc = () => {
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrolled = -r.top; // how far the top is above viewport
            const denom = Math.max(1, r.height - vh);
            const p = Math.min(1, Math.max(0, scrolled / denom));
            setProgress(p);
        };

        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(calc);
        };

        calc();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [sectionId]);

    return progress;
}
