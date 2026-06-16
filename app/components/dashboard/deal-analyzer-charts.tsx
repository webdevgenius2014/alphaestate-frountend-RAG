"use client";

import { useState } from "react";
import {
    LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { DEAL_PRICE_TREND_DATA, PRICE_VS_MARKET_DATA } from "@/app/(user dashboard)/constants";
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

function fmtAED(v: number) {
    if (v >= 1000000) return `AED ${+(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `AED ${Math.round(v / 1000)}K`;
    return `AED ${v}`;
}

// ── Deal Score Gauge ──────────────────────────────────────────────────────

const ACTIVE_COLORS = ["#7A3210", "#963D18", "#B04E22", "#C4622E", "#D28A44", "#DC9E60", "#E5B47E", "#ECC9A0", "#F3DEC2", "#ECC9A0"];
const INACTIVE_COLOR = "rgba(210, 138, 68, 0.12)";

function buildGaugeSegments(score: number) {
    const activeCount = Math.round(score / 10);
    return Array.from({ length: 10 }, (_, i) => ({
        value: 1,
        color: i < activeCount ? ACTIVE_COLORS[i] : INACTIVE_COLOR,
    }));
}

export function DealScoreGauge({ score = 85 }: { score?: number }) {
    const segments = buildGaugeSegments(score);

    return (
        <div className="relative w-full" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                    <Pie
                        data={segments}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                        cornerRadius={4}
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={700}
                        animationEasing="ease-out"
                    >
                        {segments.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none pb-1">
                <AnimatedNumber value={`${score}%`} className="text-3xl font-bold text-(--db-text-primary) leading-none" />
            </div>
        </div>
    );
}

// ── Deal Assessment Gauge (arc 215→-45) ───────────────────────────────────

function assessmentGaugeData(score: number) {
    return [
        { value: score, color: "#D28A44" },
        { value: 100 - score, color: "rgba(210,138,68,0.15)" },
    ];
}

export function DealAssessmentGauge({ score = 85 }: { score?: number }) {
    const animActive = useAnimSync();
    const data = assessmentGaugeData(score);

    return (
        <div className="relative" style={{ width: 160, height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={215}
                        endAngle={-45}
                        innerRadius={60}
                        outerRadius={75}
                        dataKey="value"
                        strokeWidth={0}
                        cornerRadius={6}
                        isAnimationActive={animActive}
                        animationDuration={COUNT_MS}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <AnimatedNumber value={`${score}`} className="text-[40px] font-bold text-(--db-text-primary) leading-none" />
                <span className="text-[11px] text-(--db-text-muted) mt-1">Score {score}/100</span>
            </div>
        </div>
    );
}

// ── Price vs Market Chart ─────────────────────────────────────────────────

const PRICE_SERIES = [
    { key: "yourDeal" as const, name: "User Deal",  color: "#D28A44" },
    { key: "marketAvg" as const, name: "Market Avg", color: "#0B1F3A" },
];

function fmtAxis(v: number) {
    if (v === 0) return "AED 0";
    if (v >= 1000000) return `AED ${+(v / 1000000).toFixed(1)}M`;
    return `AED ${Math.round(v / 1000)}K`;
}

export function PriceVsMarketChart() {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<string>>(new Set());
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const toggle = (key: string) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    const chartData = PRICE_VS_MARKET_DATA.map((d) => ({
        ...d,
        yourDeal: hidden.has("yourDeal") ? 0 : d.yourDeal,
        marketAvg: hidden.has("marketAvg") ? 0 : d.marketAvg,
    }));

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={450}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 10 }}
                        barSize={32}
                        barCategoryGap="32%"
                    >
                        <defs>
                            <pattern id="pvmStripe" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                <rect width="8" height="8" fill="#D8D4CE" />
                                <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="3" />
                            </pattern>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="category"
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }}
                            tickLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickFormatter={fmtAxis}
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={76}
                            domain={[0, 2800000]}
                            ticks={[0, 700000, 1400000, 2100000, 2800000]}
                        />
                        <Tooltip
                            formatter={(v, name) => [fmtAED(Number(v)), name]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ fill: "var(--db-border)", fillOpacity: 0.1 }}
                        />
                        {PRICE_SERIES.map((s) => (
                            <Bar
                                key={s.key}
                                dataKey={s.key}
                                name={s.name}
                                radius={[4, 4, 0, 0]}
                                isAnimationActive={animActive}
                                animationDuration={COUNT_MS}
                                animationEasing="ease-in-out"
                                onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                                onMouseLeave={() => setHoverIdx(null)}
                            >
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={hoverIdx === i ? s.color : "url(#pvmStripe)"} />
                                ))}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {PRICE_SERIES.map((s) => {
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

// ── District Price Trend Chart ────────────────────────────────────────────

const TREND_SERIES = [
    { key: "price" as const, name: "Avg Price / SQM", color: "#D28A44" },
];

export function DistrictPriceTrendChart() {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const toggle = (key: string) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart
                        data={DEAL_PRICE_TREND_DATA}
                        margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
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
                            width={80}
                            domain={[1700000, 2200000]}
                            ticks={[1800000, 1900000, 2000000, 2100000, 2150000]}
                        />
                        <Tooltip
                            formatter={(v) => [fmtAED(Number(v)), "Avg Price / SQM"]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                        />
                        {TREND_SERIES.map((s) =>
                            !hidden.has(s.key) && (
                                <Line
                                    key={s.key}
                                    type="natural"
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
                            )
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {TREND_SERIES.map((s) => {
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
