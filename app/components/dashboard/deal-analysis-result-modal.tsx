"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { DealScoreGauge } from "@/app/components/dashboard/deal-analyzer-charts";

export type DealAnalysisResult = {
    dealScore: number;
    dealVerdict: string;
    dealVerdictLabel: string;
    askingPriceAed: number;
    estimatedMarketPriceAed: number;
    pricePositionPct: number;
    pricePositionLabel: string;
    marketVerdict: string;
    avgPricePerSqm: number;
    comparableTransactions: number;
    districtTrend: string;
    demandActivity: string;
    roi: number;
    rentalYield: number;
};

function useModalEsc(onClose: () => void) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);
}

function formatAedMetric(n: number) {
    if (!Number.isFinite(n)) return "-";
    if (n >= 1000000) return `AED ${(n / 1000000).toFixed(2)}M`;
    return `AED ${Math.round(n).toLocaleString()}`;
}

function getScoreBand(score: number) {
    if (score >= 80) return { color: "#5E9F62", bg: "#5E9F622E", label: "Good Deal" };
    if (score >= 60) return { color: "#D28A44", bg: "#D28A442E", label: "Fair Deal" };
    if (score >= 40) return { color: "#EAB308", bg: "#EAB3082E", label: "Proceed with Caution" };
    return { color: "#CF2D48", bg: "#CF2D482E", label: "Poor Deal" };
}

function getDemandColor(activity: string) {
    const v = (activity || "").toLowerCase();
    if (v === "strong") return "#5E9F62";
    if (v === "weak") return "#CF2D48";
    return "#D28A44";
}

function getTrendDisplay(trend: string) {
    const v = (trend || "").toLowerCase();
    if (v === "rising") return "Rising ↑";
    if (v === "declining") return "Declining ↓";
    return "Stable →";
}

export function DealAnalysisResultModal({
    result,
    propertyName,
    onClose,
}: {
    result: DealAnalysisResult;
    propertyName?: string;
    onClose: () => void;
}) {
    useModalEsc(onClose);

    const band = getScoreBand(result.dealScore);
    const verdictLabel = result.dealVerdictLabel || band.label;
    const description = `${result.marketVerdict}. This property is priced ${Math.abs(result.pricePositionPct).toFixed(1)}% ${result.pricePositionPct < 0 ? "below" : "above"} the estimated market average, based on ${result.comparableTransactions.toLocaleString()} comparable transactions.`;

    const assessmentStats = [
        { label: "Asking Price", value: formatAedMetric(result.askingPriceAed) },
        { label: "Est. Market Price", value: formatAedMetric(result.estimatedMarketPriceAed) },
        { label: "ROI", value: `${result.roi.toFixed(1)}%` },
        { label: "Rental Yield", value: `${result.rentalYield.toFixed(1)}%` },
    ];

    const marketStats = [
        { label: "Avg Price / Sqm", value: formatAedMetric(result.avgPricePerSqm) },
        { label: "Comparable Sales", value: `${result.comparableTransactions.toLocaleString()} Sales` },
        { label: "District Trend", value: getTrendDisplay(result.districtTrend) },
        { label: "Demand Activity", value: result.demandActivity, color: getDemandColor(result.demandActivity) },
    ];

    return createPortal(
        <div className="fixed inset-0 z-1000 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-140 max-h-[90vh] overflow-y-auto px-7 py-8 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <h2 className="text-[21px] font-medium text-(--db-text-primary) mb-1">Deal Analysis Result</h2>
                {propertyName && (
                    <p className="text-[13px] text-(--db-text-primary) mb-5">{propertyName}</p>
                )}

                <div className="flex flex-col items-center mb-4">
                    <DealScoreGauge score={result.dealScore} />
                </div>

                <div className="flex justify-center mb-4">
                    <span
                        className="text-[11px] rounded-[3px] font-semibold px-2.5 max-w-fit inline-flex gap-1 items-center"
                        style={{ color: band.color, backgroundColor: band.bg }}
                    >
                        <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: band.color }}></span>
                        {verdictLabel.toUpperCase()}
                    </span>
                </div>

                <p className="text-sm text-(--db-text-primary) font-normal mb-5 text-center">
                    {description}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-5">
                    {assessmentStats.map((s) => (
                        <div key={s.label} className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                            <span>{s.label}: <b>{s.value}</b></span>
                        </div>
                    ))}
                </div>

                <h3 className="text-base font-medium text-(--db-text-primary) mb-2.5">District Market Intelligence</h3>
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {marketStats.map((s) => (
                        <div key={s.label} className="bg-(--db-main-bg) p-3.5 rounded-md">
                            <p className="text-[12px] text-(--db-text-primary) font-normal mb-0.5">{s.label}</p>
                            <p className="text-[15px] font-semibold" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-[#D28A44] text-white text-sm font-semibold uppercase py-3 rounded-md hover:bg-[#b8732e] transition-colors"
                >
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
}
