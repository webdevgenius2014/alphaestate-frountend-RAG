"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Button from "../ui/button";
import { ArrowIcon, navLinks } from "@/app/constant";

const SPEED = 0.06;

export const Footer = () => {
    const [email, setEmail] = useState("");
    const swiperRef   = useRef<SwiperType | null>(null);
    const dirRef      = useRef<1 | -1>(1);
    const isPausedRef = useRef(false);

    useEffect(() => {
        let rafId: number;
        let prev: number | null = null;

        const tick = (ts: number) => {
            if (prev !== null && !isPausedRef.current) {
                const s = swiperRef.current;
                if (s && s.snapGrid && s.snapGrid.length > 0) {
                    const delta    = ts - prev;
                    const current  = s.getTranslate();
                    const endPos   = -s.snapGrid[s.snapGrid.length - 1];
                    const startPos = -s.snapGrid[0];

                    let next = current - delta * SPEED * dirRef.current;

                    if (next <= endPos) { next = endPos; dirRef.current = -1; }
                    else if (next >= startPos) { next = startPos; dirRef.current = 1; }

                    s.setTranslate(next);
                    s.updateProgress();
                }
            }
            prev = isPausedRef.current ? null : ts;
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <footer className="bg-linear-to-b from-[#031532] to-[#000C1CD9] xl:-mx-7.5 overflow-hidden">
            <div className="w-full max-w-345 mx-auto px-4 pt-20 pb-0">
                {/* Main row */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between">
                    {/* Left: newsletter */}
                    <div className="max-w-150.5 w-full">
                        <p className="text-white text-[21px] leading-[100%] font-light mb-2">Stay connected®</p>
                        <a
                            href="mailto:support@alphaestate.ai"
                            className="block text-white text-[26px] md:text-[33px] font-medium leading-tight mb-4 hover:text-[#D28A44] transition-colors duration-200"
                        >
                            support@alphaestate.ai
                        </a>
                        <p className="text-[#FFFFFF99] text-[14px] font-light leading-6 mb-6.5 max-w-127">
                            Alpha Estate combines technology and real transaction data to bring clarity and confidence to every investment decision.
                        </p>

                        {/* Subscribe input */}
                        <div className="flex gap-3 flex-wrap items-center">
                            <input
                                type="email"
                                placeholder="Enter Your Email Address.."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 min-w-80 bg-transparent border border-[#FFFFFF80] rounded-full px-6.75 py-3 h-15.5 text-white text-[13px] placeholder:text-[#4F5B66] focus:outline-none focus:border-[#D28A4466] transition-colors duration-200"
                            />
                            <Button variant="white" className="px-4! py-4.5! text-[14px]! font-semibold! uppercase! max-w-57! rounded-full!">
                                Subscribe Now
                            </Button>
                        </div>
                    </div>

                    {/* Right: nav links */}
                    <div className="flex flex-col gap-0 md:min-w-115">
                        {navLinks.map((link, i) => (
                            <button
                                key={link.num}
                                type="button"
                                onClick={() => {
                                    const id = link.href.replace("#", "") || "home";
                                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                className="flex items-center justify-between py-3.5 group transition-colors duration-200 border-t border-[#102543] w-full text-left"
                            >
                                <span className={`text-[15px] font-normal group-hover:text-[#D28A44] transition-colors duration-200 ${i === 0 ? "text-white" : "text-[#515C6E]"}`}>
                                    <span className="mr-2">{link.num} /</span>
                                    {link.label}
                                </span>
                                <span className={`${i === 0 ? "text-white" : "text-[#515C6E]"}`}>
                                    <ArrowIcon />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className="relative mt-15 py-6.25 border-t border-b border-[#10294E] select-none"
                    onMouseEnter={() => { isPausedRef.current = true; }}
                    onMouseLeave={() => { isPausedRef.current = false; }}
                >
                    <Swiper
                        onSwiper={(s) => { swiperRef.current = s; }}
                        slidesPerView="auto"
                        allowTouchMove={false}
                        className="footer-marquee overflow-visible!"
                    >
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                            <SwiperSlide key={n} style={{ width: "auto" }}>
                                <p className="text-[80px] md:text-[90px] lg:text-[105px] font-extrabold leading-none text-[#FFFFFF4D] whitespace-nowrap pr-36.75">
                                    ALPHA ESTATE
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <style>{`
                    .footer-marquee .swiper-wrapper {
                        transition-duration: 0ms !important;
                    }
                `}</style>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 pb-7">
                    <p className="text-[#4F5B66] text-[16px] font-light">
                        © Copyright 2026, Alpha Estate   |   All Rights Reserved
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-4 text-[#4F5B66] text-[16px] font-light">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="hover:text-white transition-colors duration-200">Terms and Conditions</Link>
                        </div>
                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#D28A44] flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M9 2.33H10.5V0H8.5C6.84 0 5.5 1.34 5.5 3V5H3.5V7.33H5.5V14H8V7.33H9.8L10.17 5H8V3C8 2.63 8.27 2.33 8.6 2.33H9Z" fill="white" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#D28A44] flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <rect x="1" y="1" width="12" height="12" rx="3" stroke="white" strokeWidth="1.3" />
                                    <circle cx="7" cy="7" r="2.5" stroke="white" strokeWidth="1.3" />
                                    <circle cx="10.5" cy="3.5" r="0.7" fill="white" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#D28A44] flex items-center justify-center hover:opacity-80 transition-opacity duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <g clipPath="url(#clip0_1_1729)">
                                        <path d="M3.59451 12.1736H1.07059V4.04592H3.59451V12.1736ZM2.33119 2.93723C1.52413 2.93723 0.869507 2.26875 0.869507 1.46168C0.869507 1.07402 1.02351 0.702236 1.29762 0.428117C1.57174 0.153998 1.94353 0 2.33119 0C2.71885 0 3.09064 0.153998 3.36476 0.428117C3.63888 0.702236 3.79288 1.07402 3.79288 1.46168C3.79288 2.26875 3.13798 2.93723 2.33119 2.93723ZM13.0407 12.1736H10.5222V8.21712C10.5222 7.27418 10.5032 6.06494 9.21 6.06494C7.89777 6.06494 7.69668 7.0894 7.69668 8.14918V12.1736H5.17548V4.04592H7.59614V5.15462H7.63146C7.96842 4.51603 8.79152 3.84212 10.0195 3.84212C12.5739 3.84212 13.0434 5.52418 13.0434 7.70897V12.1736H13.0407Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1_1729">
                                            <rect width="13.913" height="13.913" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
