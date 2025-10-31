"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setMounted(true);
        const root = document.documentElement;
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

        const shouldDark = stored ? stored === "dark" : prefersDark;
        setIsDark(shouldDark);
        root.classList.toggle("dark", shouldDark);
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        const root = document.documentElement;
        root.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (!mounted) {
        return (
            <button
                type="button"
                disabled
                className="rounded-full border border-slate-200 px-3 py-1 text-xs opacity-50 dark:border-slate-800"
            >
                Theme
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900"
            aria-label="Toggle theme"
        >
            {isDark ? "Dark" : "Light"}
        </button>
    );
}
