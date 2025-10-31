"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
    const [open, setOpen] = useState(false);
    const items = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur dark:border-slate-800/50 dark:bg-slate-950/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Link href="/" className="font-semibold tracking-tight">batur.dev</Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {items.map(i => (
                        <Link key={i.href} href={i.href} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                            {i.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>

                <button className="md:hidden" onClick={() => setOpen(v => !v)} aria-label="Menu">☰</button>
            </div>

            {open && (
                <div className="border-t border-slate-200 dark:border-slate-800 md:hidden">
                    <div className="mx-auto max-w-6xl px-6 py-3">
                        <div className="flex flex-col gap-2">
                            {items.map(i => (
                                <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-900">
                                    {i.label}
                                </Link>
                            ))}
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
