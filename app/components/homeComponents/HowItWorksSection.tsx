"use client";

import { useEffect, useState } from "react";
import { steps } from "@/app/constant";

export const HowItWorksSection = () => {
    const [completedIndex, setCompletedIndex] = useState(-1);

    useEffect(() => {
        const observers = steps.map((step, i) => {
            const el = document.getElementById(step.id);
            if (!el) return null;
            const io = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    // Scrolled into view — mark this and all above as completed
                    setCompletedIndex((prev) => Math.max(prev, i));
                } else if (entry.boundingClientRect.top > 0) {
                    // Exited below viewport — user scrolled back up past this step
                    setCompletedIndex((prev) => Math.min(prev, i - 1));
                }
            }, { threshold: 0.3 });
            io.observe(el);
            return io;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <>
            <div className="bg-[linear-gradient(180deg,#011735E5_0%,#010C1B_100%)] xl:-mx-7.5 relative lg:overflow-visible overflow-hidden">
                <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#12458D99] blur-[144px] z-0 hiw-blob" />
                <section className="w-full max-w-345 mx-auto px-4 py-20 relative z-1">
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_42%] gap-16 items-start">

                        {/* ── Left: sticky panel ── */}
                        <div className="lg:sticky top-30 self-start flex flex-col">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 border border-[#0E2445] rounded-full px-9.25 py-4 mb-5.5 self-start bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                                <span className="text-white text-base uppercase font-normal leading-6">How It Works</span>
                            </div>

                            {/* Heading */}
                            <h2 className="text-white text-[28px] md:text-[36px] font-semibold md:leading-[100%] mb-4">
                                From Data to Smarter <br /> Investments
                            </h2>

                            {/* Description */}
                            <p className="text-white/50 text-[15px] leading-7 font-light mb-7.5 max-w-152.75">
                                Alpha Estate transforms raw property data into actionable intelligence — giving investors a clear edge in the UAE real estate market.
                            </p>

                            {/* Nav dots */}
                            <div className="flex flex-col gap-3.75">
                                {steps.map((step, i) => {
                                    const isDone = i < completedIndex;
                                    const isCurrent = i === completedIndex;
                                    const isActive = isDone || isCurrent;
                                    return (
                                        <button
                                            key={step.id}
                                            type="button"
                                            onClick={() => scrollTo(step.id)}
                                            className="flex items-center gap-2 text-left group"
                                        >
                                            <div className="flex items-center shrink-0">
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isDone
                                                        ? "bg-white"
                                                        : isCurrent
                                                            ? "bg-white shadow-[0_0_8px_#D28A4488]"
                                                            : "bg-[#FFFFFF33] group-hover:bg-white/30"
                                                    }`} />
                                            </div>
                                            <span className={`text-base font-normal transition-colors duration-300 ${isActive ? "text-white" : "text-[#FFFFFF33] group-hover:text-white/60"}`}>
                                                {step.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-7.5">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    id={step.id}
                                    className="rounded-[30px] p-5 overflow-hidden border border-[#272727]"
                                >
                                    {/* Image */}
                                    <div className="w-full h-70.25 rounded-[30px] bg-[#0B1F3A] relative overflow-hidden">
                                        <video
                                            src={step.video}
                                            className="w-full h-full object-cover opacity-80"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="w-full mt-3 max-w-120">
                                        <span className="text-base leading-8.25 font-medium text-[#D28A44] mb-px">
                                            {step.badge}
                                        </span>
                                        <h3 className="text-white text-[19px] leading-8.25 font-medium mb-1.25">{step.title}</h3>
                                        <p className="text-[#FFFFFF99] text-[14px] leading-6.75 font-light">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            </div>

            <style>{`
            @keyframes hiwRectOrbit {
                0%   { transform: translate(0px,    0px);   }
                25%  { transform: translate(500px,  1000px); }
                50%  { transform: translate(-600px, 1100px); }
                75%  { transform: translate(-300px, 0px);   }
                100% { transform: translate(0px,    0px);   }
            }
            .hiw-blob {
                animation: hiwRectOrbit 12s ease-in-out infinite;
            }
        `}</style>
        </>
    );
};
