"use client";

import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

type Props = {
    backgroundColor?: string;
    particleCount?: number;
    delayMs?: number;
    gatherMs?: number;
    explodeMs?: number;
    holeRadiusRatio?: number;
    explosionBase?: number;
    explosionSpread?: number;
    explosionDecay?: number;
    afterglowNoise?: number;
    afterglowSpeed?: number;
    whirlpoolSpin?: number;
    persistAfterglow?: boolean;
    onWhirlpoolComplete?: () => void;
    ringRadiusRatio?: number;
    ringThickness?: number;   
    corePush?: number;        
    maxGatherSpeed?: number;  
    swirlStrength?: number;   
    shiftUp?: boolean;
    ignoreWhirlpoolSelector?: string;
};

function AmbientSwirlBackgroundImpl({
   backgroundColor = "hsla(210,40%,5%,1)",
   particleCount = 2000,
   gatherMs = 2500,
   explodeMs = 1800,
   holeRadiusRatio = 0.22,
   explosionBase = 7,
   explosionSpread = 4,
   explosionDecay = 0.986,
   afterglowNoise = 0.08,
   afterglowSpeed = 0.33,
   whirlpoolSpin = 1.5,
   persistAfterglow = true,
   onWhirlpoolComplete,
   ringRadiusRatio = 1.12,
   shiftUp = false,
   ignoreWhirlpoolSelector = "",
   }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const didInit = useRef(false);
    const rafRef = useRef<number | null>(null);
    const onDoneRef = useRef<typeof onWhirlpoolComplete>(onWhirlpoolComplete);
    const ignoreSelRef = useRef(ignoreWhirlpoolSelector);
    const shiftUpRef = useRef(shiftUp);

    useEffect(() => { onDoneRef.current = onWhirlpoolComplete; }, [onWhirlpoolComplete]);
    useEffect(() => { ignoreSelRef.current = ignoreWhirlpoolSelector; }, [ignoreWhirlpoolSelector]);
    useEffect(() => {
        shiftUpRef.current = shiftUp;
        const el = containerRef.current;
        if (el) el.style.setProperty("--swirlShiftY", shiftUp ? "-10vh" : "0vh");
    }, [shiftUp]);

    useEffect(() => {
        if (didInit.current) return;
        didInit.current = true;

        const root = containerRef.current;
        if (!root) return;

        const PROP = 9;
        const LEN = particleCount * PROP;
        const rangeY = 100;
        const baseTTL = 50, rangeTTL = 150;
        const baseSpeed = 0.1, rangeSpeed = 2;
        const baseRadius = 0.5, rangeRadius = 2.6;
        const HUE_A = 165, HUE_B = 205;
        const noiseSteps = 8;
        const xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;
        const TAU = Math.PI * 2;

        const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
        const rand = (n: number) => Math.random() * n;
        const randRange = (n: number) => (Math.random() - 0.5) * 2 * n;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const fadeInOut = (t: number, m: number) => {
            const hm = 0.5 * m;
            return Math.abs(((t + hm) % m) - hm) / hm;
        };

        let tick = 0, ringR = 0;
        let dpr = Math.max(1, window.devicePixelRatio || 1);
        let cw = window.innerWidth;
        let ch = window.innerHeight;
        const center: [number, number] = [0, 0];
        let holeR = 120;

        const noise3D = createNoise3D();
        const props = new Float32Array(LEN);
        const exVX = new Float32Array(particleCount);
        const exVY = new Float32Array(particleCount);
        let explosionPrimed = false;

        type Phase = "swirl" | "gather" | "explode" | "afterglow";
        let phase: Phase = "swirl";
        let phaseStart = performance.now();
        let gatherT = 0;
        let elapsedBlend = 0;
        let clickLocked = false;
        let completedEmitted = false;

        const A = document.createElement("canvas");
        const B = document.createElement("canvas");
        const a = A.getContext("2d")!;
        const b = B.getContext("2d")!;
        a.imageSmoothingEnabled = false;
        b.imageSmoothingEnabled = false;

        B.style.position = "fixed";
        B.style.inset = "0";
        B.style.width = "100%";
        B.style.height = "100%";
        B.style.zIndex = "-1";
        root.appendChild(B);

        function resize() {
            cw = window.innerWidth;
            ch = window.innerHeight;
            dpr = Math.max(1, window.devicePixelRatio || 1);

            A.width = Math.floor(cw * dpr);
            A.height = Math.floor(ch * dpr);
            B.width = Math.floor(cw * dpr);
            B.height = Math.floor(ch * dpr);

            a.setTransform(dpr, 0, 0, dpr, 0, 0);
            b.setTransform(dpr, 0, 0, dpr, 0, 0);

            center[0] = 0.5 * cw;
            center[1] = 0.5 * ch;
            holeR = Math.max(20, Math.min(cw, ch) * holeRadiusRatio);
            ringR = holeR * ringRadiusRatio;
        }

        function initParticle(i: number) {
            const x = rand(cw);
            const y = center[1] + randRange(rangeY);
            const vx = 0, vy = 0, life = 0;
            const ttl = baseTTL + rand(rangeTTL);
            const speed = baseSpeed + rand(rangeSpeed);
            const radius = baseRadius + rand(rangeRadius);
            const hue = (Math.random() < 0.5 ? HUE_A : HUE_B) + rand(10);
            props.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
        }
        for (let i = 0; i < LEN; i += PROP) initParticle(i);

        const crossesSeam = (x: number, y: number, x2: number, y2: number) =>
            Math.abs(x2 - x) > cw * 0.45 || Math.abs(y2 - y) > ch * 0.45;

        function wrap(x: number, y: number) {
            if (x < 0) x += cw; else if (x > cw) x -= cw;
            if (y < 0) y += ch; else if (y > ch) y -= ch;
            return [x, y] as const;
        }

        function drawSeg(
            x: number, y: number, x2: number, y2: number,
            life: number, ttl: number, r: number, hue: number, alpha?: number
        ) {
            if (crossesSeam(x, y, x2, y2)) return;

            const align = 0.5 / dpr;
            const x1s = x + align, y1s = y + align;
            const x2s = x2 + align, y2s = y2 + align;

            const dx = x - center[0], dy = y - center[1];
            const d = Math.hypot(dx, dy);
            const widthScale = Math.max(0.55, Math.min(1, (d / (holeR * 1.4))));
            const lw = Math.max(1, Math.round((r * widthScale) * dpr)) / dpr;

            const apha = alpha ?? fadeInOut(life, ttl);
            a.save();
            a.lineCap = "round";
            a.lineWidth = lw;
            a.strokeStyle = `hsla(${hue},100%,60%,${apha})`;
            a.beginPath();
            a.moveTo(x1s, y1s);
            a.lineTo(x2s, y2s);
            a.stroke();
            a.restore();
        }

        function primeExplosion() {
            for (let p = 0; p < particleCount; p++) {
                const i = p * PROP;
                let dx = props[i] - center[0];
                let dy = props[i + 1] - center[1];
                let d = Math.hypot(dx, dy);
                if (d < 1e-3) {
                    const ang = Math.random() * TAU;
                    dx = Math.cos(ang); dy = Math.sin(ang); d = 1;
                }
                const nx = dx / d, ny = dy / d;
                const mag = explosionBase + Math.random() * explosionSpread;
                exVX[p] = nx * mag; exVY[p] = ny * mag;
            }
            explosionPrimed = true;
        }

        function update(i: number) {
            const i2 = i + 1, i3 = i + 2, i4 = i + 3, i5 = i + 4, i6 = i + 5, i7 = i + 6, i8 = i + 7, i9 = i + 8;
            let x = props[i], y = props[i2];
            const life = props[i5], ttl = props[i6], baseSpd = props[i7], rad = props[i8], hue = props[i9];

            const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
            const nVx = Math.cos(n), nVy = Math.sin(n);
            let vx = lerp(props[i3], nVx, 0.5);
            let vy = lerp(props[i4], nVy, 0.5);

            if (phase === "gather") {
                const dx = center[0] - x, dy = center[1] - y;
                const d = Math.max(1e-4, Math.hypot(dx, dy));
                const seekX = dx / d, seekY = dy / d;
                const tx = -seekY, ty = seekX;

                const smooth = easeInOutCubic(gatherT);
                const soft = Math.min(1, elapsedBlend / (0.25 * gatherMs));
                const spin = whirlpoolSpin * smooth;
                const seekW = 0.72 * soft;
                const spinW = 0.88 * soft;

                const aimX = seekX * seekW + tx * spin * spinW;
                const aimY = seekY * seekW + ty * spin * spinW;

                vx = lerp(vx, aimX, 0.5 + 0.3 * smooth);
                vy = lerp(vy, aimY, 0.5 + 0.3 * smooth);

                const mul = 2.6 * smooth + 0.8;
                const x2 = x + vx * (baseSpd * mul);
                const y2 = y + vy * (baseSpd * mul);

                drawSeg(x, y, x2, y2, life, ttl, rad, hue, 1);
                const [nxp, nyp] = wrap(x2, y2);
                props[i] = nxp; props[i2] = nyp;
                props[i3] = vx; props[i4] = vy; props[i5] = life + 1;
                return;
            }

            if (phase === "explode") {
                const p = Math.floor(i / PROP);
                let x2 = x + exVX[p], y2 = y + exVY[p];
                drawSeg(x, y, x2, y2, life, ttl, rad, hue, 0.95);
                [x2, y2] = wrap(x2, y2);
                props[i] = x2; props[i2] = y2; props[i5] = life + 1;
                exVX[p] *= explosionDecay; exVY[p] *= explosionDecay;
                return;
            }

            if (phase === "afterglow") {
                vx = lerp(vx, vx + nVx, afterglowNoise);
                vy = lerp(vy, vy + nVy, afterglowNoise);
                const dx = x - center[0], dy = y - center[1];
                const d = Math.hypot(dx, dy);
                if (d < holeR) {
                    const k = 1 - d / holeR;
                    const nx = dx / d, ny = dy / d;
                    vx += nx * (0.6 + 1.4 * k);
                    vy += ny * (0.6 + 1.4 * k);
                }
                const x2 = x + vx * (baseSpd * afterglowSpeed);
                const y2 = y + vy * (baseSpd * afterglowSpeed);
                drawSeg(x, y, x2, y2, life, ttl, rad, hue);
                const [nxp, nyp] = wrap(x2, y2);
                props[i] = nxp; props[i2] = nyp;
                props[i3] = vx; props[i4] = vy; props[i5] = life + 1;
                return;
            }

            const x2 = x + vx * baseSpd, y2 = y + vy * baseSpd;
            drawSeg(x, y, x2, y2, life, ttl, rad, hue);
            const [nxp, nyp] = wrap(x2, y2);
            props[i] = nxp; props[i2] = nyp;
            props[i3] = vx; props[i4] = vy; props[i5] = life + 1;
            if ((nxp !== x2 || nyp !== y2) || life > ttl) initParticle(i);
        }

        function frame() {
            const now = performance.now();
            const elapsed = now - phaseStart;

            if (phase === "gather") {
                const t = clamp(elapsed / Math.max(1, gatherMs), 0, 1);
                gatherT = easeInOutCubic(t);
                elapsedBlend += 16.6;
                if (elapsed > gatherMs) {
                    phase = "explode";
                    phaseStart = now;
                    if (!explosionPrimed) primeExplosion();
                }
            } else if (phase === "explode") {
                if (elapsed > explodeMs) {
                    phase = "afterglow";
                    phaseStart = now;
                    clickLocked = false;
                    if (!completedEmitted) {
                        completedEmitted = true;
                        try { onDoneRef.current?.(); } catch {}
                    }
                }
            } else if (phase === "afterglow") {
            } else {
                gatherT = 0;
                clickLocked = false;
            }

            tick++;

            a.clearRect(0, 0, cw, ch);
            b.fillStyle = backgroundColor;
            b.fillRect(0, 0, cw, ch);

            for (let i = 0; i < LEN; i += PROP) update(i);

            b.save(); b.globalCompositeOperation = "source-over"; b.filter = "none"; b.drawImage(A, 0, 0, cw, ch); b.restore();
            b.save(); b.globalCompositeOperation = "lighter"; b.filter = "blur(0.9px) brightness(140%)"; b.globalAlpha = 0.45; b.drawImage(A, 0, 0, cw, ch); b.restore();
            b.save(); b.globalCompositeOperation = "lighter"; b.filter = "blur(3px) brightness(200%)"; b.drawImage(A, 0, 0, cw, ch); b.restore();
            b.save(); b.globalCompositeOperation = "lighter"; b.filter = "blur(1.5px) brightness(150%)"; b.drawImage(A, 0, 0, cw, ch); b.restore();
            b.save(); b.globalCompositeOperation = "lighter"; b.filter = "none"; b.drawImage(A, 0, 0, cw, ch); b.restore();

            rafRef.current = requestAnimationFrame(frame);
        }

        function startWhirlpoolAt(x: number, y: number) {
            if (clickLocked) return;
            clickLocked = true;
            center[0] = x;
            center[1] = y;
            phase = "gather";
            phaseStart = performance.now();
            elapsedBlend = 0;
            explosionPrimed = false;
        }

        function onPointer(e: PointerEvent) {
            if (clickLocked) return;
            const target = e.target as Element | null;
            const ignoreSel = ignoreSelRef.current;
            if (ignoreSel && target && target.closest(ignoreSel)) return;

            const rect = B.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (cw / rect.width);
            const y = (e.clientY - rect.top)  * (ch / rect.height);
            startWhirlpoolAt(x, y);
        }

        resize();
        rafRef.current = requestAnimationFrame(frame);
        window.addEventListener("resize", resize);
        window.addEventListener("pointerdown", onPointer, { passive: true });
        B.addEventListener("pointerdown", onPointer, { passive: true });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointerdown", onPointer);
            B.removeEventListener("pointerdown", onPointer);
            try { root.removeChild(B); } catch {}
        };
        
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden
            style={{
                position: "fixed",
                left: 0,
                right: 0,
                top: "calc(var(--swirlShiftY, 0vh))",
                bottom: "calc(-1 * var(--swirlShiftY, 0vh))",
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}

export default React.memo(AmbientSwirlBackgroundImpl, (p, n) => p.shiftUp === n.shiftUp);
