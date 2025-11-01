"use client";

import styles from "./About.module.css";

export default function Contact() {
    return (
        <section className={styles.wrap}>
            <div className={styles.card}>
                <p className={styles.line} style={{ ["--d" as any]: "0ms" }}>
                    Contact
                </p>

                <p className={styles.copy}>
                    You can reach me at{" "}
                    <a href="mailto:baturalpunlu02@hotmail.com" className={styles.link}>
                        baturalpunlu02@hotmail.com
                    </a>
                    , or connect with me on{" "}
                    <a
                        href="https://www.linkedin.com/in/baturalp-unlu"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                    >
                        LinkedIn
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://github.com/bunlu3"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                    >
                        GitHub
                    </a>.
                </p>
            </div>
        </section>
    );
}
