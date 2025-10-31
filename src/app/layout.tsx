import "./globals.css";
import type { Metadata } from "next";
import { spaceGrotesk } from "./fonts";

export const metadata: Metadata = {
    title: "Baturalp Unlu — Software Engineer",
    description: "Personal website of Baturalp (Batur) Unlu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={spaceGrotesk.variable}>
        <body>{children}</body>
        </html>
    );
}