"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

type Props = {
    enterClass?: string;     
    disableMount?: boolean;  
};

export default function About({ enterClass = "", disableMount = false }: Props) {
    const scaleRef = useRef<HTMLDivElement | null>(null);
    const [mountClass, setMountClass] = useState(!disableMount);

    useEffect(() => {
        const el = scaleRef.current;
        if (!el) return;

        let t: any;
        if (!disableMount) t = setTimeout(() => setMountClass(false), 720);
        else setMountClass(false);

        let raf = 0;
        let targetX = 0.5, targetY = 0.5, x = 0.5, y = 0.5;
        let ring = 0, tint = 0, targetRing = 0, targetTint = 0;
        let eT = 0, eR = 0, eB = 0, eL = 0, tT = 0, tR = 0, tB = 0, tL = 0;

        const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
        const clamp01 = (v:number)=>Math.max(0,Math.min(1,v));
        const smooth = (t:number)=>t*t*(3-2*t);

        const animate = () => {
            x = lerp(x, targetX, 0.18);
            y = lerp(y, targetY, 0.18);
            ring = lerp(ring, targetRing, 0.18);
            tint = lerp(tint, targetTint, 0.14);
            eT = lerp(eT, tT, 0.18); eR = lerp(eR, tR, 0.18);
            eB = lerp(eB, tB, 0.18); eL = lerp(eL, tL, 0.18);

            el.style.setProperty("--hx", `${(x*100).toFixed(3)}%`);
            el.style.setProperty("--hy", `${(y*100).toFixed(3)}%`);
            el.style.setProperty("--ring", ring.toFixed(3));
            el.style.setProperty("--tint", tint.toFixed(3));
            el.style.setProperty("--edgeT", eT.toFixed(3));
            el.style.setProperty("--edgeR", eR.toFixed(3));
            el.style.setProperty("--edgeB", eB.toFixed(3));
            el.style.setProperty("--edgeL", eL.toFixed(3));
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        const update = (cx:number, cy:number)=>{
            const r = el.getBoundingClientRect();
            const px = clamp01((cx - r.left)/r.width);
            const py = clamp01((cy - r.top)/r.height);
            targetX = px; targetY = py;

            const dMin = Math.min(py, 1-py, px, 1-px);
            const edgeStart = 0.22;
            const edgeAmt = clamp01((edgeStart - dMin)/edgeStart);
            const edge = Math.pow(smooth(edgeAmt), 1.6);

            targetRing = edge;
            targetTint = 0.7;

            const falloff = 0.12;
            const wT = Math.exp(-Math.pow(py/falloff,2))*edge;
            const wB = Math.exp(-Math.pow((1-py)/falloff,2))*edge;
            const wL = Math.exp(-Math.pow(px/falloff,2))*edge;
            const wR = Math.exp(-Math.pow((1-px)/falloff,2))*edge;
            const m = Math.max(wT,wR,wB,wL)||1;
            tT=wT/m; tR=wR/m; tB=wB/m; tL=wL/m;
        };

        const onMove=(e:PointerEvent)=>update(e.clientX,e.clientY);
        const onEnter=(e:PointerEvent)=>update(e.clientX,e.clientY);
        const onLeave=()=>{ targetRing=0; targetTint=0; tT=tR=tB=tL=0; targetX=0.5; targetY=0.5; };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter as any);
        el.addEventListener("pointerleave", onLeave);

        return () => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter as any);
            el.removeEventListener("pointerleave", onLeave);
            cancelAnimationFrame(raf);
            if (t) clearTimeout(t);
        };
    }, [disableMount]);

    return (
        <section className={`${styles.wrap} no-whirlpool`}>
            <div className={`${styles.card} no-whirlpool`} tabIndex={0}>
                <div
                    ref={scaleRef}
                    className={[
                        styles.cardScale,
                        mountClass ? styles.mountIn : "",
                        enterClass,
                    ].join(" ").trim()}
                >
                    <div className={styles.cardInner}>
                        <p className={styles.line}>About me</p>

                        <p className={styles.copy}>
                            Hi—I'm <strong>Baturalp</strong>, a former <strong>Olympic swimmer</strong> from
                            <strong> Turkey</strong> turned <strong>full-stack software engineer</strong> in the U.S.
                            I graduated from <strong>Georgia Tech</strong> (B.S. CS — AI &amp; Media), and I now build
                            secure, scalable multi-tenant SaaS at <strong>NCR Voyix</strong>—authentication,
                            developer tooling, and cloud platforms used by <strong>100K+ users</strong>.
                        </p>

                        <p className={styles.copy}>
                            Competitive sport taught me precision, teamwork, and performance. I apply those every day
                            in production systems. I blend engineering depth with visual craft so I can ship faster,
                            safer, and more intuitive products.
                        </p>

                        <div className={styles.list}>
                            <div><span className={`${styles.dot} ${styles.dotCyan}`} />Identity &amp; Home Platform · .NET + React + GCP</div>
                            <div><span className={`${styles.dot} ${styles.dotSky}`} />Okta · OAuth · LaunchDarkly flows · Distributed Caching</div>
                            <div><span className={`${styles.dot} ${styles.dotInd}`} />CI/CD Automation · DX Improvements · Clean UI Design</div>
                        </div>

                        <div className={`${styles.chips} no-whirlpool`}>
                            <a href="mailto:baturalpunlu02@hotmail.com" className={styles.chip}>Contact</a>
                            <a href="https://github.com/bunlu3" target="_blank" rel="noreferrer" className={styles.chip}>GitHub</a>
                            <a href="https://www.linkedin.com/in/baturalp-unlu" target="_blank" rel="noreferrer" className={styles.chip}>LinkedIn</a>
                            <a href="https://en.wikipedia.org/wiki/Baturalp_%C3%9Cnl%C3%BC" target="_blank" rel="noreferrer" className={styles.chip}>Wikipedia</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
