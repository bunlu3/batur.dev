"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useTexture } from "@react-three/drei";
import useSectionProgress from "@/hooks/useSectionProgress";
import SceneGateOverlay from "@/components/sections/EarthScrollSection/SceneGateOverlay";
import SwapText from "@/components/ui/SwapText";

const TURKEY_LAT = 39.0;
const TURKEY_LON = 35.0;
const LON_OFFSET_DEG = -165; 
const LAT_OFFSET_DEG = -20;  
const ROLL_OFFSET_DEG = -35; 
const FLIP_LON = false;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, t: number) => {
    const x = clamp01((t - a) / (b - a));
    return x * x * (3 - 2 * x);
};
function latLonToVector(latDeg: number, lonDeg: number) {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const x = Math.cos(lat) * Math.cos(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.sin(lon);
    return new THREE.Vector3(x, y, z).normalize();
}

function Earth({ progress, onReady }: { progress: number; onReady?: () => void }) {
    const groupRef = useRef<THREE.Group>(null!);
    const globeRef = useRef<THREE.Mesh>(null!);
    const cloudsRef = useRef<THREE.Mesh>(null!);
    const { gl, scene, camera } = useThree();

    const tex = useTexture({
        color: "/textures/earth_color.jpg",
        bump: "/textures/earth_bump.jpg",
        night: "/textures/earth_night.jpg",
        clouds: "/textures/earth_clouds.jpg",
    });

    useEffect(() => {
        if (!tex.color || !tex.bump) return;
        requestAnimationFrame(() => {
            try {
                (gl as any).compile?.(scene, camera);
            } catch {}
        });
    }, [gl, scene, camera, tex.color, tex.bump]);

    useEffect(() => {
        const { color, bump, night, clouds } = tex;
        const maxAniso =
            (gl.capabilities as any).getMaxAnisotropy?.() ?? 8;

        if (color) {
            color.colorSpace = THREE.SRGBColorSpace;
            color.anisotropy = maxAniso;
            color.minFilter = THREE.LinearMipmapLinearFilter;
            color.magFilter = THREE.LinearFilter;
            color.generateMipmaps = true;
            color.needsUpdate = true;       
        }

        if (bump) {
            bump.anisotropy = maxAniso;
            bump.minFilter = THREE.LinearMipmapLinearFilter;
            bump.magFilter = THREE.LinearFilter;
            bump.generateMipmaps = true;
            bump.needsUpdate = true;         
        }

        if (night) {
            night.colorSpace = THREE.SRGBColorSpace;
            night.anisotropy = maxAniso;
            night.minFilter = THREE.LinearMipmapLinearFilter;
            night.magFilter = THREE.LinearFilter;
            night.generateMipmaps = true;
            night.needsUpdate = true;        
        }

        if (clouds) {
            clouds.anisotropy = Math.min(4, maxAniso);
            clouds.minFilter = THREE.LinearMipmapLinearFilter;
            clouds.magFilter = THREE.LinearFilter;
            clouds.generateMipmaps = true;
            clouds.needsUpdate = true;       
        }
    }, [gl, tex.color, tex.bump, tex.night, tex.clouds]);


    const earthMat = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                map: tex.color,
                bumpMap: tex.bump,
                bumpScale: 0.28,
                roughness: 0.95,
                metalness: 0.0,
                clearcoat: 0.15,
                clearcoatRoughness: 0.6,
                toneMapped: true,
            }),
        [tex.color, tex.bump]
    );

    const nightMat = useMemo(
        () =>
            tex.night
                ? new THREE.MeshBasicMaterial({
                    map: tex.night,
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    depthWrite: false,
                    opacity: THREE.MathUtils.clamp((progress - 0.35) * 1.6, 0, 0.85),
                })
                : null,
        [tex.night, progress]
    );

    const cloudsMat = useMemo(
        () =>
            tex.clouds
                ? new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    alphaMap: tex.clouds,
                    transparent: true,
                    depthWrite: false,
                    opacity: 0.75,
                })
                : null,
        [tex.clouds]
    );
    
    function quatFromLatLon(latDeg: number, lonDeg: number) {
        const lat = THREE.MathUtils.degToRad(latDeg + LAT_OFFSET_DEG);
        const lon = THREE.MathUtils.degToRad(lonDeg + LON_OFFSET_DEG);

        const base = new THREE.Euler(-lat, (FLIP_LON ? -1 : 1) * lon, 0, "YXZ");
        const q = new THREE.Quaternion().setFromEuler(base);

        const rollQ = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            THREE.MathUtils.degToRad(ROLL_OFFSET_DEG)
        );

        q.multiply(rollQ); 
        return q;
    }

    const qStart = useMemo(() => new THREE.Quaternion(), []);
    const qToTurkey = useMemo(
        () => quatFromLatLon(TURKEY_LAT, TURKEY_LON),
        [TURKEY_LAT, TURKEY_LON, LON_OFFSET_DEG, LAT_OFFSET_DEG, ROLL_OFFSET_DEG, FLIP_LON]
    );

    useFrame((_state, dt) => {
        // PHASE A
        const a = smoothstep(0.0, 0.6, progress);

        const qNow = new THREE.Quaternion().copy(qStart).slerp(qToTurkey, a);
        const spin = a * -0.05; // Reduced spin for better Turkey visibility
        qNow.multiply(
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin)
        );

        // PHASE B
        const b = smoothstep(0.6, 0.85, progress);
        const additionalRotation = b * 0.65;
        qNow.premultiply(
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), additionalRotation)
        );

        globeRef.current.quaternion.copy(qNow);

        // PHASE B
        const xTarget = THREE.MathUtils.lerp(0, -1.0, b);
        const yTarget = THREE.MathUtils.lerp(0, 0.1, b);
        groupRef.current.position.x = THREE.MathUtils.damp(
            groupRef.current.position.x,
            xTarget,
            6,
            dt
        );
        groupRef.current.position.y = THREE.MathUtils.damp(
            groupRef.current.position.y,
            yTarget,
            6,
            dt
        );

        // PHASE B
        const scaleTarget = THREE.MathUtils.lerp(1.0, 1.4, b);
        groupRef.current.scale.setScalar(
            THREE.MathUtils.damp(
                groupRef.current.scale.x,
                scaleTarget,
                6,
                dt
            )
        );

        if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.03;
    });

    useEffect(() => {
        const { color, bump } = tex;
        let done = false;
        const kick = () => {
            try { (gl as any).compile?.(scene, camera); } catch {}
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!done) {
                        done = true;
                        setTimeout(() => onReady?.(), 120);
                    }
                });
            });
        };

        if (color && bump) kick();

        return () => { done = true; };
    }, [gl, scene, camera, tex.color, tex.bump, tex.night, tex.clouds, onReady]);

    return (
        <group ref={groupRef}>
            <mesh ref={globeRef}>
                <sphereGeometry args={[1, 96, 96]} />
                <primitive object={earthMat} attach="material" />
            </mesh>

            {nightMat && (
                <mesh>
                    <sphereGeometry args={[1.001, 96, 96]} />
                    <primitive object={nightMat} attach="material" />
                </mesh>
            )}

            {cloudsMat && (
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[1.015, 72, 72]} />
                    <primitive object={cloudsMat} attach="material" />
                </mesh>
            )}
        </group>
    );
}

