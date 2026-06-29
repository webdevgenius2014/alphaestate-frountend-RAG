"use client";

import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { AI_CHAT_STATS, AI_CHAT_LOGS } from "@/app/(admin dashboard)/constants";

const tdCls = "px-5 py-3.5 text-(--db-text-primary) whitespace-nowrap";
const thCls = "px-5 py-3 font-semibold whitespace-nowrap text-left";

export function AIChatMonitoring() {
    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">AI Chat Monitoring</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Monitor AI conversations, user queries, and response performance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {AI_CHAT_STATS.map((s) => (
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
                            <th className={thCls}>User</th>
                            <th className={thCls}>Query</th>
                            <th className={thCls}>Category</th>
                            <th className={thCls}>Confidence</th>
                            <th className={thCls}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AI_CHAT_LOGS.map((row, i) => (
                            <tr
                                key={i}
                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                            >
                                <td className={`${tdCls} font-medium`}>{row.user}</td>
                                <td className={tdCls}>{row.query}</td>
                                <td className={tdCls}>{row.category}</td>
                                <td className={tdCls}>{row.confidence}</td>
                                <td className={`${tdCls} text-(--db-text-muted)`}>{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
