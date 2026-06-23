"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../ui/button";
import { ParticleBackground } from "./ParticleBackground";
import { AnimatedNumber } from "../dashboard/animated-number";

export const HeroSection = () => {
    const rightRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [panelReady, setPanelReady] = useState(false);

    useEffect(() => {
        const init = setTimeout(() => setPanelReady(true), 80);
        const t = setInterval(() => setPanelReady(prev => !prev), 2000);
        return () => { clearTimeout(init); clearInterval(t); };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = rightRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMouse({
            x: (e.clientX - (rect.left + rect.width / 2)) / rect.width,
            y: (e.clientY - (rect.top + rect.height / 2)) / rect.height,
        });
    };

    const handleMouseLeave = () => setMouse({ x: 0, y: 0 });

    const parallax = (factor: number): React.CSSProperties => ({
        translate: `${mouse.x * factor}px ${mouse.y * factor}px`,
        transition: "translate 0.35s cubic-bezier(0.23,1,0.32,1)",
    });

    return (
        <section className="relative w-full min-h-215.5 text-white max-w-345 mx-auto rounded-[30px] px-7.75 border border-[#272727] flex items-end overflow-hidden">

            {/* <ParticleBackground /> */}
            <video
                src="/particales-bg.mp4"
                className="w-full h-full object-cover absolute inset-0 opacity-50"
                autoPlay
                loop
                muted
                playsInline />

            <div className="bg-[#010C1BB2] absolute inset-0 w-full h-full" />

            <div className="absolute top-0 right-0 w-100 h-100 rounded-full bg-[#3671C9] blur-[180px] opacity-40 duration-1200 ease-linear -translate-x-1/3 translate-y-1/3"
            />
            <div className={`absolute w-100 h-100 rounded-full bg-[#3671C9] blur-[180px] opacity-40 -translate-x-1/3 duration-1200 ease-linear translate-y-1/3 ${panelReady ? "bottom-0 left-0" : "top-0 left-0"}`}
            />

            <img src="/globe-2.svg" className="absolute top-130 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-345" />

            <div className={`absolute top-90 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-345 pointer-events-none transition-opacity duration-1200 ease-linear ${panelReady ? "opacity-100" : "opacity-100"}`}>
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

            <div className="relative z-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                <div className="flex flex-col mb-45.75 max-w-149.5">
                    {/* Trust badge */}
                    <div className="inline-flex items-center gap-3.25 mb-4.75">
                        <div className="flex -space-x-3">
                            <img className="w-8.75 h-8.75 rounded-full object-cover" src="/user.png" />
                            <img className="w-8.75 h-8.75 rounded-full object-cover" src="/user-1.png" />
                            <img className="w-8.75 h-8.75 rounded-full object-cover" src="/user-2.png" />
                        </div>
                        <span className="text-[15px] font-normal">
                            Trusted by 5,000+ Investors &amp; Property Analysts
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-[28px] md:text-[30px] lg:text-[39px] font-semibold leading-15.25 tracking-[-0.5px] mb-2.5">
                        Your AI Copilot For Real Estate Investment Decisions
                    </h1>

                    {/* Description */}
                    <p className=" text-[15px] leading-7 mb-7 font-light max-w-126.25">
                        Analyze properties, predict market trends, and uncover profitable investment opportunities with AI-driven insights, district intelligence, and real-time market data.
                    </p>

                    <Button variant="white" className="w-full! max-w-57! py-4! text-sm! uppercase rounded-full!">Start Free Analysis</Button>
                </div>

                <div
                    className={`flex mb-7.5 bg-[#05132780] shadow-[0px_17px_37px_0px_#0000001A,0px_67px_67px_0px_#00000017,0px_150px_90px_0px_#0000000D,0px_268px_107px_0px_#00000003,0px_418px_117px_0px_#00000000] relative border border-[#272727] flex-col gap-3 rounded-[30px] p-14.5 mt-10 lg:mt-0 transition-transform duration-1200 ease-linear ${panelReady ? "translate-y-0 translate-x-0" : "-translate-y-20 -translate-x-10"}`}
                >

                    <div className={`f-up-a self-center absolute text-white bg-[#0E2445] rounded-[14px] p-[14px_15px] min-w-35.75 duration-1200 ease-linear ${panelReady ? "-top-12" : "-top-4"}`}>
                        <p className="text-[13px] font-semibold mb-1">ROI Forecast</p>
                        <p className="text-[27px] font-semibold leading-6"><AnimatedNumber value="18%" className="text-[27px] font-semibold leading-6" /></p>
                    </div>

                    <div className="rounded-[10px] bg-[#051327] p-5 backdrop-blur-sm">
                        <div className="f-down-a flex items-center justify-between gap-2.5 bg-[#051327] border rounded-[11px] border-[#FFFFFF21] px-3.5 py-2.75 mb-2.5" >
                            <div className="flex gap-2 items-center">
                                AlphaAI Analyst
                                <p className="bg-[#0E2445] rounded-full px-2 text-[14px]">4.0</p>
                            </div>

                            <span className="inline-flex items-center gap-1.5 bg-[#0E2445] rounded-full px-2.5 min-h-6.25 font-medium text-[13px]">
                                Market History
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <g clipPath="url(#clip0_1_1266)">
                                        <path d="M13.125 7C13.125 8.62445 12.4797 10.1824 11.331 11.331C10.1824 12.4797 8.62445 13.125 7 13.125C5.37555 13.125 3.81763 12.4797 2.66897 11.331C1.52031 10.1824 0.875 8.62445 0.875 7C0.875 6.88397 0.921094 6.77269 1.00314 6.69064C1.08519 6.6086 1.19647 6.5625 1.3125 6.5625C1.42853 6.5625 1.53981 6.6086 1.62186 6.69064C1.70391 6.77269 1.75 6.88397 1.75 7C1.74825 8.17165 2.13789 9.31032 2.85708 10.2353C3.57626 11.1602 4.58379 11.8185 5.71973 12.1055C6.85568 12.3926 8.05496 12.292 9.12721 11.8197C10.1995 11.3474 11.0833 10.5305 11.6383 9.4987C12.1934 8.46687 12.3879 7.2792 12.191 6.12422C11.994 4.96923 11.417 3.9131 10.5514 3.12347C9.68583 2.33383 8.58129 1.85594 7.41312 1.76563C6.24496 1.67533 5.0801 1.97779 4.10343 2.625H4.375C4.49103 2.625 4.60231 2.6711 4.68436 2.75314C4.76641 2.83519 4.8125 2.94647 4.8125 3.0625C4.8125 3.17854 4.76641 3.28981 4.68436 3.37186C4.60231 3.45391 4.49103 3.5 4.375 3.5H3.0625C3.00504 3.50004 2.94813 3.48874 2.89504 3.46677C2.84194 3.44479 2.7937 3.41257 2.75307 3.37194C2.71244 3.3313 2.68021 3.28306 2.65824 3.22997C2.63626 3.17687 2.62497 3.11997 2.625 3.0625V1.75C2.625 1.63397 2.67109 1.52269 2.75314 1.44064C2.83519 1.3586 2.94647 1.3125 3.0625 1.3125C3.17853 1.3125 3.28981 1.3586 3.37186 1.44064C3.45391 1.52269 3.5 1.63397 3.5 1.75V1.97484C4.41822 1.33486 5.49427 0.95877 6.61124 0.887448C7.72821 0.816125 8.84336 1.0523 9.83552 1.5703C10.8277 2.0883 11.6589 2.86831 12.2388 3.82558C12.8188 4.78285 13.1253 5.88076 13.125 7ZM10.9375 7C10.9375 7.77877 10.7066 8.54004 10.2739 9.18756C9.84125 9.83508 9.2263 10.3398 8.50682 10.6378C7.78733 10.9358 6.99563 11.0138 6.23183 10.8618C5.46803 10.7099 4.76644 10.3349 4.21577 9.78424C3.6651 9.23357 3.29009 8.53197 3.13816 7.76817C2.98623 7.00437 3.0642 6.21267 3.36222 5.49319C3.66024 4.7737 4.16492 4.15875 4.81244 3.72609C5.45996 3.29343 6.22124 3.0625 7 3.0625C8.04394 3.06364 9.0448 3.47885 9.78297 4.21703C10.5212 4.95521 10.9364 5.95606 10.9375 7ZM8.55518 7.511L7.4375 6.76587V4.8125C7.4375 4.69647 7.39141 4.58519 7.30936 4.50314C7.22731 4.4211 7.11603 4.375 7 4.375C6.88397 4.375 6.77269 4.4211 6.69064 4.50314C6.60859 4.58519 6.5625 4.69647 6.5625 4.8125V7C6.56251 7.07202 6.5803 7.14292 6.61429 7.20642C6.64827 7.26992 6.6974 7.32405 6.75732 7.364L8.06982 8.239C8.16637 8.30202 8.28389 8.32438 8.39683 8.30122C8.50978 8.27806 8.60901 8.21125 8.67297 8.11532C8.73692 8.0194 8.76043 7.9021 8.73837 7.78894C8.71631 7.67577 8.65048 7.57589 8.55518 7.511Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1_1266">
                                            <rect width="14" height="14" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                        </div>
                        <div className={`f-up-b bg-[linear-gradient(180deg,#D28A44_0%,#9C5F23_100%)] relative my-6.75 text-[15px] leading-6 rounded-[20px] p-5 duration-1200 ease-linear ${panelReady ? "-left-32 top-0 " : "-top-4 -left-32"}`}>
                            <div className="flex gap-2 mb-3.25 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                    <g clipPath="url(#clip0_1_1288)">
                                        <path d="M27.9062 35.7734H26.793V33.3984H11.207V35.7734H10.0938C9.4784 35.7734 8.98047 36.2714 8.98047 36.8867C8.98047 37.5021 9.4784 38 10.0938 38H27.9062C28.5216 38 29.0195 37.5021 29.0195 36.8867C29.0195 36.2714 28.5216 35.7734 27.9062 35.7734Z" fill="white" />
                                        <path d="M19.1576 8.92911L19 8.61383L18.8489 8.91605C18.5746 9.48085 18.0192 9.52509 18.0118 9.53251L17.6617 9.58469L17.9019 9.82167C18.1656 10.0727 18.2954 10.4514 18.2281 10.8219L18.1727 11.1578L18.4868 10.9948C18.8022 10.8307 19.1877 10.8255 19.5131 10.9948L19.8273 11.1578L19.7697 10.8088C19.7099 10.4512 19.8284 10.0869 20.0861 9.83362L20.3383 9.58469L19.9882 9.53251C19.6294 9.47811 19.3197 9.25308 19.1576 8.92911Z" fill="white" />
                                        <path d="M36.8867 2.22656H31.2224C31.2317 1.85636 31.2461 1.49002 31.2461 1.11328C31.2461 0.497934 30.7482 0 30.1328 0H7.86719C7.25184 0 6.75391 0.497934 6.75391 1.11328C6.75391 1.49002 6.7683 1.85651 6.77758 2.22656H1.11328C0.497934 2.22656 0 2.7245 0 3.33984V6.16001C0 12.3752 4.97785 17.4238 11.1131 17.7504C12.3926 19.5103 13.9162 20.8168 15.6406 21.5589C15.3877 26.6388 12.6924 30.1572 11.8205 31.1718H26.1777C25.3061 30.1643 22.6113 26.6668 22.3584 21.5589C24.0834 20.817 25.6076 19.5105 26.8872 17.7504C33.0221 17.4237 38 12.3751 38 6.16001V3.33984C38 2.7245 37.5021 2.22656 36.8867 2.22656ZM2.22656 6.16001V4.45312H6.88846C7.22059 8.69465 8.18559 12.4132 9.66053 15.3416C5.45634 14.3949 2.22656 10.6462 2.22656 6.16001ZM23.4879 9.60747L22.0605 11.0132L22.3888 12.9897C22.4584 13.4061 22.2866 13.8258 21.9452 14.0725C21.6028 14.3212 21.1526 14.3544 20.7776 14.1606L19 13.2376L17.2225 14.1606C16.8463 14.352 16.3962 14.3204 16.0549 14.0725C15.7134 13.8258 15.5417 13.4061 15.6112 12.9897L15.9396 11.0132L14.5121 9.60747C14.2058 9.30577 14.1074 8.86053 14.2349 8.47029C14.3654 8.07018 14.7111 7.77664 15.1286 7.71363L17.1094 7.41571L18.0042 5.62511C18.3803 4.87061 19.6198 4.87061 19.9959 5.62511L20.8907 7.41571L22.8715 7.71363C23.289 7.77671 23.6347 8.07025 23.7652 8.47029C23.8956 8.87144 23.788 9.31178 23.4879 9.60747ZM35.7734 6.16001C35.7734 10.646 32.5437 14.3948 28.3396 15.3415C29.8144 12.4131 30.7796 8.6948 31.1115 4.45312H35.7734V6.16001Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1_1288">
                                            <rect width="38" height="38" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <h3 className="text-[23px] font-semibold leading-6">AI Investment Insight</h3>
                            </div>
                            <p> Based on recent transaction activity and rental demand patterns,
                                Yas Island currently ranks as the strongest district for long-term
                                investment opportunities.</p>
                        </div>
                        <div className="f-down-b relative flex flex-col bg-[#051327] border border-[#FFFFFF21] rounded-[20px] p-[13px_20px]">
                            <textarea
                                rows={5}
                                placeholder="Ask AlphaAI about properties, districts, ROI, rental yields, or market trends..."
                                className="w-full resize-none border-none pr-22 text-[13px] leading-6 whitespace-normal placeholder:text-white outline-none cursor-pointer"
                            />
                            <div className="flex justify-between items-center gap-3">
                                <button
                                    type="button"
                                    className="w-7 h-7 rounded-[7px] bg-[#0E2445] flex items-center justify-center transition-colors shrink-0"
                                    aria-label="Send"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_1_1273)">
                                            <path d="M4.86786 15.3314C4.03711 15.3318 3.2249 15.0858 2.53401 14.6245C1.84312 14.1631 1.30459 13.5073 0.986565 12.7398C0.668537 11.9723 0.585302 11.1278 0.747392 10.313C0.909482 9.49819 1.30961 8.74979 1.89716 8.16247L3.39649 6.66314C3.5215 6.53813 3.69105 6.4679 3.86784 6.4679C4.04463 6.4679 4.21418 6.53813 4.3392 6.66314C4.46421 6.78815 4.53444 6.9577 4.53444 7.13449C4.53444 7.31128 4.46421 7.48083 4.3392 7.60584L2.83986 9.10518C2.30213 9.64295 2.00006 10.3723 2.00009 11.1328C2.00012 11.8933 2.30225 12.6226 2.84002 13.1604C3.37779 13.6981 4.10715 14.0002 4.86764 14.0001C5.62813 14.0001 6.35747 13.698 6.8952 13.1602L8.39453 11.6609C8.45643 11.599 8.52991 11.5499 8.61079 11.5164C8.69166 11.4829 8.77835 11.4656 8.86588 11.4656C8.95342 11.4656 9.0401 11.4829 9.12098 11.5164C9.20185 11.5499 9.27534 11.599 9.33724 11.6609C9.39914 11.7228 9.44824 11.7962 9.48174 11.8771C9.51524 11.958 9.53248 12.0447 9.53248 12.1322C9.53248 12.2197 9.51524 12.3064 9.48174 12.3873C9.44824 12.4682 9.39914 12.5417 9.33724 12.6036L7.8379 14.1029C7.44867 14.4939 6.98575 14.8038 6.47594 15.0147C5.96614 15.2255 5.41956 15.3332 4.86786 15.3314Z" fill="white" />
                                            <path d="M12.1322 9.53223C12.0003 9.53224 11.8714 9.49315 11.7618 9.4199C11.6522 9.34665 11.5667 9.24253 11.5163 9.12072C11.4658 8.9989 11.4526 8.86486 11.4784 8.73555C11.5041 8.60623 11.5676 8.48745 11.6608 8.39423L13.1602 6.8949C13.6979 6.35713 14 5.62777 13.9999 4.86728C13.9999 4.10679 13.6978 3.37746 13.16 2.83973C12.6222 2.302 11.8929 1.99992 11.1324 1.99995C10.3719 1.99998 9.64257 2.30212 9.10484 2.83989L7.60551 4.33922C7.48049 4.46423 7.31094 4.53447 7.13414 4.53447C6.95735 4.53447 6.78779 4.46424 6.66278 4.33922C6.53776 4.21421 6.46753 4.04466 6.46753 3.86786C6.46753 3.69106 6.53776 3.52151 6.66277 3.39649L8.16211 1.89716C8.55162 1.50464 9.01481 1.1929 9.52509 0.979805C10.0354 0.766714 10.5827 0.656472 11.1357 0.655403C11.6887 0.654335 12.2364 0.762461 12.7475 0.973579C13.2586 1.1847 13.723 1.49465 14.114 1.88566C14.5051 2.27667 14.8151 2.74104 15.0262 3.25213C15.2373 3.76321 15.3455 4.31096 15.3445 4.86395C15.3434 5.41693 15.2332 5.96427 15.0201 6.47456C14.8071 6.98485 14.4954 7.44805 14.1029 7.83759L12.6035 9.33693C12.5418 9.39904 12.4683 9.44828 12.3874 9.48181C12.3065 9.51533 12.2198 9.53247 12.1322 9.53223Z" fill="white" />
                                            <path d="M5.66671 11.1667C5.50189 11.1667 5.34077 11.1178 5.20372 11.0263C5.06668 10.9347 4.95986 10.8046 4.89679 10.6523C4.83372 10.5 4.81723 10.3325 4.8494 10.1708C4.88157 10.0092 4.96095 9.86069 5.07751 9.74416L9.74418 5.07749C9.8215 4.99988 9.91337 4.93828 10.0145 4.89621C10.1157 4.85415 10.2241 4.83244 10.3337 4.83234C10.4433 4.83223 10.5517 4.85374 10.653 4.89561C10.7542 4.93749 10.8462 4.99892 10.9237 5.07639C11.0011 5.15386 11.0626 5.24584 11.1044 5.34707C11.1463 5.44831 11.1678 5.55681 11.1677 5.66636C11.1676 5.77592 11.1459 5.88438 11.1038 5.98553C11.0618 6.08669 11.0002 6.17856 10.9226 6.25588L6.2559 10.9225C6.17872 11.0002 6.0869 11.0617 5.98577 11.1037C5.88463 11.1456 5.77618 11.167 5.66671 11.1667Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1_1273">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    className="w-7 h-7 rounded-[7px] bg-[#D28A44] flex items-center justify-center transition-colors shrink-0"
                                    aria-label="Send"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <g clipPath="url(#clip0_1_1280)">
                                            <path d="M5.83337 11.7413V14.8333C5.83337 15.0493 5.97204 15.2407 6.17737 15.3087C6.22871 15.3253 6.28137 15.3333 6.33337 15.3333C6.48937 15.3333 6.64004 15.26 6.73604 15.1293L8.54471 12.668L5.83337 11.7413Z" fill="white" />
                                            <path d="M15.79 0.0927257C15.6367 -0.0159409 15.4354 -0.0306076 15.2687 0.0567257L0.268696 7.89006C0.091363 7.98273 -0.0133037 8.17206 0.00136299 8.37139C0.0166963 8.57139 0.149363 8.74206 0.33803 8.80673L4.50803 10.2321L13.3887 2.63873L6.5167 10.9181L13.5054 13.3067C13.5574 13.3241 13.612 13.3334 13.6667 13.3334C13.7574 13.3334 13.8474 13.3087 13.9267 13.2607C14.0534 13.1834 14.1394 13.0534 14.1614 12.9074L15.9947 0.574059C16.022 0.387392 15.9434 0.202059 15.79 0.0927257Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1_1280">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className={`f-up-c self-center absolute bottom-14.5 text-white bg-[#0E2445] rounded-[14px] p-[14px_15px] min-w-48.25 duration-1200 ease-linear ${panelReady ? "-left-31.25 " : "-left-20"}`}>
                        <p className="text-[13px] font-semibold mb-1">Investment Score</p>
                        <p className="text-[27px] font-semibold leading-6 flex items-baseline gap-1">
                            <AnimatedNumber value="9.2" className="text-[27px] font-semibold leading-6" />
                            <span>/ 10</span>
                        </p>
                        <div className="h-1.25 mt-2 flex bg-[#030B17] rounded-full">
                            <div className={`bg-[#294874] rounded-full duration-1200 ease-linear ${panelReady ? "w-3" : "w-[95%]"}`} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
