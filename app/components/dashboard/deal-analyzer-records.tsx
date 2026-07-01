"use client";

import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import {
    DEAL_ANALYZER_STATS,
    DEAL_ANALYZER_RECORDS,
    DEAL_VERDICT_CONFIG,
    EyeIcon,
    DownloadIcon,
    TrashIcon,
    thCls,
    tdCls,
    actionBtnCls,
} from "@/app/(admin dashboard)/constants";


export function DealAnalyzerRecords() {
    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Deal Analyzer Records</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Review and manage historical deal analysis records.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {DEAL_ANALYZER_STATS.map((s) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] w-10 h-10 flex justify-center items-center rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <AnimatedNumber
                            value={s.value}
                            className="text-2xl md:text-[42px] font-semibold text-(--db-text-primary) leading-none mt-1"
                        />
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto border border-(--db-border) rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                            <th className={thCls}>Property</th>
                            <th className={thCls}>District</th>
                            <th className={thCls}>Deal Score</th>
                            <th className={thCls}>Verdict</th>
                            <th className={thCls}>Date</th>
                            <th className={thCls}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DEAL_ANALYZER_RECORDS.map((row, i) => {
                            return (
                                <tr
                                    key={i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={`${tdCls} font-medium`}>{row.property}</td>
                                    <td className={tdCls}>{row.district}</td>
                                    <td className={tdCls}>{row.dealScore}</td>
                                    <td className={tdCls}>
                                        <span className={`flex items-center gap-1.5`}>
                                            {row.verdict}
                                        </span>
                                    </td>
                                    <td className={tdCls}>{row.date}</td>
                                    <td className={tdCls}>
                                        <div className="flex items-center gap-2">
                                            <button className={actionBtnCls}><EyeIcon /></button>
                                            <button className={actionBtnCls}><DownloadIcon /></button>
                                            <button className={`${actionBtnCls} hover:bg-[#E05252]`}><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
