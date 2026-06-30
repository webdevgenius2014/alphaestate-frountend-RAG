"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Stars, testimonials } from "@/app/constant";


const SPEED = 0.05; // px per ms

export const TestimonialsSection = () => {
    const swiperRef = useRef<SwiperType | null>(null);
    const dirRef = useRef<1 | -1>(1);
    const isPausedRef = useRef(false);
    const [panelReady, setPanelReady] = useState(false);

    useEffect(() => {
        const init = setTimeout(() => setPanelReady(true), 80);
        const t = setInterval(() => setPanelReady(prev => !prev), 2000);
        return () => { clearTimeout(init); clearInterval(t); };
    }, []);

    useEffect(() => {
        let rafId: number;
        let prev: number | null = null;

        const tick = (ts: number) => {
            if (prev !== null && !isPausedRef.current) {
                const s = swiperRef.current;
                if (s && s.snapGrid && s.snapGrid.length > 0) {
                    const delta = ts - prev;
                    const current = s.translate;
                    const endPos = -s.snapGrid[s.snapGrid.length - 1];
                    const startPos = -s.snapGrid[0];

                    let next = current - delta * SPEED * dirRef.current;

                    if (next <= endPos) {
                        next = endPos;
                        dirRef.current = -1;
                    } else if (next >= startPos) {
                        next = startPos;
                        dirRef.current = 1;
                    }

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
        <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(2,17,37,0.9)_0%,#010C1B_100%)] -mx-7.5 relative overflow-hidden">

            <img src="/large-globe.svg" alt="" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className={`absolute top-100 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 w-full pointer-events-none transition-opacity duration-1200 ease-linear ${panelReady ? "opacity-100" : "opacity-100"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1574 626" fill="none" className="w-full h-full">
                    <g filter="url(#filter0)">
                        <path
                            d="M0 371.142C157.779 275.922 543.058 87.8787 821.938 97.4673C1011.27 90.4756 1413.56 159.194 1508 490"
                            stroke="#0E2445"
                            strokeWidth="80"
                            strokeLinecap="round"
                            strokeDasharray="2000"
                            strokeDashoffset={panelReady ? 0 : 2000}
                            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.23,1,0.32,1)" }}
                        />
                    </g>
                    <g filter="url(#filter1)">
                        <path
                            d="M0 425.054C157.779 340.979 543.058 174.946 821.938 183.413C1011.27 177.239 1413.56 237.914 1508 530"
                            stroke="#3671C9"
                            strokeOpacity="0.4"
                            strokeWidth="80"
                            strokeLinecap="round"
                            strokeDasharray="2000"
                            strokeDashoffset={panelReady ? 0 : 2000}
                            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.23,1,0.32,1) 0.15s" }}
                        />
                    </g>

                    <defs>
                        <filter id="filter0" x="-150" y="-100" width="1900" height="800" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
                        </filter>
                        <filter id="filter1" x="-150" y="-50" width="1900" height="750" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
                        </filter>
                        <clipPath id="clip0">
                            <rect width="1574" height="626" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <section className="w-full max-w-345 mx-auto px-4 pt-24 pb-60 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex items-center gap-2 border border-[#0E2445] rounded-full px-9.25 py-4 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                        <span className="text-white text-base uppercase font-normal leading-6">Client Testimonials</span>
                    </div>
                </div>

                <h2 className="text-center text-white text-[32px] md:text-[36px] font-semibold leading-[100%] mb-8.5">
                    Trusted by Investors Seeking Smarter Decisions
                </h2>

                <div
                    onMouseEnter={() => { isPausedRef.current = true; }}
                    onMouseLeave={() => { isPausedRef.current = false; }}
                >
                    <Swiper
                        onSwiper={(s) => { swiperRef.current = s; }}
                        slidesPerView={1.2}
                        spaceBetween={20}
                        allowTouchMove={false}
                        breakpoints={{
                            768: { slidesPerView: 2.2, spaceBetween: 20 },
                            1024: { slidesPerView: 3.2, spaceBetween: 20 },
                        }}
                        className="testimonials-marquee"
                    >
                        {testimonials.map((t, i) => (
                            <SwiperSlide key={i}>
                                <div className="flex flex-col h-full bg-[#05132733] border border-[#272727] rounded-[30px] p-6.25">
                                    <Stars rating={t.rating} />
                                    <p className="text-white text-[15px] leading-6 font-light flex-1 mb-22">
                                        "{t.quote}"
                                    </p>
                                    <div className="flex items-center gap-3.5">
                                        <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                                        <div>
                                            <p className="text-white text-base font-medium leading-8.25">{t.name}</p>
                                            <p className="text-[#FFFFFF99] text-[14px] font-light leading-8.25">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <style>{`
                .testimonials-marquee .swiper-wrapper {
                    transition-duration: 0ms !important;
                }
            `}</style>
        </div>
    );
};
