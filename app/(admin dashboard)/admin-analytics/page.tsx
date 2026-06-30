"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
    AdminPlatformGrowthChart,
    AdminPlanGrowthChart,
    AdminSubscriberGrowthChart,
    AdminRevenueBreakdownChart,
    AdminToolUsageChart,
    SubscriptionPieChart,
} from "@/app/components/dashboard/admin-analytics-charts";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { SortIcon } from "@/app/(user dashboard)/constants";
import { AdminANALYTICS_STATS, AI_METRICSANALAYTCS } from "../constants";
import appService from "@/app/services/appService";

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

export default function AnalyticsPage() {
    const [overview, setOverview]                               = useState<any>(null);
    const [overviewPeriod, setOverviewPeriod]                   = useState("");
    const [overviewDistrict, setOverviewDistrict]               = useState("");
    const [overviewPropertyType, setOverviewPropertyType]       = useState("");
    const [platformGrowth, setPlatformGrowth]                   = useState<any>(null);
    const [platformGrowthPeriod, setPlatformGrowthPeriod]       = useState("last_year");
    const [districtPerformance, setDistrictPerformance]         = useState<any>(null);
    const [districtPeriod, setDistrictPeriod]                   = useState("");
    const [districtFilter, setDistrictFilter]                   = useState("");
    const [subscriptionPerformance, setSubscriptionPerformance] = useState<any>(null);
    const [investmentMovement, setInvestmentMovement]           = useState<any>(null);
    const [appreciationPotential, setAppreciationPotential]     = useState<any>(null);
    const [marketIntelligence, setMarketIntelligence]           = useState<any>(null);
    const [usage, setUsage]                                     = useState<any>(null);

    useEffect(() => {
        appService.getAnalyticsOverview(
            overviewPeriod || undefined,
            overviewDistrict || undefined,
            overviewPropertyType || undefined,
        ).then((res) => {
            if (res?.data?.data) setOverview(res.data.data);
        });
    }, [overviewPeriod, overviewDistrict, overviewPropertyType]);

    useEffect(() => {
        appService.getAnalyticsDistrictPerformance(districtPeriod || undefined, districtFilter || undefined).then((res) => {
            if (res?.data?.data) setDistrictPerformance(res.data.data);
        });
    }, [districtPeriod, districtFilter]);

    useEffect(() => {
        appService.getAnalyticsSubscriptionPerformance().then((res) => {
            if (res?.data?.data) setSubscriptionPerformance(res.data.data);
        });
        appService.getAnalyticsInvestmentMovement().then((res) => {
            if (res?.data?.data) setInvestmentMovement(res.data.data);
        });
        appService.getAnalyticsAppreciationPotential().then((res) => {
            if (res?.data?.data) setAppreciationPotential(res.data.data);
        });
        appService.getAnalyticsMarketIntelligence().then((res) => {
            if (res?.data?.data) setMarketIntelligence(res.data.data);
        });
        appService.getAnalyticsUsage().then((res) => {
            if (res?.data?.data) setUsage(res.data.data);
        });
    }, []);

    useEffect(() => {
        appService.getAnalyticsPlatformGrowth(platformGrowthPeriod).then((res) => {
            if (res?.data?.data) setPlatformGrowth(res.data.data);
        });
    }, [platformGrowthPeriod]);

    return (
        <div className="flex flex-col min-h-full">

            <div className="flex-1 space-y-6">

                <div className="flex items-end flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Analytics</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                            Analyze platform growth, user engagement, revenue trends, and market intelligence performance.
                        </p>
                    </div>
                </div>

                <Card className="p-4!">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex gap-3 items-center text-sm font-normal">
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button> Filter By
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="relative">
                                <select
                                    value={overviewPeriod}
                                    onChange={(e) => setOverviewPeriod(e.target.value)}
                                    className="text-xs border border-(--db-border) rounded-sm px-1.5 py-2 font-medium bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="">Date Range</option>
                                    <option value="last_year">Last Year</option>
                                    <option value="last_6months">Last 6 Months</option>
                                    <option value="last_month">Last Month</option>
                                </select>
                            </div>
                            <div className="relative">
                                <select
                                    value={overviewDistrict}
                                    onChange={(e) => setOverviewDistrict(e.target.value)}
                                    className="text-xs border border-(--db-border) rounded-sm px-1.5 py-2 font-medium bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="">District</option>
                                    <option value="Yas Island">Yas Island</option>
                                    <option value="Al Reem Island">Al Reem Island</option>
                                    <option value="Saadiyat Island">Saadiyat Island</option>
                                    <option value="AL Khali">AL Khali</option>
                                    <option value="Corniche">Corniche</option>
                                    <option value="Masdar City">Masdar City</option>
                                </select>
                            </div>
                            <div className="relative">
                                <select
                                    value={overviewPropertyType}
                                    onChange={(e) => setOverviewPropertyType(e.target.value)}
                                    className="text-xs border border-(--db-border) rounded-sm px-1.5 py-2 font-medium bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="">Property Type</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Townhouse">Townhouse</option>
                                    <option value="Office">Office</option>
                                    <option value="Land">Land</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {AdminANALYTICS_STATS.map((s, i) => {
                        const apiVals = [
                            overview?.totalUsers,
                            overview?.activeSubscribers,
                            overview?.monthlyRevenue,
                            overview?.totalAiQueries,
                        ];
                        const val = apiVals[i] != null ? String(apiVals[i]) : s.value;
                        return (
                            <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                                <div className="flex items-center justify-start gap-2 mb-2.5">
                                    <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                                    <SectionLabel>{s.label}</SectionLabel>
                                </div>
                                <AnimatedNumber value={val} className="text-2xl mb-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-[100%]" />
                            </div>
                        );
                    })}
                </div>

                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Platform Growth Trends</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Track platform adoption and engagement over time.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={platformGrowthPeriod}
                                onChange={(e) => setPlatformGrowthPeriod(e.target.value)}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="last_year">Last Year</option>
                                <option value="last_6months">6 Months</option>
                                <option value="last_month">Last Month</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>
                    <AdminPlatformGrowthChart data={platformGrowth ?? undefined} />
                </Card>

                <Card className="rounded-none!">
                    <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Performance Analytics</h2>
                            <p className="text-[13px] text-(--db-text-primary) mt-0.5">Compare investment activity across key districts.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={districtFilter}
                                onChange={(e) => setDistrictFilter(e.target.value)}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="">All Districts</option>
                                <option value="Yas Island">Yas Island</option>
                                <option value="Al Reem Island">Al Reem Island</option>
                                <option value="Saadiyat Island">Saadiyat Island</option>
                                <option value="AL Khali">AL Khali</option>
                                <option value="Corniche">Corniche</option>
                                <option value="Masdar City">Masdar City</option>
                            </select>
                            <select
                                value={districtPeriod}
                                onChange={(e) => setDistrictPeriod(e.target.value)}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="">All Time</option>
                                <option value="last_year">Last Year</option>
                                <option value="last_6months">6 Months</option>
                                <option value="last_month">Last Month</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>
                    <AdminPlanGrowthChart data={districtPerformance ?? undefined} />
                </Card>

                {/* ── Subscription Performance + AI Intelligence ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[30%_auto] gap-4">
                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Subscription Performance</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Monitor plan adoption, subscription growth, and recurring revenue performance.
                        </p>
                        <SubscriptionPieChart data={subscriptionPerformance ?? undefined} />
                    </Card>

                    <Card className="rounded-none!">
                        <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Investment Movement</h2>
                                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                                    Monitor transaction activity and investment volume across Abu Dhabi's real estate market.
                                </p>
                            </div>

                        </div>
                        <AdminSubscriberGrowthChart data={investmentMovement ?? undefined} />
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[28%_auto] gap-4">
                    <Card className="rounded-none!">
                        <div className="mb-4">
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Appreciation Potential</h2>
                            <p className="text-xs text-(--db-text-primary) mt-0.5">Identify districts with the strongest growth potential.</p>
                        </div>
                        <AdminRevenueBreakdownChart data={appreciationPotential ?? undefined} />
                    </Card>

                      <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">AI Intelligence Performance</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            AI-powered insights generated from platform and market activity.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {AI_METRICSANALAYTCS.map((m, i) => {
                                const apiValues = [
                                    marketIntelligence?.strongestInvestmentDistrict,
                                    marketIntelligence?.highestAppreciationDistrict,
                                    marketIntelligence?.mostActiveMarket,
                                    marketIntelligence?.marketSignal,
                                ];
                                const displayValue = apiValues[i] ?? m.value;
                                return (
                                    <div key={m.label}>
                                        <div className="flex flex-col bg-(--db-main-bg) gap-6 justify-between p-6.75">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-sm bg-[#D28A441F] flex items-center justify-center shrink-0">
                                                    {m.icon}
                                                </div>
                                                <span className="text-sm font-medium text-(--db-text-primary)">{m.label}</span>
                                            </div>
                                            <div className="flex gap-14 items-center">
                                                <p className="text-[20px] font-semibold text-(--db-text-primary)">{displayValue}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                    
                </div>

                <div className="grid grid-cols-1">
                    <Card className="rounded-none!">
                        <div className="flex items-start flex-wrap justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Report & Deal Analyzer Usage</h2>
                                <p className="text-xs text-(--db-text-primary) mt-0.5">Track how investors use Alpha Estate's intelligence and reporting tools.</p>
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
                        <AdminToolUsageChart data={usage ?? undefined} />
                    </Card>
                </div>

            </div>
        </div>
    );
}
