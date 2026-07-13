"use client";

import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import Button from "@/app/components/ui/button";
import { ExportReportModal } from "@/app/components/dashboard/export-report-modal";
import { PriceTrendChart, RentalYieldChart, CapRateChart } from "@/app/components/dashboard/charts";
import { DistrictROIChart, InvestmentMovementChart, AIMarketIntelWidget } from "@/app/components/dashboard/analytics-charts";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { ANALYTICS_STATS, SortIcon } from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function TrendArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.28731 4.99392C5.28731 4.60272 5.60445 4.28558 5.99565 4.28558H12.0059H12.0062H12.0165C12.4077 4.28558 12.7248 4.60272 12.7248 4.99392V11.0147C12.7248 11.4059 12.4077 11.7231 12.0165 11.7231C11.6253 11.7231 11.3082 11.4059 11.3082 11.0147V6.69357L5.49478 12.5069C5.21816 12.7835 4.76966 12.7835 4.49304 12.5069C4.21643 12.2303 4.21643 11.7818 4.49304 11.5052L10.296 5.70224H5.99565C5.60445 5.70224 5.28731 5.38513 5.28731 4.99392Z" fill="currentColor" />
        </svg>
    );
}

function SectionLabel({ children }: { children: ReactNode }) {
    return <p className="text-sm font-medium text-(--db-text-primary)">{children}</p>;
}

function formatAedCompact(n: number) {
    if (n >= 1e9) return `AED ${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `AED ${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `AED ${(n / 1e3).toFixed(1)}K`;
    return `AED ${n.toFixed(0)}`;
}

function formatMonthLabel(monthStr: string) {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
}

function transformPriceTrend(rows: Array<{ month: string; district: string; avgPricePerSqm: number }>) {
    const byMonth = new Map<string, { yas: number; alReem: number }>();
    for (const row of rows) {
        if (!byMonth.has(row.month)) byMonth.set(row.month, { yas: 0, alReem: 0 });
        const entry = byMonth.get(row.month)!;
        const district = String(row.district ?? "").toLowerCase();
        if (district === "yas island") entry.yas = row.avgPricePerSqm;
        else if (district === "al reem island") entry.alReem = row.avgPricePerSqm;
    }
    return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, vals]) => ({ month: formatMonthLabel(month), ...vals }));
}

function transformCapRateMap(payload: { overallAvgCapRate?: number; overallAvgSqft?: number; districts?: Array<Record<string, any>> }) {
    return {
        districts: (payload.districts ?? []).map((d) => ({
            name: d.district ?? d.districtName ?? d.name,
            value: +((d.avgCapRate ?? d.capRate ?? d.value ?? 0) * 100).toFixed(1),
        })),
        overallValue: payload.overallAvgCapRate != null ? +(payload.overallAvgCapRate * 100).toFixed(1) : undefined,
        overallSqft: payload.overallAvgSqft,
    };
}

function transformInvestmentMovement(rows: Array<{ month: string; district: string; transactionCount: number }>) {
    const byMonth = new Map<string, { yas: number; alReem: number; saadiyat: number }>();
    for (const row of rows) {
        if (!byMonth.has(row.month)) byMonth.set(row.month, { yas: 0, alReem: 0, saadiyat: 0 });
        const entry = byMonth.get(row.month)!;
        const district = String(row.district ?? "").toLowerCase();
        if (district === "yas island") entry.yas = row.transactionCount;
        else if (district === "al reem island") entry.alReem = row.transactionCount;
        else if (district.includes("saadiyat")) entry.saadiyat = row.transactionCount;
    }
    return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, vals]) => ({ month: formatMonthLabel(month), ...vals }));
}

