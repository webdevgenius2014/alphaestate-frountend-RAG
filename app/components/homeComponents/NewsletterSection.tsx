"use client";

import { infos, SendIcon } from "@/app/constant";

export const NewsletterSection = () => {
    return (
        <div className="relative -mx-7.5 overflow-hidden">

            <video
                src="/particales-bg.mp4"
                className="w-full h-full object-cover absolute inset-0"
                autoPlay
                loop
                muted
                playsInline />

            <div className="bg-linear-to-b from-[#010C1B] to-[#011735E5] absolute inset-0 w-full h-full scale-110" />
            <div className="w-full max-w-345 relative z-1 mx-auto px-4 pb-16 pt-26">
                <div className="flex items-center justify-center">
                    {infos.map((info, i) => (
                        <div key={info.label} className="flex items-center flex-1">
                            {/* Item */}
                            <div className="flex flex-col items-center flex-1">
                                {/* Icon circle */}
                                <div className="w-12 h-12 rounded-full bg-[#D28A44] flex items-center justify-center mb-3">
                                    <SendIcon/>
                                </div>
                                <span className="text-[#FFFFFF66] text-[15px] font-light leading-7">{info.label}</span>
                                <span className="text-white text-base] font-normal leading-7">{info.value}</span>
                            </div>

                            {/* Divider */}
                            {i < infos.length - 1 && (
                                <div className="h-33.5 border-r-2 [border-image-source:linear-gradient(180deg,#03142E_0%,#224A87_50%,#03142E_100%)] [border-image-slice:1] shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
