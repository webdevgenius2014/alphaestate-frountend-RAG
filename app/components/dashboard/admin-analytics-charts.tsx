"use client";

import { useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
    ADMIN_PLATFORM_GROWTH_DATA,
    ADMIN_DISTRICT_DATA,
    ADMIN_INVESTMENT_DATA,
    ADMIN_REVENUE_BREAKDOWN,
    ADMIN_TOOL_USAGE_DATA,
    SUB_PLAN_DATA,
} from "@/app/(admin dashboard)/constants";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { useAnimSync, COUNT_MS } from "@/app/components/dashboard/use-anim-sync";

const tooltipStyle = {
    contentStyle: {
        background: "var(--db-sidebar-bg)",
        border: "1px solid var(--db-border)",
        borderRadius: 6,
        fontSize: 12,
        color: "var(--db-text-primary)",
    },
    labelStyle: { color: "var(--db-text-primary)" },
};

// ── Platform Growth Trends (Area chart — mirrors PriceTrendChart) ───────────

function GrowthTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "var(--db-sidebar-bg)",
            border: "1px solid #D28A4450",
            borderRadius: 8,
            padding: "8px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
            <p style={{ color: "#D28A44", fontSize: 10, fontWeight: 600, marginBottom: 4 }}>{label} 2025</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
                    {p.value.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 400 }}>{p.name}</span>
                </p>
            ))}
        </div>
    );
}

export function AdminPlatformGrowthChart({ data: apiData }: { data?: any[] }) {
    const animActive = useAnimSync();
    const [showTotalUsers, setShowTotalUsers] = useState(true);
    const [showSubscribers, setShowSubscribers] = useState(true);
    const chartData = apiData ?? ADMIN_PLATFORM_GROWTH_DATA;

    return (
        <div className="bg-(--db-main-bg) p-[24px_21px]">
            <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="adminTotalUsersGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#D28A44" stopOpacity={0.32} />
                            <stop offset="95%" stopColor="#D28A44" stopOpacity={0.04} />
                        </linearGradient>
                        <linearGradient id="adminSubscribersGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#0B1F3A" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "var(--db-text-primary)", fontSize: 13 }}
                        axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fill: "var(--db-text-primary)", fontSize: 13 }}
                        axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                        tickMargin={10}
                        tickFormatter={(v) => v.toLocaleString()}
                        width={60}
                        domain={[0, 'auto']}
                    />
                    <Tooltip content={<GrowthTooltip />} cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }} />
                    <Area
                        type="natural" dataKey="activeSubscribers" name="Active Subscribers" stroke="#0B1F3A" strokeWidth={2}
                        fill="url(#adminSubscribersGrad)" dot={false}
                        hide={!showSubscribers}
                        isAnimationActive={animActive}
                        animationDuration={COUNT_MS}
                        animationEasing="ease-in-out"
                    />
                    <Area
                        type="natural" dataKey="totalUsers" name="Total Users" stroke="#D28A44" strokeWidth={2}
                        fill="url(#adminTotalUsersGrad)" dot={false}
                        hide={!showTotalUsers}
                        isAnimationActive={animActive}
                        animationDuration={COUNT_MS}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-5 mt-3 justify-center">
                <button
                    onClick={() => setShowTotalUsers(v => !v)}
                    className="flex items-center gap-1.5 text-xs outline-none focus:outline-none transition-opacity"
                    style={{ opacity: showTotalUsers ? 1 : 0.35 }}
                >
                    <span className="inline-block w-3.25 h-3.25 rounded-full" style={{ background: "#D28A44" }} />
                    <span style={{ color: "var(--db-text-primary)", textDecoration: showTotalUsers ? "none" : "line-through" }}>
                        Total Users
                    </span>
                </button>
                <button
                    onClick={() => setShowSubscribers(v => !v)}
                    className="flex items-center gap-1.5 text-xs outline-none focus:outline-none transition-opacity"
                    style={{ opacity: showSubscribers ? 1 : 0.35 }}
                >
                    <span className="inline-block w-3.25 h-3.25 rounded-full" style={{ background: "#0B1F3A" }} />
                    <span style={{ color: "var(--db-text-primary)", textDecoration: showSubscribers ? "none" : "line-through" }}>
                        Active Subscribers
                    </span>
                </button>
            </div>
        </div>
    );
}

// ── District Performance Analytics (Horizontal Bar — mirrors DistrictROIChart) ──

