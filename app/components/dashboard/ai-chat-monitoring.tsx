"use client";

import { useEffect, useState } from "react";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { AI_CHAT_STATS, AI_CHAT_LOGS } from "@/app/(admin dashboard)/constants";

const tdCls = "px-5 py-3.5 text-(--db-text-primary) whitespace-nowrap";
const thCls = "px-5 py-3 font-semibold whitespace-nowrap text-left";

export function AIChatMonitoring() {
    const [stats, setStats] = useState<{
        totalConversations: number;
        aiQueriesToday: number;
        avgResponseTimeSec: number;
        successRate: number;
    } | null>(null);
    const [logs, setLogs] = useState<{
        userName: string;
        query: string;
        category: string;
        confidence: string;
        createdAt: string;
        timeAgo: string;
    }[]>([]);

    useEffect(() => {
        appService.getAiMonitoring().then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                if (d.stats) setStats(d.stats);
                if (Array.isArray(d.recentQueries)) setLogs(d.recentQueries);
            }
        });
    }, []);

    const apiStats: (string | undefined)[] = [
        stats?.totalConversations?.toLocaleString(),
        stats?.aiQueriesToday?.toLocaleString(),
        stats ? `${stats.avgResponseTimeSec}s` : undefined,
        stats ? `${stats.successRate}%` : undefined,
    ];

    const rows = logs.length > 0 ? logs : AI_CHAT_LOGS;

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">AI Chat Monitoring</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Monitor AI conversations, user queries, and response performance.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {AI_CHAT_STATS.map((s, i) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] w-10 h-10 flex justify-center items-center rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <AnimatedNumber
                            value={apiStats[i] ?? s.value}
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
                            {/* Could be user further */}
                            {/* <th className={thCls}>Confidence</th> */}
                            <th className={thCls}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, i: number) => (
                            <tr
                                key={i}
                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                            >
                                <td className={`${tdCls} font-medium`}>{row.userName ?? row.user}</td>
                                <td className={tdCls}>{row.query}</td>
                                <td className={tdCls}>{row.category}</td>
                                {/* Could be used further */}
                                {/* <td className={tdCls}>{row.confidence}</td> */}
                                <td className={`${tdCls} text-(--db-text-muted)`}>{row.timeAgo ?? row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
