"use client";

import { useAnimSync } from "./use-anim-sync";

function DigitRoller({ digit, active }: { digit: number; active: boolean }) {
    return (
        <span
            style={{
                display: "inline-block",
                overflow: "hidden",
                height: "1em",
                verticalAlign: "bottom",
            }}
        >
            <span
                style={{
                    display: "flex",
                    flexDirection: "column",
                    transform: active ? `translateY(-${digit}em)` : "translateY(0)",
                    transition: active
                        ? `transform 2000ms cubic-bezier(0.22, 1, 0.36, 1)`
                        : "none",
                }}
            >
                {Array.from({ length: 10 }, (_, i) => (
                    <span
                        key={i}
                        style={{ display: "block", height: "1em", lineHeight: "1em" }}
                    >
                        {i}
                    </span>
                ))}
            </span>
        </span>
    );
}

export function AnimatedNumber({ value, className = "" }: { value: string; className?: string }) {
    const active = useAnimSync();
    const chars = value.split("");

    return (
        <span className={className} style={{ display: "inline-flex", alignItems: "flex-end" }}>
            {chars.map((ch, i) =>
                /\d/.test(ch) ? (
                    <DigitRoller key={i} digit={parseInt(ch, 10)} active={active} />
                ) : (
                    <span key={i} style={{ lineHeight: "1em" }}>{ch}</span>
                )
            )}
        </span>
    );
}
