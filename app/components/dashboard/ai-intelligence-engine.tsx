"use client";

import { useEffect, useState } from "react";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { AI_INTELLIGENCE_STATS, AI_INSIGHTS_FEED } from "@/app/(admin dashboard)/constants";

export function AIIntelligenceEngine() {
    const [stats, setStats] = useState<{
        insightsGenerated: number;
        marketSignals: number;
        predictionAccuracy: number;
        activeAiModels: number;
    } | null>(null);
    const [feed, setFeed] = useState<string[]>([]);
    const [engineStatus, setEngineStatus] = useState<{ status: string; queriesProcessed: number } | null>(null);

    useEffect(() => {
        appService.getAiIntelligenceEngine().then((res) => {
            const d = res?.data?.data;
            if (d) {
                if (d.stats) setStats(d.stats);
                if (Array.isArray(d.aiInsightsFeed)) setFeed(d.aiInsightsFeed);
                if (d.engineStatus) setEngineStatus(d.engineStatus);
            }
        });
    }, []);

    const apiStats: (string | undefined)[] = [
        stats?.insightsGenerated?.toLocaleString(),
        stats?.marketSignals?.toLocaleString(),
        stats ? `${stats.predictionAccuracy}%` : undefined,
        stats?.activeAiModels != null ? String(stats.activeAiModels) : undefined,
    ];

    const insights = feed.length > 0 ? feed : AI_INSIGHTS_FEED;
    const isRunning = (engineStatus?.status ?? "Running").toLowerCase() === "running";

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            {/* Section header */}
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">AI Intelligence Engine</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Track AI-generated insights and market intelligence activity.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {AI_INTELLIGENCE_STATS.map((s, i) => (
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

            {/* Bottom: AI Insights Feed + AI Engine Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_40%] gap-5">

                {/* AI Insights Feed */}
                <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-wrap items-start justify-between gap-4 overflow-hidden">
                    <div className="flex flex-col gap-3 md:flex-1 min-w-0">
                        <h3 className="text-base font-medium text-(--db-text-primary)">AI Insights Feed</h3>
                        <ul className="flex flex-col gap-2.5">
                            {insights.map((insight, i) => (
                                <li key={i} className="text-sm text-(--db-text-primary) flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D28A44] shrink-0" />
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="shrink-0 w-43.5 h-43.5 rounded-md overflow-hidden relative flex items-center justify-center bg-black">
                        <video
                            src="/globe.webm"
                            autoPlay
                            muted
                            playsInline
                            loop
                            className="w-full h-full object-cover scale-125"
                        />
                    </div>
                </div>

                {/* AI Engine Status */}
                <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-4">
                    <h3 className="text-base font-medium text-(--db-text-primary)">AI Engine Status</h3>
                    <div className="flex flex-col gap-3">
                        <span
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold w-full ${isRunning ? "bg-[#5E9F622E] text-[#5E9F62]" : "bg-[#CF2D482E] text-[#CF2D48]"
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-[#5E9F62]" : "bg-[#CF2D48]"}`} />
                            {engineStatus?.status ?? "Running"}
                        </span>
                        <p className="text-sm text-(--db-text-primary)">
                            {(engineStatus?.queriesProcessed ?? 124821).toLocaleString()} Queries Processed
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
