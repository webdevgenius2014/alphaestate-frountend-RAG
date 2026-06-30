"use client";

import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { MARKET_STATS, MARKET_METRICS, EditIcon, actionBtnCls, tdCls, thCls } from "@/app/(admin dashboard)/constants";

export function MarketAnalyticsData() {
    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Market Analytics Data</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Manage market indicators and investment metrics used across the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {MARKET_STATS.map((s) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] w-10 h-10 flex justify-center items-center rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <AnimatedNumber
                                value={s.value}
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
                            <th className={thCls}>Last Updated</th>
                            <th className={thCls}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MARKET_METRICS.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                            >
                                <td className={`${tdCls} font-medium`}>{row.metric}</td>
                                <td className={tdCls}>{row.currentValue}</td>
                                <td className={tdCls}>{row.lastUpdated}</td>
                                <td className={tdCls}>
                                    <button className={actionBtnCls}><EditIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
