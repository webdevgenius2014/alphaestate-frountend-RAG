"use client";

import { useEffect, useState } from "react";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { MARKET_STATS, MARKET_METRICS, tdCls, thCls } from "@/app/(admin dashboard)/constants";

function pick(obj: any, keys: string[]): unknown {
    for (const k of keys) {
        if (obj?.[k] != null) return obj[k];
    }
    return undefined;
}

function formatCount(v: unknown): string | undefined {
    if (v == null) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : n.toLocaleString();
}

export function MarketAnalyticsData() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        appService.getMarketAnalyticsData().then((res) => {
            const d = res?.data?.data;
            if (d) setData(d);
        });
    }, []);

    const apiStats: (string | undefined)[] = [
        formatCount(pick(data, ["marketRecords", "totalMarketRecords", "recordsCount"])),
        formatCount(pick(data, ["marketIndicators", "totalMarketIndicators", "indicatorsCount"])),
        formatCount(pick(data, ["activeDataSources", "dataSourcesCount", "activeSources"])),
        formatCount(pick(data, ["lastRefreshMinutes", "lastRefreshMins", "lastRefreshAgo"])),
    ];

    const metricsSource = pick(data, ["metrics", "marketMetrics", "items"]);
    const rows = Array.isArray(metricsSource) && metricsSource.length > 0 ? metricsSource : MARKET_METRICS;

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Market Analytics Data</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Manage market indicators and investment metrics used across the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {MARKET_STATS.map((s, i) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] w-10 h-10 flex justify-center items-center rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <AnimatedNumber
                                value={apiStats[i] ?? s.value}
                                className="text-2xl md:text-[42px] font-semibold text-(--db-text-primary) leading-none"
                            />
                            {s.suffix && (
                                <span className="text-base md:text-xl font-semibold text-(--db-text-primary)">{s.suffix}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto border border-(--db-border) rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                            <th className={thCls}>Metric</th>
                            <th className={thCls}>Current Value</th>
                            <th className={thCls}>Unit</th>
                            <th className={thCls}>Last Updated</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, i: number) => (
                            <tr
                                key={i}
                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                            >
                                <td className={`${tdCls} font-medium`}>{row.metric ?? row.name ?? row.label}</td>
                                <td className={tdCls}>{row.currentValue ?? row.value}</td>
                                <td className={`${tdCls} uppercase`}>{row.unit ?? "-"}</td>
                                <td className={tdCls}>{row.lastUpdated ?? row.updatedAt ?? row.lastUpdatedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
