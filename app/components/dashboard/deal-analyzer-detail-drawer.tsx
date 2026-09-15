"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { DealAnalysisDetail } from "@/app/(admin dashboard)/constants";

interface Props {
    record: DealAnalysisDetail;
    onClose: () => void;
}

const VERDICT_META: Record<string, { label: string; color: string; bg: string }> = {
    good_deal: { label: "Good Deal", color: "text-[#5E9F62]", bg: "bg-[#5E9F622E]" },
    fair_deal: { label: "Fair Deal", color: "text-[#D28A44]", bg: "bg-[#D28A442E]" },
    overpriced: { label: "Overpriced", color: "text-[#E05252]", bg: "bg-[#E052522E]" },
};

const TREND_META: Record<string, { label: string; icon: string }> = {
    rising: { label: "Rising", icon: "📈" },
    stable: { label: "Stable", icon: "📊" },
    declining: { label: "Declining", icon: "📉" },
};

function formatAed(v: number | null): string {
    if (v == null) return "-";
    return `AED ${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPct(v: number | null): string {
    if (v == null) return "-";
    return `${Number(v).toFixed(1)}%`;
}

function titleCase(s: string | null): string {
    if (!s) return "-";
    return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DealAnalyzerDetailDrawer({ record, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        setMounted(true);
        const id = setTimeout(() => setVisible(true), 16);
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setVisible(false); setTimeout(onClose, 300); }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            clearTimeout(id);
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    if (!mounted) return null;

    const verdictKey = String(record.dealVerdict ?? "").toLowerCase();
    const verdictMeta = VERDICT_META[verdictKey] ?? { label: record.dealVerdictLabel || titleCase(record.dealVerdict), color: "text-(--db-text-primary)", bg: "bg-(--db-warm-card-bg)" };

    const trendKey = String(record.districtTrend ?? "").toLowerCase();
    const trendMeta = TREND_META[trendKey] ?? { label: titleCase(record.districtTrend), icon: "📊" };

    return createPortal(
        <div className="fixed inset-0 z-9999">
            {/* Full-screen backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-80" : "opacity-0"}`}
                onClick={handleClose}
            />

            {/* Drawer panel */}
            <div className={`absolute right-0 top-0 bottom-0 w-full max-w-121.25 bg-(--db-modal-bg) flex flex-col shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}>

                <div className="flex items-center justify-between px-5 pt-6 pb-4.5">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary)">Deal Analyzer Detail</h2>
                    <button onClick={handleClose} className="absolute top-4 right-4 z-20">
                        <img src="/close.svg" alt="" />
                    </button>
                </div>

                <div className="overflow-y-auto thin-scroll">

                    <div className="w-full h-63.25 bg-(--db-sidebar-bg) px-5 rounded-md shrink-0 overflow-hidden">
                        <img src={record.imageUrl || "/property-1.png"} alt={titleCase(record.propertyType)} className="w-full h-full object-cover rounded-md" />
                    </div>

                    <div className="flex flex-col gap-3.25 px-5 py-5">

                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[19px] font-medium text-(--db-text-primary)">{titleCase(record.propertyType)}</h3>
                            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${verdictMeta.bg} ${verdictMeta.color}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {verdictMeta.label}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 justify-between gap-y-2 text-sm text-(--db-text-primary)">
                            <span>{record.district}</span>
                            <span>{titleCase(record.bedrooms)}</span>
                            <span>{titleCase(record.saleType)}</span>
                            <span>{record.areaSqm != null ? `${record.areaSqm} sqm` : "-"}</span>
                        </div>

                        {/* Asking price */}
                        <p className="text-base font-medium text-[#D28A44]">{formatAed(record.askingPriceAed)}</p>

                        {/* Deal score */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 flex items-center justify-between">
                            <p className="text-lg font-medium text-(--db-text-primary)">Deal Score</p>
                            <p className="text-2xl font-semibold text-[#D28A44]">{record.dealScore}</p>
                        </div>

                        {/* Market comparison */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Estimated Market Price</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatAed(record.estimatedMarketPriceAed)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Avg Price / SQM</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatAed(record.avgPricePerSqm)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Price Position</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.pricePositionPct)} ({record.pricePositionLabel || "-"})</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Market Verdict</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.marketVerdict || "-"}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">District Trend</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary) flex items-center gap-1.5">
                                    <span>{trendMeta.icon}</span>{trendMeta.label}
                                </p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Demand Activity</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.demandActivity || "-"}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Comparable Transactions</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.comparableTransactions.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Returns */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Expected Annual Rent</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatAed(record.expectedAnnualRentAed)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">ROI</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.roi)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Rental Yield</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.rentalYield)}</p>
                            </div>
                        </div>

                        {/* Analyzed by */}
                        {(record.userName || record.userEmail) && (
                            <div>
                                <p className="text-lg font-medium text-(--db-text-primary) mb-1">Analyzed By</p>
                                <p className="text-sm text-(--db-text-primary) leading-6 font-normal">
                                    {record.userName || "-"}{record.userEmail ? ` (${record.userEmail})` : ""} · {record.timeAgo || "-"}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
