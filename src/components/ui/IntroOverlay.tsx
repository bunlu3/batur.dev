"use client";
import styles from "./IntroOverlay.module.css";

type Props = { show: boolean };

const linkedinIconFix = styles.linkedinIconFix;
const githubLogoFix = styles.githubLogoFix;

export default function IntroOverlay({ show }: Props) {
    return (
        <div className={[styles.root, show ? styles.show : ""].join(" ")} aria-hidden>
            <div className={styles.card}>
                {/* badges row */}
                <div className={styles.badges} aria-hidden>
                    <img
                        src="/images/olympic.svg"
                        alt=""
                        className={styles.badge}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://placehold.co/40x40/000000/ffffff?text=O";
                        }}
                    />
                    <img
                        src="/images/gt.svg"
                        alt=""
                        className={styles.badge}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://placehold.co/40x40/000000/ffffff?text=GT";
                        }}
                    />
                </div>

                <p className={styles.line} style={{ ["--d" as any]: "0ms" }}>
                    Baturalp&nbsp;Ünlü
                </p>
                <p className={styles.line} style={{ ["--d" as any]: "120ms" }}>
                    2024 Graduate · Georgia&nbsp;Tech
                </p>
                <p className={styles.line} style={{ ["--d" as any]: "240ms" }}>
                    Full-Stack SWE @ <span className={styles.brand}>NCR&nbsp;Voyix</span>
                </p>

                <div className={styles.links} style={{ ["--linksDelay" as any]: "380ms" }}>
                    <a
                        className={styles.btn + " pointer-events-auto"}
                        style={{ ["--i" as any]: 0 }}
                        href="https://www.linkedin.com/in/baturalp-unlu"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile"
                    >
                        <img
                            src="/images/linkedin.svg"
                            alt=""
                            className={`${styles.icon} ${linkedinIconFix}`}
                            aria-hidden
                        />
                        <span className={styles.label}>LinkedIn</span>
                    </a>

                    <a
                        className={styles.btn + " pointer-events-auto"}
                        style={{ ["--i" as any]: 1 }}
                        href="https://github.com/baturunlu"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                    >
                        <img
                            src="/images/github.svg"
                            alt=""
                            className={`${styles.icon} ${githubLogoFix}`}
                            aria-hidden
                        />
                        <span className={styles.label}>GitHub</span>
                    </a>

                    <a
                        className={styles.btn + " pointer-events-auto"}
                        style={{ ["--i" as any]: 2 }}
                        href="https://en.wikipedia.org/wiki/Baturalp_%C3%9Cnl%C3%BC"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Wikipedia page"
                    >
                        <img src="/images/wikipedia.svg" alt="" className={styles.icon} aria-hidden />
                        <span className={styles.label}>Wikipedia</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
