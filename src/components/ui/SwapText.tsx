"use client";
import React from "react";

type Props = {
    text: string;
    className?: string;
};

export default function SwapText({ text, className = "" }: Props) {
    const glyphs = Array.from(text).map((ch) => (ch === " " ? "\u00A0" : ch));

    return (
        <span className={`swap ${className}`}>
      {glyphs.map((ch, i) => (
          <span
              key={i}
              className="swap__char"
              style={{ ["--ci" as any]: i }}
          >
          <span className="swap__front">{ch}</span>
          <span className="swap__back">{ch}</span>
        </span>
      ))}
    </span>
    );
}
