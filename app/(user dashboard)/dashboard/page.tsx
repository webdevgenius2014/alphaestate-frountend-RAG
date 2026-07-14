"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/app/components/ui/button";
import { PriceTrendChart, RentalYieldChart, CapRateChart } from "@/app/components/dashboard/charts";
import { MarketSlider } from "@/app/components/dashboard/market-slider";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import {
    DASHBOARD_STATS,
    TOP_PROPERTIES,
    PROPERTY_STATUS_STYLES,
    INVESTMENT_SIGNALS,
    SortIcon,
} from "@/app/(user dashboard)/constants";
import { useTheme } from "@/app/(user dashboard)/theme-provider";


function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function SectionLabel({ children }: { children: ReactNode }) {
    return <p className="text-sm font-medium text-(--db-text-primary)">{children}</p>;
}


export default function DashboardPage() {
    const { user } = useTheme();

    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-1 space-y-6">

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">👋 Welcome back, {user?.fullName ?? "User Name"}</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130.75">
                            Track properties, market movements, investment insights, and AI-driven analytics all from one minimal command center.
                        </p>
                    </div>
                    <Button variant="navy" className="w-auto! p-[10px_16px]! rounded-md! font-bold! text-xs! flex items-center gap-1.5 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M8.5 10.625V2.125" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.875 10.625V13.4583C14.875 13.8341 14.7257 14.1944 14.4601 14.4601C14.1944 14.7257 13.8341 14.875 13.4583 14.875H3.54167C3.16594 14.875 2.80561 14.7257 2.53993 14.4601C2.27426 14.1944 2.125 13.8341 2.125 13.4583V10.625" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.95837 7.08334L8.50004 10.625L12.0417 7.08334" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        EXPORT PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {DASHBOARD_STATS.map((s) => (
                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                            <div className="flex items-center justify-start gap-2 mb-2.5">
                                <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                                <SectionLabel>{s.label}</SectionLabel>
                            </div>
                            <AnimatedNumber value={s.value} className="text-2xl mb-0.5 md:text-[42px] font-semibold text-(--db-text-primary) leading-none" />
                            <p className="text-[13px] font-normal text-(--db-text-primary)">{s.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-3">
                        <MarketSlider />
                    </div>

                    <div className="lg:col-span-2 bg-[#0B1F3A] rounded-[10px] p-5 overflow-hidden relative" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
                        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(11,31,58,0)_0%,#0B1F3A_66.94%)] z-10" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto_120px] items-center gap-4">
                            <div className="relative z-10 mb-6 md:mb-0">
                                <h2 className="text-lg md:text-[24px] font-bold text-white leading-8">AI Intelligence<br className="hidden md:inline-block" />Engine</h2>
                                <p className="text-[13px] text-white mt-2.75 md:max-w-48">
                                    Real-time market intelligence powered by advanced AI analysis.
                                </p>
                                <Button variant="primary" className="w-auto! p-[8px_24px]! rounded-md! text-sm! font-bold! mt-6 leading-6 tracking-wide">
                                    LAUNCH AI ANALYST
                                </Button>
                            </div>
                            <img src="/globe.gif" alt="" className="w-full max-w-29.75 scale-140 relative left-6 md:-left-13 md:-top-4 mb-5 md:mb-0" />
                        </div>
                        <video src="/12922667_1920_1080_30fps.mp4" autoPlay muted playsInline loop className="absolute inset-0 w-full h-full object-cover"></video>
                    </div>
                </div>

                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Price Trend — Price per sqft (AED)</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">12-month rolling · Top 2 districts</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none">
                                <option>Last Year</option>
                                <option>6 months</option>
                                <option>All time</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>
                    <PriceTrendChart />
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_300px] gap-4">
                    <Card className="rounded-none!">
                        <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Rental Yield by District</h2>
                                <p className="text-xs text-(--db-text-primary) mt-0.5">Current quarter · Freehold only</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <select className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none">
                                    <option>Last Year</option>
                                    <option>6 months</option>
                                </select>
                                <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                    <SortIcon />
                                </button>
                            </div>
                        </div>
                        <RentalYieldChart />
                    </Card>

                    <Card className="rounded-none!">
                        <div className="mb-4">
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Cap Rate Map</h2>
                            <p className="text-xs text-(--db-text-primary) mt-0.5">Q1 2026 · All districts</p>
                        </div>
                        <CapRateChart />
                    </Card>
                </div>

                <Card className="overflow-hidden rounded-none!">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Top Investment Properties</h2>
                            <p className="text-xs text-(--db-text-primary) mt-0.5">Ranked by AI-insight, ready to move</p>
                        </div>
                        <Button variant="secondary">VIEW ALL</Button>
                    </div>
                    <div className="mt-5 overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-sm font-semibold text-(--db-text-primary)">
                                    <th className="min-w-60 px-5.5 font-semibold py-3 whitespace-nowrap">
                                        Property
                                    </th>
                                    <th className="min-w-40 px-5.5 font-semibold py-3 whitespace-nowrap">
                                        District
                                    </th>
                                    <th className="min-w-30 px-5.5 font-semibold py-3 whitespace-nowrap">
                                        Price
                                    </th>
                                    <th className="px-5.5 font-semibold py-3 whitespace-nowrap">
                                        Price/sqft
                                    </th>
                                    <th className="px-5.5 font-semibold py-3 whitespace-nowrap">
                                        Yield
                                    </th>
                                    <th className="px-5.5 font-semibold py-3 whitespace-nowrap">
                                        ROI
                                    </th>
                                    <th className="px-5.5 font-semibold py-3 whitespace-nowrap">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {TOP_PROPERTIES.map((p, i) => (
                                    <tr key={i} className="border-b text-sm divide-x divide-(--db-border) text-(--db-text-primary) border-(--db-border) last:border-0 hover:bg-(--db-sidebar-bg) odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) transition-colors">
                                        <td className="px-5 py-3.5 font-medium">{p.name}</td>
                                        <td className="px-5 py-3.5">{p.district}</td>
                                        <td className="px-5 py-3.5">{p.price}</td>
                                        <td className="px-5 py-3.5">{p.sqft}</td>
                                        <td className="px-5 py-3.5">{p.yield_}</td>
                                        <td className="px-5 py-3.5">{p.roi}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-medium ${PROPERTY_STATUS_STYLES[p.status]}`}>
                                                <span className="w-1.75 h-1.75 rounded-full block bg-current"></span>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4.75">
                    {INVESTMENT_SIGNALS.map((s) => (
                        <Card key={s.badge} className="bg-(--db-sidebar-bg) rounded-md p-5 flex flex-col">
                            <div className="w-12.5 h-12.5 rounded-md bg-[#D28A441F] flex items-center justify-center mb-7.5">{s.icon}</div>
                            <span className={`text-sm font-normal text-(--db-text-primary)`}>{s.badge}</span>
                            <p className="text-sm md:text-lg font-medium text-(--db-text-primary) leading-snug mb-3 mt-2.25">{s.title}</p>
                            <button className="group relative overflow-hidden h-6 text-sm max-w-fit font-semibold">
                                <div className="transition-transform duration-200 will-change-transform ease-[cubic-bezier(0.34,1.15,0.64,1)] group-hover:-translate-y-6 translate-y-0">
                                    <div className="h-6 flex tems-center border-b-2 text-[#D28A44]">
                                        {s.action}
                                    </div>

                                    <div className="h-6 flex tems-center border-b-2 text-(--db-text-primary)">
                                        {s.action}
                                    </div>
                                </div>
                            </button>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}
