"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { MARKET_LOCATIONS, ArrowIcon } from "@/app/(user dashboard)/constants";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";

function TrendArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.28731 4.99392C5.28731 4.60272 5.60445 4.28558 5.99565 4.28558H12.0059H12.0062H12.0165C12.4077 4.28558 12.7248 4.60272 12.7248 4.99392V11.0147C12.7248 11.4059 12.4077 11.7231 12.0165 11.7231C11.6253 11.7231 11.3082 11.4059 11.3082 11.0147V6.69357L5.49478 12.5069C5.21816 12.7835 4.76966 12.7835 4.49304 12.5069C4.21643 12.2303 4.21643 11.7818 4.49304 11.5052L10.296 5.70224H5.99565C5.60445 5.70224 5.28731 5.38513 5.28731 4.99392Z" fill="currentColor" />
        </svg>
    );
}

const NAV_BTN = "flex w-5.5 h-5.5 justify-center items-center border border-(--db-toggle-border) text-[#D28A44] hover:bg-[#D28A44] hover:text-white hover:border-[#D28A44] rounded-[3px] transition-all ease-in-out shrink-0";

export function MarketSlider() {
    const swiperRef = useRef<SwiperInstance | null>(null);

    return (
        <div className="bg-(--db-sidebar-bg) h-full rounded-md p-5 flex flex-col gap-4">
            {/* header */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Live Market Overview</h2>
                    <p className="text-xs text-(--db-text-primary) mt-0.5 leading-4 max-w-98.75">
                        Track real-time property performance, district growth trends, and AI-powered market movement insights.
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={() => swiperRef.current?.slidePrev()} className={NAV_BTN}>
                        <ArrowIcon />
                    </button>
                    <button onClick={() => swiperRef.current?.slideNext()} className={`${NAV_BTN} rotate-180`}>
                        <ArrowIcon />
                    </button>
                </div>
            </div>

            {/* swiper */}
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop
                speed={500}
                spaceBetween={12}
                breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 12 },
                    768: { slidesPerView: 3, spaceBetween: 12 },
                }}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                className="w-full overflow-hidden!"
            >
                {MARKET_LOCATIONS.map((loc, i) => (
                    <SwiperSlide key={i}>
                        <div className="bg-(--db-main-bg) p-3.75 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5">
                                <img src="/favicon.ico" className="max-w-11 rounded-sm object-cover" alt="" />
                                <span className="text-sm md:text-[15px] font-medium text-(--db-text-primary) truncate">{loc.name}</span>
                            </div>
                            <div className="flex gap-3 items-center justify-between">
                                <AnimatedNumber value={loc.price} className="text-sm md:text-[21px] font-semibold text-(--db-text-primary)" />
                                <div className={`flex items-center gap-1 text-xs font-medium ${loc.up ? "text-green-600" : "text-red-500"}`}>
                                    <span className={`${loc.up ? "bg-[#5E9F621C] text-[#5E9F62]" : "bg-[#C46A6A33] text-[#CF2D48] -rotate-180"} w-6 h-6 rounded-full flex justify-center items-center`}>
                                        <TrendArrow />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* dot indicators */}
            {/* <div className="flex gap-1.5 justify-center">
                {MARKET_LOCATIONS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => swiperRef.current?.slideToLoop(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === activeIdx ? "bg-[#D28A44]" : "bg-(--db-border)"}`}
                    />
                ))}
            </div> */}
        </div>
    );
}
