"use client";

import { useState } from "react";
import { features } from "@/app/constant";

function AccordionItem({
    num,
    title,
    description,
    image,
    isOpen,
    onToggle,
    isLast,
}: {
    num: string;
    title: string;
    description: string;
    image?: string;
    isOpen: boolean;
    onToggle: () => void;
    isLast: boolean;
}) {
    return (
        <div className="border-b border-[#FFFFFF33]">
            <button
                type="button"
                onClick={onToggle}
                className="w-full grid grid-cols-[270px_auto_auto] items-center gap-8 py-7 group text-left"
            >
                <span className={`shrink-0 pl-10.75 text-[33px] font-semibold transition-colors duration-300 ${isOpen ? "text-[#D28A44]" : "text-white"}`}>
                    {num}
                </span>

                <span className={`text-[21px] font-semibold leading-[100%] transition-colors duration-300 ${isOpen ? "text-white" : "text-[#FFFFFFCC]"}`}>
                    {title}
                </span>

                <div className={`shrink-0 ml-auto w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#D28A44] border-[#D28A44] rotate-45" : "border-[#FFFFFF33] group-hover:bg-[#D28A44] group-hover:border-[#D28A44]"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="17.5" transform="rotate(-90 18 18)" stroke="white" />
                        <path d="M27.7071 18.7071C28.0976 18.3166 28.0976 17.6834 27.7071 17.2929L21.3431 10.9289C20.9526 10.5384 20.3195 10.5384 19.9289 10.9289C19.5384 11.3195 19.5384 11.9526 19.9289 12.3431L25.5858 18L19.9289 23.6569C19.5384 24.0474 19.5384 24.6805 19.9289 25.0711C20.3195 25.4616 20.9526 25.4616 21.3431 25.0711L27.7071 18.7071ZM10 18L10 19L27 19L27 18L27 17L10 17L10 18Z" fill="white" />
                    </svg>
                </div>
            </button>

            <div style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 400ms cubic-bezier(0.4,0,0.2,1)",
            }}>
                <div style={{ overflow: "hidden" }}>
                    <div className="pb-10 pt-7 border-t border-[#FFFFFF33]">
                        <div className="flex items-start justify-between gap-5 w-full">
                            <h3 className="text-white  pl-10.75 text-[28px] font-bold leading-tight shrink-0">{title}</h3>

                            <div className="relative rounded-3xl bg-[#0B1F3A] border-5 border-[#FFFFFF33] overflow-hidden p-2 shrink-0">
                                <div className="rounded-2xl overflow-hidden bg-[#060F1E] w-87.5 h-100">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                    />
                                </div>
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFFFFF22]" />
                            </div>

                            <p className="text-[#FFFFFF99] text-[18px] max-w-95.75 w-full leading-8.25 font-light">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const FeaturesSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

    return (
        <section className="w-full relative max-w-345 mx-auto px-4 pb-24 pt-27.5">

            <video
                src="/acordion-bg.mp4"
                className="w-full h-full object-cover absolute inset-0"
                autoPlay
                loop
                muted
                playsInline />

            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(2,17,37,0.9)_0%,#010C1B_100%)] absolute inset-0" />

            <div className="relative z-1">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center gap-2 border border-[#0E2445] rounded-full px-9.25 py-4 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                        <span className="text-white text-base uppercase font-normal leading-6">Features</span>
                    </div>
                </div>

                <h2 className="text-center text-white text-[32px] md:text-[36px] font-semibold leading-[110%] mb-14.75">
                    Everything You Need to Invest Smarter
                </h2>

                <div className="max-w-301 mx-auto">
                    {features.map((f, i) => (
                        <AccordionItem
                            key={f.num}
                            {...f}
                            isOpen={openIndex === i}
                            onToggle={() => toggle(i)}
                            isLast={i === features.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
