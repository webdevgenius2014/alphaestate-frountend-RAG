"use client";

import type { ReactNode } from "react";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { DealAssessmentGauge, PriceVsMarketChart, DistrictPriceTrendChart } from "@/app/components/dashboard/deal-analyzer-charts";
import {
    COMPARABLE_TRANSACTIONS, DEAL_STATUS_CLS, DEAL_ASSESSMENT_STATS, DEAL_MARKET_DATA,
    SelectChevron, SortIcon,
} from "@/app/(user dashboard)/constants";
import ModalButton from "@/app/components/ui/modal-button";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

const cardSelect = "text-xs border border-[#D28A441F] rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none";
const formSelect = "w-full text-sm border border-[#D28A441F] rounded-md px-3 py-3 bg-(--db-main-bg) text-(--db-text-primary) outline-none focus:border-[#D28A44]/60 transition cursor-pointer appearance-none";
const formInput = "w-full text-sm border border-[#D28A441F] rounded-md px-3 py-3 bg-(--db-main-bg) text-(--db-text-primary) outline-none focus:border-[#D28A44]/60 transition";
const fieldLbl = "block text-[15px] font-medium text-(--db-text-primary) mb-2.5";


export default function DealAnalyzerPage() {
    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-1 space-y-6">

                {/* ── Header ── */}
                <div className="flex items-start flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Deal Analyzer</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
                            Analyze property pricing against real Abu Dhabi transaction data using AI-powered market intelligence and government-tracked analytics.
                        </p>
                    </div>
                    <div className="bg-[#5E9F622B] px-2.5 py-2 rounded-[3px] flex gap-2 items-start">
                        <span className="w-2.25 h-2.25 mt-1.5 rounded-full block bg-[#5E9F62]" />
                        <div>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-[#5E9F62]">
                                ADREC Data Connected
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-medium text-(--db-text-primary)">
                                2,841 verified transaction records indexed
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Enter Property Deal ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Enter Property Deal</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Input the property details to compare this listing against real market transaction data.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className={fieldLbl}>Property Type</label>
                            <div className="relative">
                                <select className={formSelect}>
                                    <option>Apartment</option>
                                    <option>Villa</option>
                                    <option>Townhouse</option>
                                    <option>Commercial</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>District</label>

                            <div className="relative">
                                <select className={formSelect}>
                                    <option>Yas Island</option>
                                    <option>Al Reem Island</option>
                                    <option>Saadiyat Island</option>
                                    <option>Corniche</option>
                                    <option>Masdar City</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>Property Size (SQM)</label>
                            <input type="number" placeholder="145 sqm" className={formInput} />
                        </div>

                        <div>
                            <label className={fieldLbl}>Asking Price</label>
                            <input type="text" placeholder="AED 2,400,000" className={formInput} />
                        </div>
                        <div>
                            <label className={fieldLbl}>Sale Type</label>

                            <div className="relative">
                                <select className={formSelect}>
                                    <option>Off-Plan</option>
                                    <option>Ready</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>Bedrooms (Optional)</label>

                            <div className="relative">
                                <select className={formSelect}>
                                    <option>Studios</option>
                                    <option>1 BR</option>
                                    <option>2 BR</option>
                                    <option>3 BR</option>
                                    <option>4+ BR</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <ModalButton className="py-4!">ANALYZE DEAL</ModalButton>
                    </div>
                </Card>

                {/* ── AI Deal Assessment ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">AI Deal Assessment</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Market validation based on comparable transaction activity and district pricing intelligence.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
                        {/* Gauge panel */}
                        <div className="bg-[#D28A441F] rounded-lg p-5 flex flex-col items-center gap-3">
                            <DealAssessmentGauge score={85} />
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E9F62] bg-[#5E9F622E] rounded-xs px-1.5 py-0.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5E9F62] shrink-0" />
                                Good Deal
                            </span>
                            <p className="text-[9px] text-(--db-text-primary) text-center leading-relaxed">
                                This property is currently priced below the district-adjusted market average based on recent comparable transactions.
                            </p>
                        </div>
                        {/* Stat sections */}
                        <div className="flex flex-col bg-(--db-main-bg) p-5 gap-5.75">
                            <div>
                                <p className="text-[17px] font-semibold text-[#D28A44] mb-1.5">Notification Methods</p>
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                    {DEAL_ASSESSMENT_STATS.map((s) => (
                                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-xs p-2.5">
                                            <div className="flex items-center gap-2.5 mb-2 text-[#D28A44]">
                                                <div className="bg-[#D28A441F] w-5.75 h-5.75 rounded-[3px] flex justify-center items-center">
                                                    {s.icon}
                                                </div>
                                                <span className="text-xs text-(--db-text-primary)">{s.label}</span>
                                            </div>
                                            <AnimatedNumber value={s.value} className="text-sm font-semibold text-(--db-text-primary)" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[17px] font-semibold text-[#D28A44] mb-1.5">Comparable Market Data</p>
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                    {DEAL_MARKET_DATA.map((m) => (
                                        <div key={m.label} className="bg-(--db-sidebar-bg) rounded-xs p-2.5">
                                             <div className="flex items-center gap-2.5 mb-2 text-[#D28A44]">
                                                <div className="bg-[#D28A441F] w-5.75 h-5.75 rounded-[3px] flex justify-center items-center">
                                                    {m.icon}
                                                </div>
                                                <span className="text-xs text-(--db-text-primary)">{m.label}</span>
                                            </div>
                                            <AnimatedNumber value={m.value} className="text-sm font-semibold text-(--db-text-primary)" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ── Price vs Market Comparison ── */}
                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Price vs Market Comparison</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Compare between selling price and district transaction averages.</p>
                        </div>
                    </div>
                    <PriceVsMarketChart />
                </Card>

                {/* ── District Price Trend ── */}
                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Price Trend — Last 12 Months</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Median transaction pricing across recent comparable properties.</p>
                        </div>
                    </div>
                    <DistrictPriceTrendChart />
                </Card>

                {/* ── Recent Comparable Transactions ── */}
                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Recent Comparable Transactions</h2>
                    </div>
                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full min-w-125 text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-sm font-semibold text-(--db-text-primary)">
                                    <th className="px-5 py-3 whitespace-nowrap">Property Type</th>
                                    <th className="px-5 py-3 whitespace-nowrap">District</th>
                                    <th className="px-5 py-3 whitespace-nowrap">Price / SQM</th>
                                    <th className="px-5 py-3 whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARABLE_TRANSACTIONS.map((tx, i) => (
                                    <tr
                                        key={i}
                                        className="border-b divide-x divide-(--db-border) text-(--db-text-primary) border-(--db-border) last:border-0 hover:bg-(--db-sidebar-bg) odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium">{tx.propertyType}</td>
                                        <td className="px-5 py-3.5">{tx.district}</td>
                                        <td className="px-5 py-3.5">{tx.pricePerSqm}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-xs font-medium ${DEAL_STATUS_CLS[tx.status]}`}>
                                                <span className="w-1.5 h-1.5 rounded-full block bg-current shrink-0" />
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </div>
    );
}
