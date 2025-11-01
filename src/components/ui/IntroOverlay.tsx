"use client";
import styles from "./IntroOverlay.module.css";
import SwapText from "@/components/ui/SwapText";

type Props = {
    show: boolean;
    isLeaving?: boolean;
    onAbout?: () => void;
};

export default function IntroOverlay({ show, isLeaving = false, onAbout }: Props) {
    return (
        <div
            className={[
                styles.root,
                show ? styles.show : "",
                isLeaving ? styles.rootLeaving : "",
            ].join(" ")}
            aria-hidden={!show}
            style={
                {
                    ["--logosDelay" as any]: "140ms",
                    ["--linksDelay" as any]: "380ms",
                } as React.CSSProperties
            }
        >
            <div className={styles.card}>
                <div className={styles.heroLogos} aria-hidden>
                    <img src="/images/olympic.svg" alt="" className={`${styles.logo} ${styles.logoOlympic}`} />
                    <img src="/images/gt.svg"       alt="" className={`${styles.logo} ${styles.logoGT}`} />
                </div>

                <p className={styles.line} style={{ ["--d" as any]: "0ms" }}>Baturalp&nbsp;Ünlü</p>
                <p className={styles.line} style={{ ["--d" as any]: "120ms" }}>2024 Graduate · Georgia&nbsp;Tech</p>
                <p className={styles.line} style={{ ["--d" as any]: "240ms" }}>
                    Full-Stack SWE @ <span className={styles.brand}>NCR&nbsp;Voyix</span>
                </p>

                <div className={styles.links} style={{ ["--linksDelay" as any]: "380ms" }}>
                    <a
                        className={`${styles.btn} swap-animate pointer-events-auto`}
                        style={{ ["--i" as any]: 0 }}
                        href="https://www.linkedin.com/in/baturalp-unlu"
                        target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    >
                        <img src="/images/linkedin.svg" alt="" className={`${styles.icon} ${styles.linkedinIconFix}`} aria-hidden />
                        <SwapText text="LinkedIn" />
                    </a>

                    <a
                        className={`${styles.btn} swap-animate pointer-events-auto`}
                        style={{ ["--i" as any]: 1 }}
                        href="https://github.com/bunlu3"
                        target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    >
                        <img src="/images/github.svg" alt="" className={`${styles.icon} ${styles.githubLogoFix}`} aria-hidden />
                        <SwapText text="GitHub" />
                    </a>

                    <a
                        className={`${styles.btn} swap-animate pointer-events-auto`}
                        style={{ ["--i" as any]: 2 }}
                        href="https://en.wikipedia.org/wiki/Baturalp_%C3%9Cnl%C3%BC"
                        target="_blank" rel="noopener noreferrer" aria-label="Wikipedia"
                    >
                        <img src="/images/wikipedia.svg" alt="" className={styles.icon} aria-hidden />
                        <SwapText text="Wikipedia" />
                    </a>
                </div>

                <div className={styles.aboutRow}>
                    <button
                        type="button"
                        className={`${styles.primaryBtn} swap-animate pointer-events-auto no-whirlpool`}
                        onClick={onAbout}
                        aria-label="Click to continue"
                    >
                        <SwapText text="click to continue" />
                        <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden>
                            <path fill="currentColor" d="M7 12h8l-3.3-3.3 1.4-1.4L19.8 14l-6.7 6.7-1.4-1.4L15 15H7z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
