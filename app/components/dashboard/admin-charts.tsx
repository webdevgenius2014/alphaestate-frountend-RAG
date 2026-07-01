"use client";

import { useState } from "react";
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { USER_ACTIVITY_DATA, SUB_PLAN_DATA } from "@/app/(admin dashboard)/constants";
import { useAnimSync } from "./use-anim-sync";

const tooltipStyle = {
    contentStyle: {
        background: "var(--db-sidebar-bg)",
        border: "1px solid var(--db-border)",
        borderRadius: 6,
        fontSize: 12,
        color: "var(--db-text-primary)",
    },
    labelStyle: { color: "var(--db-text-primary)" },
    cursor: { stroke: "var(--db-border)" },
};

const UA_SERIES = [
    { key: "activeUsers", label: "Active Users",      color: "#0B1F3A", grad: "uaUsersGrad"   },
    { key: "queries",     label: "AI Queries",        color: "#D28A44", grad: "uaQueriesGrad" },
    { key: "reports",     label: "Reports Generated", color: "#5E9F62", grad: "uaReportsGrad" },
] as const;

export function UserActivityChart({ data: apiData }: { data?: { month: string; activeUsers?: number; queries?: number; reports?: number }[] }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const toggle = (key: string) =>
        setHidden(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    const chartData = apiData?.length ? apiData : USER_ACTIVITY_DATA;
    const series = apiData?.length ? UA_SERIES.filter(s => s.key in chartData[0]) : UA_SERIES;

    return (
        <div className="bg-(--db-main-bg) p-[8px_4px_4px]">
            <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                    <defs>
                        {series.map(s => (
                            <linearGradient key={s.grad} id={s.grad} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor={s.color} stopOpacity={0.16} />
                                <stop offset="100%" stopColor={s.color} stopOpacity={0.01} />
                            </linearGradient>
                        ))}
                    </defs>
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "var(--db-text-primary)" }}
                        axisLine={false} tickLine={false}
                    />
                    <YAxis
                        domain={[0, 35000]}
                        ticks={[0, 5000, 10000, 15000, 20000, 25000, 30000, 35000]}
                        tickFormatter={(v) => v === 0 ? "0" : `${v / 1000}k`}
                        tick={{ fontSize: 11, fill: "var(--db-text-primary)" }}
                        axisLine={false} tickLine={false}
                    />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(v) => [Number(v).toLocaleString(), undefined]}
                    />
                    {series.map(s => (
                        <Area
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={s.color}
                            strokeWidth={animActive ? 2 : 0}
                            fill={`url(#${s.grad})`}
                            dot={false}
                            hide={hidden.has(s.key)}
                            style={{ transition: "stroke-width 600ms ease" }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-5 mt-3 justify-center">
                {series.map(s => (
                    <button
                        key={s.key}
                        onClick={() => toggle(s.key)}
                        className="flex items-center gap-1.5 text-xs outline-none focus:outline-none transition-opacity"
                        style={{ opacity: hidden.has(s.key) ? 0.35 : 1 }}
                    >
                        <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                        <span style={{ color: "var(--db-text-primary)" }}>{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// outerR, innerR per ring — 14px thick bars, 8px gaps
const RINGS = [
    [100, 90],
    [85, 75],
    [65, 55],
] as const;

export function SubscriptionPieChart({ data: apiData }: { data?: { planName: string; count: number; percentage: number }[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const togglePlan = (name: string) =>
        setHidden(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });

    const planData = apiData?.length
        ? apiData.map((d, i) => {
            const match = SUB_PLAN_DATA.find(r => r.name.toLowerCase() === d.planName.toLowerCase());
            return { name: d.planName, value: d.percentage, color: match?.color ?? SUB_PLAN_DATA[i]?.color ?? "#D28A44" };
          })
        : SUB_PLAN_DATA;

    const activeData = planData[activeIndex] ?? planData[0];

    return (
        <div className="flex flex-col">
            <div className="relative" style={{ height: 150 }}>
                <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                        {planData.map((d, i) => {
                            const [outerR, innerR] = RINGS[i] ?? RINGS[RINGS.length - 1];
                            const isHidden = hidden.has(d.name);
                            // animating to 0 lets recharts smoothly retract the arc
                            const val = isHidden ? 0 : d.value;
                            return (
                                <Pie
                                    key={d.name}
                                    data={[{ value: val }, { value: 100 - val }]}
                                    cx="50%" cy="85%"
                                    startAngle={180} endAngle={0}
                                    innerRadius={innerR} outerRadius={outerR}
                                    dataKey="value"
                                    strokeWidth={0}
                                    paddingAngle={0}
                                    isAnimationActive={true}
                                    animationDuration={450}
                                    animationEasing="ease-out"
                                    onMouseEnter={(_, segIdx) => {
                                        if (segIdx === 0 && !isHidden) setActiveIndex(i);
                                    }}
                                >
                                    <Cell fill={d.color} />
                                    <Cell fill="transparent" />
                                </Pie>
                            );
                        })}
                    </PieChart>
                </ResponsiveContainer>
                <div
                    className="absolute left-0 right-0 flex flex-col items-center pointer-events-none"
                    style={{ top: "75%", transform: "translateY(-50%)" }}
                >
                    <span className="text-lg font-bold text-(--db-text-primary)">{activeData.value}%</span>
                    <span className="text-xs text-(--db-text-muted)">{activeData.name.replace(" Plan", "")}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
                {planData.map((d, i) => (
                    <button
                        key={d.name}
                        onClick={() => togglePlan(d.name)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className="flex items-center justify-between outline-none focus:outline-none w-full transition-opacity duration-300"
                        style={{ opacity: hidden.has(d.name) ? 0.35 : 1 }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                            <span className="text-xs text-(--db-text-primary)">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-(--db-text-primary)">{d.value}%</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
