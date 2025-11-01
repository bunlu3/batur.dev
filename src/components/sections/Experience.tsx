"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Experience.module.css";

type Props = {
    enterClass?: string;
    disableMount?: boolean;
};

let experiencePoppedOnce = false;

export default function Experience({ enterClass = "", disableMount = false }: Props) {
    const scaleRef = useRef<HTMLDivElement | null>(null);

    const shouldPop = !disableMount && !experiencePoppedOnce;
    const [mount, setMount] = useState(shouldPop);

    useEffect(() => {
        const el = scaleRef.current;
        if (!el) return;

        if (!disableMount) experiencePoppedOnce = true;

        let t: any;
        if (shouldPop) t = setTimeout(() => setMount(false), 720);
        else setMount(false);

        let raf = 0;
        let targetX=0.5, targetY=0.5, x=0.5, y=0.5;
        let ring=0, tint=0, targetRing=0, targetTint=0;
        let eT=0,eR=0,eB=0,eL=0,tT=0,tR=0,tB=0,tL=0;

        const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
        const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
        const smooth=(t:number)=>t*t*(3-2*t);

        const animate=()=>{
            x=lerp(x,targetX,0.18); y=lerp(y,targetY,0.18);
            ring=lerp(ring,targetRing,0.18); tint=lerp(tint,targetTint,0.14);
            eT=lerp(eT,tT,0.18); eR=lerp(eR,tR,0.18); eB=lerp(eB,tB,0.18); eL=lerp(eL,tL,0.18);

            el.style.setProperty("--hx",`${(x*100).toFixed(3)}%`);
            el.style.setProperty("--hy",`${(y*100).toFixed(3)}%`);
            el.style.setProperty("--ring",ring.toFixed(3));
            el.style.setProperty("--tint",tint.toFixed(3));
            el.style.setProperty("--edgeT",eT.toFixed(3));
            el.style.setProperty("--edgeR",eR.toFixed(3));
            el.style.setProperty("--edgeB",eB.toFixed(3));
            el.style.setProperty("--edgeL",eL.toFixed(3));
            raf=requestAnimationFrame(animate);
        };
        raf=requestAnimationFrame(animate);

        const update=(cx:number,cy:number)=>{
            const r = el.getBoundingClientRect();
            const px = clamp01((cx-r.left)/r.width);
            const py = clamp01((cy-r.top)/r.height);
            targetX=px; targetY=py;

            const dMin=Math.min(py,1-py,px,1-px);
            const edgeStart=0.22;
            const edgeAmt=clamp01((edgeStart-dMin)/edgeStart);
            const edge=Math.pow(smooth(edgeAmt),1.6);

            targetRing=edge; targetTint=0.7;

            const falloff=0.12;
            const wT=Math.exp(-Math.pow(py/falloff,2))*edge;
            const wB=Math.exp(-Math.pow((1-py)/falloff,2))*edge;
            const wL=Math.exp(-Math.pow(px/falloff,2))*edge;
            const wR=Math.exp(-Math.pow((1-px)/falloff,2))*edge;
            const m=Math.max(wT,wR,wB,wL)||1;
            tT=wT/m; tR=wR/m; tB=wB/m; tL=wL/m;
        };

        const onMove=(e:PointerEvent)=>update(e.clientX,e.clientY);
        const onEnter=(e:PointerEvent)=>update(e.clientX,e.clientY);
        const onLeave=()=>{ targetRing=0; targetTint=0; tT=tR=tB=tL=0; targetX=0.5; targetY=0.5; };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter as any);
        el.addEventListener("pointerleave", onLeave);

        return ()=>{
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter as any);
            el.removeEventListener("pointerleave", onLeave);
            cancelAnimationFrame(raf);
            if (t) clearTimeout(t);
        };
    }, [disableMount]);

    return (
        <section className={styles.wrap}>
            <div className={styles.card} tabIndex={0}>
                <div
                    ref={scaleRef}
                    className={[
                        styles.cardScale,
                        mount ? styles.mountIn : "",
                        enterClass,
                    ].join(" ").trim()}
                >
                    <div className={styles.cardInner}>
                        <p className={styles.h1}>Experience</p>

                        <div className={styles.timeline}>
                            <div className={styles.item}>
                                <span className={styles.role}>Software Engineer — NCR Voyix</span>
                                <span className={styles.meta}> · 2024 → Present · Atlanta, GA</span>
                                <div>Identity & Home Platform · .NET • React • GCP • Okta • LaunchDarkly • Distributed Caching</div>
                            </div>

                            <div className={styles.item}>
                                <span className={styles.role}>AI Engineer Co-Op — UPS Capital</span>
                                <span className={styles.meta}> · 2023 · Atlanta, GA</span>
                                <div>ML prototypes → productionized services · data pipelines · dashboards</div>
                            </div>

                            <div className={styles.item}>
                                <span className={styles.role}>Olympic Athlete — Turkey National Team</span>
                                <span className={styles.meta}> · Tokyo 2021</span>
                                <div>Precision • Teamwork • Performance under pressure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