export function AdminPlanGrowthChart({ data: apiData }: { data?: Array<{ district: string; avgRoi: number }> }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<number>>(new Set());
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const toggle = (idx: number) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const baseRows = apiData
        ? apiData.map((d, i) => {
            const match = ADMIN_DISTRICT_DATA.find(r => r.district.toLowerCase() === d.district.toLowerCase());
            return { district: d.district, roi: d.avgRoi, color: match?.color ?? ADMIN_DISTRICT_DATA[i]?.color ?? "#D28A44" };
          })
        : ADMIN_DISTRICT_DATA;

    const chartData = baseRows.map((d, i) => ({
        district: d.district,
        roi: hidden.has(i) ? 0 : d.roi,
    }));

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={380}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: -20, bottom: 10 }}
                        barSize={48}
                    >
                        <defs>
                            <pattern
                                id="adminPlanStripe"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(45)"
                            >
                                <rect width="8" height="8" fill="#D8D4CE" />
                                <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="4" />
                            </pattern>
                        </defs>
                        <CartesianGrid horizontal={false} stroke="var(--db-border)" strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            domain={[0, 18]}
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }}
                            tickLine={false}
                            ticks={[0, 3, 6, 9, 12, 15, 18]}
                        />
                        <YAxis
                            type="category"
                            dataKey="district"
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={140}
                        />
                        <Tooltip
                            formatter={(v) => [`${v}%`, "ROI"]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ fill: "var(--db-border)", fillOpacity: 0.15 }}
                        />
                        <Bar
                            dataKey="roi"
                            radius={[0, 12, 12, 0]}
                            isAnimationActive={animActive}
                            animationDuration={COUNT_MS}
                            animationEasing="ease-in-out"
                            onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                            onMouseLeave={() => setHoverIdx(null)}
                        >
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={hoverIdx === i ? baseRows[i].color : "url(#adminPlanStripe)"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {baseRows.map((item, idx) => {
                    const isHidden = hidden.has(idx);
                    return (
                        <button
                            key={item.district}
                            onClick={() => toggle(idx)}
                            className="flex items-center gap-1.5 text-xs outline-none transition-opacity"
                            style={{ opacity: isHidden ? 0.35 : 1 }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                            <span style={{ color: "var(--db-text-primary)", textDecoration: isHidden ? "line-through" : "none" }}>
                                {item.district}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Investment Movement (Line chart — 2 districts, AED millions) ─────────────

const INVESTMENT_SERIES = [
    { key: "yasIsland"    as const, name: "Yas Island",     color: "#D28A44" },
    { key: "alReemIsland" as const, name: "AL Reem Island", color: "#0B1F3A" },
];

const fmtAED = (v: number) => v >= 1000 ? `AED ${v / 1000}B` : `AED ${v}M`;

export function AdminSubscriberGrowthChart({ data: apiData }: { data?: { months: string[]; series: { district: string; data: number[] }[] } }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const toggle = (key: string) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    const seriesDef = apiData
        ? apiData.series.map((s, i) => ({
            key: `s${i}`,
            name: s.district,
            color: INVESTMENT_SERIES[i]?.color ?? "#D28A44",
          }))
        : INVESTMENT_SERIES;

    const chartData = apiData
        ? apiData.months.map((month, mi) => {
            const row: Record<string, string | number> = { month };
            apiData.series.forEach((s, i) => {
                const key = `s${i}`;
                row[key] = hidden.has(key) ? 0 : Math.round((s.data[mi] ?? 0) / 1_000_000);
            });
            return row;
          })
        : ADMIN_INVESTMENT_DATA.map((d) => ({
            month: d.month,
            yasIsland:    hidden.has("yasIsland")    ? 0 : d.yasIsland,
            alReemIsland: hidden.has("alReemIsland") ? 0 : d.alReemIsland,
          }));

    const yConfig = apiData
        ? (() => {
            const allVals = apiData.series.flatMap(s => s.data.map(v => Math.round(v / 1_000_000)));
            const maxVal = Math.max(...allVals);
            const step = maxVal <= 2000 ? 500 : 1000;
            const top = Math.ceil(maxVal / step) * step;
            const ticks: number[] = [];
            for (let t = 0; t <= top; t += step) ticks.push(t);
            return { domain: [0, top] as [number, number], ticks };
          })()
        : { domain: [200, 1200] as [number, number], ticks: [200, 400, 600, 800, 1000, 1200] };

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="4 4" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }}
                            tickLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={fmtAED}
                            width={76}
                            domain={yConfig.domain}
                            ticks={yConfig.ticks}
                        />
                        <Tooltip
                            formatter={(v, name) => [fmtAED(Number(v)), name]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                        />
                        {seriesDef.map((s) => (
                            <Line
                                key={s.key}
                                type="monotone"
                                dataKey={s.key}
                                name={s.name}
                                stroke={s.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: s.color, stroke: "var(--db-sidebar-bg)", strokeWidth: 2 }}
                                isAnimationActive={animActive}
                                animationDuration={COUNT_MS}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {seriesDef.map((s) => {
                    const isHidden = hidden.has(s.key);
                    return (
                        <button
                            key={s.key}
                            onClick={() => toggle(s.key)}
                            className="flex items-center gap-1.5 text-xs outline-none transition-opacity"
                            style={{ opacity: isHidden ? 0.35 : 1 }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                            <span style={{ color: "var(--db-text-primary)", textDecoration: isHidden ? "line-through" : "none" }}>
                                {s.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Appreciation Potential Donut ──────────────────────────────────────────────

export function AdminRevenueBreakdownChart({ data: apiData }: { data?: { avgSqft: number; districts: { district: string; yoyGrowth: number; percentage: number }[] } }) {
    const [hidden, setHidden] = useState<Set<number>>(new Set());

    const toggle = (idx: number) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const baseRows = apiData
        ? apiData.districts.map((d, i) => {
            const match = ADMIN_REVENUE_BREAKDOWN.find(r => r.name.toLowerCase() === d.district.toLowerCase());
            return {
                name: d.district,
                value: d.percentage,
                displayValue: d.yoyGrowth,
                color: match?.color ?? ADMIN_REVENUE_BREAKDOWN[i]?.color ?? "#D28A44",
            };
          })
        : ADMIN_REVENUE_BREAKDOWN.map(r => ({ ...r, displayValue: r.value }));

    const centerPct = apiData
        ? (apiData.districts.reduce((sum, d) => sum + d.yoyGrowth, 0) / apiData.districts.length).toFixed(1)
        : "8.1";
    const centerSqft = apiData
        ? `${apiData.avgSqft.toLocaleString()} sqft avg`
        : "1,342 sqft avg";

    const chartData = baseRows.map((d, i) => ({
        ...d,
        value: hidden.has(i) ? 0.0001 : d.value,
    }));

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={70} outerRadius={90}
                            paddingAngle={3} dataKey="value"
                            startAngle={90} endAngle={-270}
                            strokeWidth={0}
                            isAnimationActive
                            animationDuration={600}
                            cornerRadius={8}
                            animationEasing="ease-in-out"
                        >
                            {baseRows.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-(--db-text-primary) leading-none">{centerPct}%</span>
                    <span className="text-[10px] text-(--db-text-primary) mt-1.5 leading-tight text-center">{centerSqft}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2.5 w-full min-w-0">
                {baseRows.map((item, idx) => {
                    const isHidden = hidden.has(idx);
                    return (
                        <button
                            key={item.name}
                            onClick={() => toggle(idx)}
                            className="flex items-center justify-between gap-2 outline-none transition-opacity"
                            style={{ opacity: isHidden ? 0.35 : 1 }}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                                <span
                                    className="text-[11px] truncate"
                                    style={{
                                        color: "var(--db-text-primary)",
                                        textDecoration: isHidden ? "line-through" : "none",
                                    }}
                                >
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-[12px] font-semibold text-(--db-text-primary) shrink-0">{item.displayValue}%</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Tool Usage (Vertical Bar — one bar per tool) ──────────────────────────────

export function AdminToolUsageChart({ data: apiData }: { data?: { tool: string; count: number }[] }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<number>>(new Set());
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const toggle = (idx: number) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const baseRows = apiData
        ? apiData.map((d, i) => {
            const match = ADMIN_TOOL_USAGE_DATA.find(r => r.tool.toLowerCase() === d.tool.toLowerCase());
            return { tool: d.tool, usage: d.count, color: match?.color ?? ADMIN_TOOL_USAGE_DATA[i]?.color ?? "#D28A44" };
          })
        : ADMIN_TOOL_USAGE_DATA;

    const chartData = baseRows.map((d, i) => ({
        tool: d.tool,
        usage: hidden.has(i) ? 0 : d.usage,
    }));

    const yConfig = apiData
        ? (() => {
            const maxVal = Math.max(...apiData.map(d => d.count));
            const step = maxVal <= 1000 ? 200 : 500;
            const top = Math.ceil(maxVal / step) * step;
            const ticks: number[] = [];
            for (let t = 0; t <= top; t += step) ticks.push(t);
            return { domain: [0, top] as [number, number], ticks, fmt: (v: number) => v.toLocaleString() };
          })()
        : { domain: [0, 8] as [number, number], ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8], fmt: (v: number) => `${v}%` };

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chartData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }} barSize={42}>
                        <defs>
                            <pattern
                                id="adminToolStripe"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(45)"
                            >
                                <rect width="8" height="8" fill="#D8D4CE" />
                                <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="3" />
                            </pattern>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="tool"
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }}
                            tickLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={yConfig.fmt}
                            width={apiData ? 48 : 36}
                            domain={yConfig.domain}
                            ticks={yConfig.ticks}
                        />
                        <Tooltip
                            formatter={(v) => [apiData ? Number(v).toLocaleString() : `${v}%`, "Usage"]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={false}
                        />
                        <Bar
                            dataKey="usage"
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={animActive}
                            animationDuration={COUNT_MS}
                            animationEasing="ease-in-out"
                            onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                            onMouseLeave={() => setHoverIdx(null)}
                        >
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={hoverIdx === i ? baseRows[i].color : "url(#adminToolStripe)"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {baseRows.map((item, idx) => {
                    const isHidden = hidden.has(idx);
                    return (
                        <button
                            key={item.tool}
                            onClick={() => toggle(idx)}
                            className="flex items-center gap-1.5 text-xs outline-none transition-opacity"
                            style={{ opacity: isHidden ? 0.35 : 1 }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                            <span style={{ color: "var(--db-text-primary)", textDecoration: isHidden ? "line-through" : "none" }}>
                                {item.tool}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Subscription Pie Chart (concentric semi-circle arcs) ─────────────────────

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

    const planData = apiData
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