// ---------- Lights ----------
function Lights() {
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 2, 2]} intensity={1.3} />
            <directionalLight position={[-2.5, -1.5, -2]} intensity={0.55} />
        </>
    );
}

//camera
function AnimatedCamera({ progress }: { progress: number }) {
    const { camera } = useThree();
    useFrame((_s, dt) => {
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const p = ease(progress);
        const z = THREE.MathUtils.lerp(3.2, 2.0, p);
        const x = THREE.MathUtils.lerp(0, -0.5, p);  
        camera.position.lerp(new THREE.Vector3(x, 0, z), 4 * dt);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function EarthScrollSection() {
    const sectionId = "earth-section";
    const progress = useSectionProgress(sectionId);

    const pinHoldVh = 120;
    const sectionVh = 320 + pinHoldVh;
    const [globeReady, setGlobeReady] = React.useState(false);
    const [mountedAt] = React.useState(() => performance.now());

    const handleEarthReady = React.useCallback(() => {
        const elapsed = performance.now() - mountedAt;
        const MIN_MS = 2500;                
        const wait = Math.max(0, MIN_MS - elapsed);
        setTimeout(() => setGlobeReady(true), wait);
    }, [mountedAt]);

    // Phase C
    const overlayT = smoothstep(0.85, 1.0, progress);

    return (
        <section
            id={sectionId}
            style={{ position: "relative", height: `${sectionVh}vh`, pointerEvents: "none" }}
        >
            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}>
                <Canvas
                    dpr={[1, 1.75]}
                    gl={{ antialias: true, powerPreference: "high-performance" }}
                    camera={{ position: [0, 0, 3.2], fov: 45, near: 0.1, far: 100 }}
                >
                    <Suspense fallback={null}>
                        <Lights />
                        <AnimatedCamera progress={progress} />
                        <Earth
                            key={`${LON_OFFSET_DEG}-${LAT_OFFSET_DEG}-${ROLL_OFFSET_DEG}-${FLIP_LON}`}
                            progress={progress}
                            onReady={handleEarthReady}
                        />
                        <Preload all />
                    </Suspense>
                </Canvas>
            </div>

            <SceneGateOverlay show={!globeReady} />

            {/* Phase C DOM panel */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "min(6vw, 64px)",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        width: "min(560px, 42vw)",
                        transform: `translateX(${(1 - overlayT) * 40}px)`,
                        opacity: overlayT,
                        transition: "opacity 140ms linear",
                        pointerEvents: overlayT > 0.98 ? "auto" : "none",
                        background: "hsla(210, 30%, 8%, .55)",
                        border: "1px solid hsl(195 70% 40% / .25)",
                        borderRadius: 18,
                        padding: "20px 24px",
                        boxShadow:
                            "0 16px 80px hsl(210 60% 2% / .45), inset 0 1px 0 hsl(0 0% 100% / .05)",
                        backdropFilter: "blur(10px)",
                        textAlign: "center",
                    }}
                >
                    <div className="swap-animate soonTextWrap">
                        <SwapText text="COMING SOON..." className="soonText" />
                    </div>
                </div>
            </div>

            <div style={{ height: `${pinHoldVh}vh` }} aria-hidden />
        </section>
    );
}