export default function AnalyticsPage() {
    const [exportOpen, setExportOpen] = useState(false);
    const closeExport = useCallback(() => setExportOpen(false), []);
    const [marketOverview, setMarketOverview] = useState<any>(null);
    const [priceTrend, setPriceTrend] = useState<any>(null);
    const [priceTrendPeriod, setPriceTrendPeriod] = useState<"last_year" | "last_2_years" | "all_time">("last_year");
    const [districtRoi, setDistrictRoi] = useState<any>(null);
    const [districtRoiMode, setDistrictRoiMode] = useState<"top3" | "all" | "specific">("all");
    const [districtOptions, setDistrictOptions] = useState<string[]>([]);
    const [districtRoiSpecific, setDistrictRoiSpecific] = useState<string>("");
    const [districtRoiPeriod, setDistrictRoiPeriod] = useState<"last_year" | "last_6months" | "last_2_years" | "all_time">("last_year");
    const [investmentMovement, setInvestmentMovement] = useState<any>(null);
    const [investmentMovementPeriod, setInvestmentMovementPeriod] = useState<"last_year" | "last_2_years" | "all_time">("last_year");
    const [rentalYieldByDistrict, setRentalYieldByDistrict] = useState<any>(null);
    const [rentalYieldPeriod, setRentalYieldPeriod] = useState<"last_6months" | "last_year" | "last_2_years" | "all_time">("last_year");
    const [capRateMap, setCapRateMap] = useState<any>(null);

    useEffect(() => {
        appService.getUserAnalytics().then((res) => {
            if (res?.data?.data) setMarketOverview(res.data.data);
        });
    }, []);

    useEffect(() => {
        appService.getPriceTrend(priceTrendPeriod).then((res) => {
            if (res?.data?.data) setPriceTrend(transformPriceTrend(res.data.data));
        });
    }, [priceTrendPeriod]);

    useEffect(() => {
        appService.getInvestmentMovement(investmentMovementPeriod).then((res) => {
            if (res?.data?.data) setInvestmentMovement(transformInvestmentMovement(res.data.data));
        });
    }, [investmentMovementPeriod]);

    useEffect(() => {
        appService.getRentalYieldByDistrict(rentalYieldPeriod).then((res) => {
            if (res?.data?.data) {
                setRentalYieldByDistrict(
                    res.data.data.map((d: any) => ({
                        district: d.districtName ?? d.district,
                        buy: 0,
                        rental: d.avgRentalYield ?? d.rental ?? 0,
                    }))
                );
            }
        });
    }, [rentalYieldPeriod]);

    useEffect(() => {
        appService.getCapRateMap().then((res) => {
            if (res?.data?.data) setCapRateMap(transformCapRateMap(res.data.data));
        });
    }, []);

    useEffect(() => {
        appService.getAllDistricts().then((res) => {
            const items = res?.data?.data ?? [];
            const names = items
                .map((item: any) => (typeof item === "string" ? item : item.name ?? item.district ?? ""))
                .filter(Boolean);
            setDistrictOptions(names);
            setDistrictRoiSpecific((prev) => prev || names[0] || "");
        });
    }, []);

    useEffect(() => {
        if (districtRoiMode === "specific" && !districtRoiSpecific) return;
        const filterValue = districtRoiMode === "specific" ? districtRoiSpecific : districtRoiMode;
        appService.getDistrictRoi(filterValue, districtRoiPeriod).then((res) => {
            if (res?.data?.data) {
                setDistrictRoi(res.data.data.map((d: any) => ({ district: d.districtName ?? d.district, roi: d.avgRoi ?? d.roi })));
            }
        });
    }, [districtRoiMode, districtRoiSpecific, districtRoiPeriod]);

    return (
        <div className="flex flex-col min-h-full">
            {exportOpen && <ExportReportModal onClose={closeExport} />}

            <div className="flex-1 space-y-6">

                <div className="flex items-end flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Market Analytics</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130.75">
                            Track district performance, Investment trends, rental yields, and AI-powered market intelligence in real time.
                        </p>
                    </div>
                    <Button
                        variant="navy"
                        className="w-auto! p-[10px_16px]! rounded-md! font-bold! text-xs! flex items-center gap-1.5 shrink-0"
                        onClick={() => setExportOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M8.5 10.625V2.125" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.875 10.625V13.4583C14.875 13.8341 14.7257 14.1944 14.4601 14.4601C14.1944 14.7257 13.8341 14.875 13.4583 14.875H3.54167C3.16594 14.875 2.80561 14.7257 2.53993 14.4601C2.27426 14.1944 2.125 13.8341 2.125 13.4583V10.625" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.95837 7.08334L8.50004 10.625L12.0417 7.08334" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        EXPORT REPORT
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {ANALYTICS_STATS.map((s, i) => {
                        const overrides = [
                            marketOverview?.avgMarketRoi != null
                                ? { value: `${marketOverview.avgMarketRoi.toFixed(1)}%` }
                                : null,
                            marketOverview?.avgRentalYield != null
                                ? { value: `${marketOverview.avgRentalYield.toFixed(1)}%` }
                                : null,
                            marketOverview?.totalTransactionVolume != null
                                ? {
                                      value: formatAedCompact(marketOverview.totalTransactionVolume),
                                      sub: marketOverview?.totalTransactionVolumeChange != null
                                          ? `${marketOverview.totalTransactionVolumeChange > 0 ? "+" : ""}${marketOverview.totalTransactionVolumeChange.toFixed(1)}% change`
                                          : undefined,
                                      up: marketOverview?.totalTransactionVolumeChange != null
                                          ? marketOverview.totalTransactionVolumeChange >= 0
                                          : undefined,
                                  }
                                : null,
                            null,
                        ][i];
                        const val = overrides?.value ?? s.value;
                        const sub = overrides?.sub ?? s.sub;
                        const up = overrides?.up ?? s.up;
                        return (
                            <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                                <div className="flex items-center justify-start gap-2 mb-2.5">
                                    <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                                    <SectionLabel>{s.label}</SectionLabel>
                                </div>
                                <AnimatedNumber value={val} className="text-2xl mb-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-[100%]" />
                                <div className="flex gap-2 items-center">
                                    <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-600" : "text-red-500"}`}>
                                        <span className={`${up ? "bg-[#5E9F621C] text-[#5E9F62]" : "bg-[#C46A6A33] text-[#CF2D48] -rotate-180"} w-6 h-6 rounded-full flex justify-center items-center`}>
                                            <TrendArrow />
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-normal text-(--db-text-primary)">{sub}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Price Trend — Price per sqft (AED)</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">12-month rolling · Top 3 districts</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={priceTrendPeriod}
                                onChange={(e) => setPriceTrendPeriod(e.target.value as "last_year" | "last_2_years" | "all_time")}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="last_year">Last Year</option>
                                <option value="last_2_years">Last 2 Years</option>
                                <option value="all_time">All time</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>
                    <PriceTrendChart data={priceTrend ?? undefined} />
                </Card>

                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District ROI Performance</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Average investment returns across top performing Abu Dhabi districts.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={districtRoiMode}
                                onChange={(e) => setDistrictRoiMode(e.target.value as "top3" | "all" | "specific")}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="top3">Top 3</option>
                                <option value="all">Top 10</option>
                                <option value="specific">Specific District</option>
                            </select>
                            {districtRoiMode === "specific" && (
                                <select
                                    value={districtRoiSpecific}
                                    onChange={(e) => setDistrictRoiSpecific(e.target.value)}
                                    className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    {districtOptions.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            )}
                            <select
                                value={districtRoiPeriod}
                                onChange={(e) => setDistrictRoiPeriod(e.target.value as "last_year" | "last_6months" | "last_2_years" | "all_time")}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="last_year">Last Year</option>
                                <option value="last_6months">6 Months</option>
                                <option value="last_2_years">Last 2 Years</option>
                                <option value="all_time">All Time</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>
                    <DistrictROIChart data={districtRoi ?? undefined} />
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_337px] gap-4">
                    <Card className="rounded-none!">
                        <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Investment Movement</h2>
                                <p className="text-[13px] text-(--db-text-primary) mt-0.5 max-w-109.75">
                                    Track capital flow, transaction momentum and investment activity across key real estate districts.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={investmentMovementPeriod}
                                    onChange={(e) => setInvestmentMovementPeriod(e.target.value as "last_year" | "last_2_years" | "all_time")}
                                    className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="last_year">Last Year</option>
                                    <option value="last_2_years">Last 2 Years</option>
                                    <option value="all_time">All Time</option>
                                </select>
                                <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                    <SortIcon />
                                </button>
                            </div>
                        </div>
                        <InvestmentMovementChart data={investmentMovement ?? undefined} />
                    </Card>

                    <Card className="rounded-none!">
                        <div className="mb-4">
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">AI Market Intelligence</h2>
                        </div>
                        <AIMarketIntelWidget />
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_300px] gap-4">
                    <Card className="rounded-none!">
                        <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Rental Yield by District</h2>
                                <p className="text-xs text-(--db-text-primary) mt-0.5">Current quarter · Freehold only</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={rentalYieldPeriod}
                                    onChange={(e) => setRentalYieldPeriod(e.target.value as "last_6months" | "last_year" | "last_2_years" | "all_time")}
                                    className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="last_6months">6 Months</option>
                                    <option value="last_year">Last Year</option>
                                    <option value="last_2_years">Last 2 Years</option>
                                    <option value="all_time">All Time</option>
                                </select>
                                <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                    <SortIcon />
                                </button>
                            </div>
                        </div>
                        <RentalYieldChart data={rentalYieldByDistrict ?? undefined} />
                    </Card>

                    <Card className="rounded-none!">
                        <div className="mb-4">
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Cap Rate Map</h2>
                            <p className="text-xs text-(--db-text-primary) mt-0.5">Q1 2026 · All districts</p>
                        </div>
                        <CapRateChart
                            data={capRateMap?.districts}
                            overallValue={capRateMap?.overallValue}
                            overallSqft={capRateMap?.overallSqft}
                        />
                    </Card>
                </div>

            </div>
        </div>
    );
}
