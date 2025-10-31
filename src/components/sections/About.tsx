"use client";
import styles from "./About.module.css";

export default function About() {
    return (
        <section className={`${styles.wrap} no-whirlpool`}>
            <div className={`${styles.card} no-whirlpool`}>
                {/* Headline with gradient style similar to IntroOverlay */}
                <p className={styles.line} style={{ ["--d" as any]: "0ms" }}>
                    About Baturalp
                </p>

                <p className={styles.copy}>
                    Former <strong>Olympic swimmer</strong> from <strong>Turkey</strong> turned
                    <strong> Full-stack Software Engineer</strong> in the U.S. I graduated from
                    <strong> Georgia Tech</strong> (B.S. CS — AI &amp; Media) and now build secure,
                    scalable multi-tenant SaaS at <strong>NCR Voyix</strong>: authentication,
                    developer tooling, and cloud platforms used by <strong>100K+ users</strong>.
                </p>
                <p className={styles.copy}>
                    International sport taught me precision, teamwork, and performance—skills I apply
                    daily to production systems. I blend engineering depth with visual craft to ship
                    faster, safer, more intuitive products.
                </p>

                <div className={styles.list}>
                    <div>
                        <span className={`${styles.dot} ${styles.dotCyan}`} />
                        Identity &amp; Home Platform · .NET + React + GCP
                    </div>
                    <div>
                        <span className={`${styles.dot} ${styles.dotSky}`} />
                        Okta · OAuth · LaunchDarkly flows · Distributed Caching
                    </div>
                    <div>
                        <span className={`${styles.dot} ${styles.dotInd}`} />
                        CI/CD Automation · DX Improvements · Clean UI Design
                    </div>
                </div>

                <div className={`${styles.chips} no-whirlpool`}>
                    <a
                        href="mailto:baturalpunlu02@hotmail.com"
                        className={styles.chip}
                    >
                        Contact
                    </a>
                    <a
                        href="https://github.com/bunlu3"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.chip}
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/baturalp-unlu"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.chip}
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://en.wikipedia.org/wiki/Baturalp_%C3%9Cnl%C3%BC"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.chip}
                    >
                        Wikipedia
                    </a>
                </div>
            </div>
        </section>
    );
}
