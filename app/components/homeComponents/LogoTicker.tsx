"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { logos } from "@/app/constant";


const SPEED = 0.06; // px per ms

export const LogoTicker = () => {
    const swiperRef   = useRef<SwiperType | null>(null);
    const dirRef      = useRef<1 | -1>(1);
    const isPausedRef = useRef(false);

    useEffect(() => {
        let rafId: number;
        let prev: number | null = null;

        const tick = (ts: number) => {
            if (prev !== null && !isPausedRef.current) {
                const s = swiperRef.current;
                if (s && s.wrapperEl && s.el) {
                    const delta    = ts - prev;
                    const current  = s.translate;
                    const endPos   = -((s.wrapperEl as HTMLElement).scrollWidth - (s.el as HTMLElement).offsetWidth);
                    const startPos = 0;
                    let next = current - delta * SPEED * dirRef.current;

                    if (next <= endPos) {
                        next = endPos;
                        dirRef.current = -1;
                    } else if (next >= startPos) {
                        next = startPos;
                        dirRef.current = 1;
                    }

                    s.setTranslate(next);
                }
            }
            prev = isPausedRef.current ? null : ts;
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="w-full max-w-345 overflow-hidden mx-auto pt-27.5">

            <p className="text-center text-white text-[23px] lg:leading-6 font-normal px-4 mb-10.5">
                Trusted By Investors. Powered By Market Intelligence.
            </p>

            <div
                className="relative"
                onMouseEnter={() => { isPausedRef.current = true; }}
                onMouseLeave={() => { isPausedRef.current = false; }}
            >
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #010C1B, transparent)" }} />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #010C1B, transparent)" }} />

                <Swiper
                    onSwiper={(s) => { swiperRef.current = s; }}
                    slidesPerView="auto"
                    allowTouchMove={false}
                    className="logo-ticker overflow-visible!"
                >
                    {logos.map((logo, i) => (
                        <SwiperSlide key={i} style={{ width: "auto" }} className="flex! items-center px-14">
                            <div className="flex items-center">
                                <img src={logo} alt="" className="max-h-9 w-auto object-contain" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style>{`
                .logo-ticker {
                    pointer-events: none;
                }
                .logo-ticker .swiper-wrapper {
                    transition-duration: 0ms !important;
                }
            `}</style>
        </div>
    );
};
