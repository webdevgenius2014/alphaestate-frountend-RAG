"use client";

import { useEffect, useRef } from "react";
import { AnimatedNumber } from "../dashboard/animated-number";
import { stats } from "@/app/constant";

export const AboutSection = () => {
    const textRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el  = textRef.current;
        const glow = glowRef.current;
        if (!el) return;

        const onScroll = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.65)));

            el.style.backgroundPosition = `${100 - progress * 100}% 0`;

            if (glow) {
                const yOff  = 15  + progress * 35;
                const blur  = 20  + progress * 500;
                const alpha = 0.33 + progress * 0.40;
                glow.style.boxShadow = `0 -${yOff}px ${blur}px rgba(210,138,68,${alpha})`;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="relative -mx-7.5">

            <style>{`
                .text-fill {
                    background: linear-gradient(90deg, #ffffff 50%, #333333 50%);
                    background-size: 200% 100%;
                    background-position: 100% 0;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
            `}</style>

            <video
                src="/particales-bg.mp4"
                className="w-full h-full object-cover absolute inset-0"
                autoPlay
                loop
                muted
                playsInline />

            <div className="bg-[linear-gradient(180deg,#010C1B_0%,rgba(1,23,53,0.9)_100%)] absolute inset-0" />

            <section className="w-full max-w-345 relative mx-auto pb-20 pt-40.75 px-4 flex flex-col items-center">

                <div className="inline-flex items-center relative z-1 gap-2 border border-[#0E2445] rounded-full px-9.25 py-4 mb-7.75 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                    <span className="text-white text-base uppercase font-normal leading-6">About Alpha Estate</span>
                </div>
                <div className="absolute top-26">
                    <div
                        ref={glowRef}
                        className="w-72.25 h-35 bg-[linear-gradient(180deg,#010D1E_0%,#010F21_100%)] rounded-t-full"
                        style={{
                            boxShadow: "0 -15px 21px rgba(210,138,68,0.63)",
                            clipPath: "inset(-1000px -1000px 0 -1000px)",
                        }}
                    />
                </div>

                <p className="text-center text-[22px] md:text-[26px] lg:text-[28px] leading-12.5 font-normal max-w-289 mb-13.5">
                    <span className="text-white">
                        Alpha Estate combines AI-powered market intelligence, district analytics, and real-time property insights to{" "}
                    </span>
                    <span ref={textRef} className="text-fill">
                        help investors identify opportunities, evaluate risks, and make confident real estate decisions faster.
                    </span>
                </p>

                <div className="flex items-center justify-center w-full max-w-248.75">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1 gap-1.5">
                                <AnimatedNumber value={stat.value} className="text-white text-[36px] md:text-[43px] font-semibold leading-12.5" />
                                <span className="text-[#FFFFFF99] text-[15px] font-light leading-7">{stat.label}</span>
                            </div>
                            {i < stats.length - 1 && (
                                <div className="h-20.75 border-r-2 [border-image-source:linear-gradient(180deg,#03142E_0%,#224A87_50%,#03142E_100%)] [border-image-slice:1] shrink-0" />
                            )}
                        </div>
                    ))}
                </div>

            </section>
        </div>
    );
};
