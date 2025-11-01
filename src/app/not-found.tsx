"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main
            style={{
                display: "grid",
                placeItems: "center",
                minHeight: "100vh",
                background: "hsl(210 50% 6%)",
                color: "hsl(190 100% 92%)",
                textAlign: "center",
                padding: "2rem",
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: "clamp(2.5rem, 6vw, 5rem)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                    }}
                >
                    404 — Page Not Found
                </h1>
                <p
                    style={{
                        opacity: 0.8,
                        fontSize: "clamp(1rem, 2vw, 1.25rem)",
                        marginBottom: "2rem",
                    }}
                >
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <Link
                    href="/"
                    style={{
                        display: "inline-block",
                        padding: ".75rem 1.5rem",
                        borderRadius: "999px",
                        background:
                            "linear-gradient(180deg, hsl(205 70% 14% / .8), hsl(205 60% 10% / .8))",
                        border: "1px solid hsl(195 70% 40% / .25)",
                        color: "hsl(190 100% 92%)",
                        fontWeight: 600,
                        textDecoration: "none",
                        boxShadow:
                            "0 10px 30px hsl(195 90% 40% / .10), inset 0 1px 0 hsl(0 0% 100% / .06)",
                    }}
                >
                    Go Back Home
                </Link>
            </div>
        </main>
    );
}
