"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { DealAssessmentGauge, PriceVsMarketChart, DistrictPriceTrendChart } from "@/app/components/dashboard/deal-analyzer-charts";
import {
    DEAL_STATUS_CLS, DEAL_ASSESSMENT_STATS, DEAL_MARKET_DATA,
    SelectChevron, SortIcon, type ComparableTransaction,
    PROPERTY_TYPE_OPTIONS, SALE_TYPE_OPTIONS, BEDROOM_OPTIONS,
} from "@/app/(user dashboard)/constants";
import ModalButton from "@/app/components/ui/modal-button";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";

type DealAnalysisResult = {
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
    priceVsMarketChart: Array<{ label: string; userDeal: number | null; marketAvg: number }>;
    savedRecordId?: string;
};

function formatAedMetric(n: number) {
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

function formatMonthLabel(monthStr: string) {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
}

function transformDistrictPriceTrend(rows: Array<{ month: string; avgPricePerSqm: number }>) {
    return rows
        .slice()
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((r) => ({ month: formatMonthLabel(r.month), price: r.avgPricePerSqm ?? 0 }));
}

function titleCaseSlug(value: string) {
    return (value || "")
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("-");
}

function transformComparables(rows: Array<{
    propertyType: string;
    district: string;
    layout: string;
    ratePerSqm: number;
    saleType: string;
}>): ComparableTransaction[] {
    return rows.map((r) => ({
        propertyType: `${titleCaseSlug(r.propertyType)} · ${titleCaseSlug(r.layout)}`,
        district: r.district,
        pricePerSqm: `AED ${Math.round(r.ratePerSqm ?? 0).toLocaleString()}`,
        status: titleCaseSlug(r.saleType) as ComparableTransaction["status"],
    }));
}

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
    const [districts, setDistricts] = useState<string[]>([]);
    const [form, setForm] = useState({
        propertyType: PROPERTY_TYPE_OPTIONS[0],
        district: "",
        sizeSqm: "",
        askingPrice: "",
        saleType: SALE_TYPE_OPTIONS[0],
        bedrooms: "",
        expectedAnnualRent: "",
    });
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<DealAnalysisResult | null>(null);
    const [priceTrend, setPriceTrend] = useState<Array<{ month: string; price: number }> | undefined>(undefined);
    const [comparables, setComparables] = useState<ComparableTransaction[] | null>(null);

    useEffect(() => {
        appService.getAllDistricts().then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const items = res.data?.data ?? [];
                const names = items
                    .map((item: any) => (typeof item === "string" ? item : item.name ?? ""))
                    .filter(Boolean);
                setDistricts(names);
                setForm((prev) => (prev.district ? prev : { ...prev, district: names[0] ?? "" }));
            }
        });
    }, []);

    useEffect(() => {
        if (!form.district) return;
        appService.getPriceTrend("last_year", form.district).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const rows = res.data?.data ?? [];
                setPriceTrend(transformDistrictPriceTrend(rows));
            }
        });
    }, [form.district]);

    useEffect(() => {
        if (!form.district) return;
        appService.getDealComparables({
            district: form.district,
            propertyType: slugify(form.propertyType),
            saleType: slugify(form.saleType),
            bedrooms: form.bedrooms ? slugify(form.bedrooms) : undefined,
            limit: 10,
        }).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const rows = res.data?.data ?? [];
                setComparables(transformComparables(rows));
            }
        });
    }, [form.district, form.propertyType, form.saleType, form.bedrooms]);

    function slugify(value: string) {
        return value
            .toLowerCase()
            .replace(/\s*\/\s*/g, "-")
            .replace(/\s+/g, "-");
    }

    function parseNumber(value: string) {
        const digits = value.replace(/[^0-9.]/g, "");
        return digits ? Number(digits) : 0;
    }

    async function handleAnalyze() {
        if (!form.district || !form.sizeSqm || !form.askingPrice) {
            toast.error("Please fill in district, property size, and asking price.");
            return;
        }

        setAnalyzing(true);
        const payload: Record<string, any> = {
            propertyType: slugify(form.propertyType),
            district: form.district,
            areaSqm: parseNumber(form.sizeSqm),
            askingPriceAed: parseNumber(form.askingPrice),
            saleType: slugify(form.saleType),
            saveResult: true,
        };
        if (form.bedrooms) payload.bedrooms = slugify(form.bedrooms);
        if (form.expectedAnnualRent) payload.expectedAnnualRentAed = parseNumber(form.expectedAnnualRent);

        const res = await appService.analyzeDeal(payload as any);
        setAnalyzing(false);

        if ((res?.status === 200 || res?.status === 201) && res?.data?.data) {
            setResult(res.data.data);
            toast.success("Deal analyzed successfully.");
        } else {
            toast.error(res?.data?.message || res?.data?.error || "Failed to analyze deal.");
        }
    }

    const score = result?.dealScore ?? 85;
    const band = getScoreBand(score);
    const verdictLabel = result?.dealVerdictLabel ?? band.label;
    const description = result
        ? `${result.marketVerdict}. This property is priced ${Math.abs(result.pricePositionPct).toFixed(1)}% ${result.pricePositionPct < 0 ? "below" : "above"} the estimated market average, based on ${result.comparableTransactions.toLocaleString()} comparable transactions.`
        : "This property is currently priced below the district-adjusted market average based on recent comparable transactions.";

    const assessmentStats = result ? [
        { ...DEAL_ASSESSMENT_STATS[0], value: formatAedMetric(result.askingPriceAed) },
        { ...DEAL_ASSESSMENT_STATS[1], value: formatAedMetric(result.estimatedMarketPriceAed) },
        { ...DEAL_ASSESSMENT_STATS[2], value: `${Math.abs(result.pricePositionPct).toFixed(1)}%`},
        { ...DEAL_ASSESSMENT_STATS[3], value: result.marketVerdict },
    ] : DEAL_ASSESSMENT_STATS;

    const marketStats = result ? [
        { ...DEAL_MARKET_DATA[0], value: formatAedMetric(result.avgPricePerSqm) },
        { ...DEAL_MARKET_DATA[1], value: `${result.comparableTransactions.toLocaleString()} Sales` },
        { ...DEAL_MARKET_DATA[2], value: getTrendDisplay(result.districtTrend) },
        { ...DEAL_MARKET_DATA[3], value: result.demandActivity, valueColor: getDemandColor(result.demandActivity) },
    ] : DEAL_MARKET_DATA;

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
                                <select
                                    className={formSelect}
                                    value={form.propertyType}
                                    onChange={(e) => setForm((prev) => ({ ...prev, propertyType: e.target.value }))}
                                >
                                    {PROPERTY_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>District</label>

                            <div className="relative">
                                <select
                                    className={formSelect}
                                    value={form.district}
                                    onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                                >
                                    {districts.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>Property Size (SQM)</label>
                            <input
                                type="number"
                                placeholder="145 sqm"
                                className={formInput}
                                value={form.sizeSqm}
                                onChange={(e) => setForm((prev) => ({ ...prev, sizeSqm: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className={fieldLbl}>Asking Price</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="AED 2,400,000"
                                className={formInput}
                                value={form.askingPrice}
                                onChange={(e) => setForm((prev) => ({ ...prev, askingPrice: e.target.value.replace(/[^0-9]/g, "") }))}
                            />
                        </div>
                        <div>
                            <label className={fieldLbl}>Sale Type</label>

                            <div className="relative">
                                <select
                                    className={formSelect}
                                    value={form.saleType}
                                    onChange={(e) => setForm((prev) => ({ ...prev, saleType: e.target.value }))}
                                >
                                    {SALE_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>Bedrooms (Optional)</label>

                            <div className="relative">
                                <select
                                    className={formSelect}
                                    value={form.bedrooms}
                                    onChange={(e) => setForm((prev) => ({ ...prev, bedrooms: e.target.value }))}
                                >
                                    <option value="">Select</option>
                                    {BEDROOM_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={fieldLbl}>Expected Annual Rent (Optional)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="AED 85,000"
                                className={formInput}
                                value={form.expectedAnnualRent}
                                onChange={(e) => setForm((prev) => ({ ...prev, expectedAnnualRent: e.target.value.replace(/[^0-9]/g, "") }))}
                            />
                        </div>
                        <ModalButton className="py-4!" onClick={handleAnalyze} disabled={analyzing}>
                            {analyzing ? "ANALYZING..." : "ANALYZE DEAL"}
                        </ModalButton>
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
                            <DealAssessmentGauge score={score} />
                            <span
                                className="flex items-center gap-1.5 text-[11px] font-medium rounded-xs px-1.5 py-0.5 uppercase tracking-wider"
                                style={{ color: band.color, background: band.bg }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: band.color }} />
                                {verdictLabel}
                            </span>
                            <p className="text-[9px] text-(--db-text-primary) text-center leading-relaxed">
                                {description}
                            </p>
                        </div>
                        {/* Stat sections */}
                        <div className="flex flex-col bg-(--db-main-bg) p-5 gap-5.75">
                            <div>
                                <p className="text-[17px] font-semibold text-[#D28A44] mb-1.5">Notification Methods</p>
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                    {assessmentStats.map((s) => (
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
                                    {marketStats.map((m) => (
                                        <div key={m.label} className="bg-(--db-sidebar-bg) rounded-xs p-2.5">
                                             <div className="flex items-center gap-2.5 mb-2 text-[#D28A44]">
                                                <div className="bg-[#D28A441F] w-5.75 h-5.75 rounded-[3px] flex justify-center items-center">
                                                    {m.icon}
                                                </div>
                                                <span className="text-xs text-(--db-text-primary)">{m.label}</span>
                                            </div>
                                            {"valueColor" in m && m.valueColor ? (
                                                <div style={{ color: m.valueColor as string }}>
                                                    <AnimatedNumber value={m.value} className="text-sm font-semibold" />
                                                </div>
                                            ) : (
                                                <AnimatedNumber value={m.value} className="text-sm font-semibold text-(--db-text-primary)" />
                                            )}
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
                    <PriceVsMarketChart data={result?.priceVsMarketChart} />
                </Card>

                {/* ── District Price Trend ── */}
                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Price Trend — Last 12 Months</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Median transaction pricing across recent comparable properties.</p>
                        </div>
                    </div>
                    <DistrictPriceTrendChart data={priceTrend} />
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
                                {(comparables ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-6 text-center text-(--db-text-primary)">No data found</td>
                                    </tr>
                                ) : (
                                    (comparables ?? []).map((tx, i) => (
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </div>
    );
}
