"use client";

import { useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
    PRICE_TREND_DATA,
    RENTAL_YIELD_DATA,
    CAP_RATE_DATA,
} from "@/app/(user dashboard)/constants";
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
    cursor: { stroke: "var(--db-border)" },
};

function PriceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "var(--db-sidebar-bg)",
            border: "1px solid #D28A4450",
            borderRadius: 8,
            padding: "8px 14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
            <p style={{ color: "#D28A44", fontSize: 10, fontWeight: 600, marginBottom: 3 }}>Price</p>
            <p style={{ color: "var(--db-text-primary)", fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                AED {payload[0].value.toLocaleString()}
            </p>
            <p style={{ color: "var(--db-text-primary)", fontSize: 10, marginTop: 2 }}>{label} 2025</p>
        </div>
    );
}

export function PriceTrendChart({ data: apiData }: { data?: Array<{ month: string; yas: number; alReem: number }> }) {
    const animActive = useAnimSync();
    const [showYas, setShowYas] = useState(true);
    const [showAlReem, setShowAlReem] = useState(true);
    const chartData = apiData ?? PRICE_TREND_DATA;

    return (
        <div className="bg-(--db-main-bg) p-[24px_21px]">
            <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="yasGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D28A44" stopOpacity={0.32} />
                            <stop offset="95%" stopColor="#D28A44" stopOpacity={0.04} />
                        </linearGradient>
                        <linearGradient id="alReemGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B6EA5" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#3B6EA5" stopOpacity={0.05} />
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
                        width={60} domain={[1350, 1750]}
                        ticks={[1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750]}
                    />
                    <Tooltip content={<PriceTooltip />} cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }} />
                    <Area
                        type="natural" dataKey="alReem" stroke="#3B6EA5" strokeWidth={2}
                        fill="url(#alReemGrad)" dot={false} name="Al Reem Island"
                        hide={!showAlReem}
                        isAnimationActive={animActive}
                        animationDuration={COUNT_MS}
                        animationEasing="ease-in-out"
                    />
                    <Area
                        type="natural" dataKey="yas" stroke="#D28A44" strokeWidth={2}
                        fill="url(#yasGrad)" dot={false} name="Yas Island"
                        hide={!showYas}
                        isAnimationActive={animActive}
                        animationDuration={COUNT_MS}
                        animationEasing="ease-in-out"
                    />
                </AreaChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-5 mt-3 justify-center">
                <button
                    onClick={() => setShowYas(v => !v)}
                    className="flex items-center gap-1.5 text-xs outline-none focus:outline-none transition-opacity"
                    style={{ opacity: showYas ? 1 : 0.35 }}
                >
                    <span className="inline-block w-3.25 h-3.25 rounded-full" style={{ background: "#D28A44" }} />
                    <span style={{ color: "var(--db-text-primary)", textDecoration: showYas ? "none" : "line-through" }}>
                        Yas Island
                    </span>
                </button>
                <button
                    onClick={() => setShowAlReem(v => !v)}
                    className="flex items-center gap-1.5 text-xs outline-none focus:outline-none transition-opacity"
                    style={{ opacity: showAlReem ? 1 : 0.35 }}
                >
                    <span className="inline-block w-3.25 h-3.25 rounded-full" style={{ background: "#3B6EA5" }} />
                    <span style={{ color: "var(--db-text-primary)", textDecoration: showAlReem ? "none" : "line-through" }}>
                        Al Reem Island
                    </span>
                </button>
            </div>
        </div>
    );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
    if (!active || !payload?.length || !label) return null;
    const idx = RENTAL_YIELD_DATA.findIndex((d) => d.district === label);
    const color = CAP_RATE_DATA[idx]?.color ?? "#D28A44";
    const rental = RENTAL_YIELD_DATA[idx]?.rental ?? 0;
    return (
        <div style={{
            background: "var(--db-sidebar-bg)",
            border: `1px solid ${color}50`,
            borderRadius: 8,
            padding: "6px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
            <p style={{ color, fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{Math.round(rental)}%</p>
            <p style={{ color: "var(--db-text-primary)", fontSize: 10, marginTop: 2 }}>{label}</p>
        </div>
    );
}

export function RentalYieldChart({ data: apiData }: { data?: Array<{ district: string; buy: number; rental: number }> }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<number>>(new Set());
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);

    const toggle = (idx: number) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const baseRows = (apiData ?? RENTAL_YIELD_DATA).map((d, i) => {
        const match = CAP_RATE_DATA.find(r => r.name.toLowerCase() === d.district.toLowerCase());
        return { district: d.district, buy: d.buy, rental: d.rental, color: match?.color ?? CAP_RATE_DATA[i % CAP_RATE_DATA.length]?.color ?? "#D28A44" };
    });

    const chartData = baseRows.map((d, i) => {
        const isHidden = hidden.has(i);
        return {
            district: d.district,
            buy: isHidden ? 0 : d.buy,
            extra: isHidden ? 0 : +(d.rental - d.buy).toFixed(2),
        };
    });

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chartData} margin={{ top: 10, right: 16, left: -4, bottom: 0 }} barSize={32}>
                        <defs>
                            <pattern
                                id="stripePattern"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(45)"
                            >
                                <rect width="8" height="8" fill="#D8D4CE" />
                                <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="3" />
                            </pattern>
                        </defs>
                        <XAxis
                            dataKey="district"
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }} tickLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                            axisLine={{ stroke: "var(--db-border)" }} tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                            width={36} domain={[0, 8]}
                            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                        />
                        <Tooltip content={<BarTooltip />} cursor={false} />
                        <Bar dataKey="buy" stackId="yield" radius={[0, 0, 4, 4]} name="Buy Rate"
                            isAnimationActive={animActive} animationDuration={COUNT_MS} animationEasing="ease-in-out"
                            onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                            onMouseLeave={() => setHoverIdx(null)}
                        >
                            {chartData.map((_, idx) => {
                                const color = baseRows[idx]?.color ?? "#D8D4CE";
                                const isHovered = hoverIdx === idx;
                                return (
                                    <Cell
                                        key={idx}
                                        fill={isHovered ? color : "url(#stripePattern)"}
                                    />
                                );
                            })}
                        </Bar>
                        <Bar dataKey="extra" stackId="yield" radius={[4, 4, 0, 0]} name="Extra Yield"
                            isAnimationActive={animActive} animationDuration={COUNT_MS} animationEasing="ease-in-out"
                            onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                            onMouseLeave={() => setHoverIdx(null)}
                        >
                            {chartData.map((_, idx) => {
                                const color = baseRows[idx]?.color ?? "#CECAC3";
                                const isHovered = hoverIdx === idx;
                                return (
                                    <Cell
                                        key={idx}
                                        fill={isHovered ? color : "#CECAC3"}
                                    />
                                );
                            })}
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
                            <span
                                style={{
                                    color: "var(--db-text-primary)",
                                    textDecoration: isHidden ? "line-through" : "none",
                                }}
                            >
                                {item.district}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function CapRateChart({
    data: apiData,
    overallValue,
    overallSqft,
}: {
    data?: Array<{ name: string; value: number }>;
    overallValue?: number;
    overallSqft?: number;
}) {
    const [hidden, setHidden] = useState<Set<number>>(new Set());

    const toggle = (idx: number) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const baseRows = (apiData ?? CAP_RATE_DATA).map((d, i) => {
        const match = CAP_RATE_DATA.find((r) => r.name.toLowerCase() === d.name.toLowerCase());
        return {
            name: d.name,
            value: d.value,
            color: match?.color ?? CAP_RATE_DATA[i % CAP_RATE_DATA.length]?.color ?? "#D28A44",
        };
    });

    const chartData = baseRows.map((d, i) => ({
        ...d,
        value: hidden.has(i) ? 0.0001 : d.value,
    }));

    const avgValue = overallValue ?? (
        baseRows.length ? baseRows.reduce((sum, d) => sum + d.value, 0) / baseRows.length : 0
    );

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%" cy="50%"
                            innerRadius={62} outerRadius={90}
                            paddingAngle={3} dataKey="value"
                            startAngle={90} endAngle={-270}
                            strokeWidth={0}
                            isAnimationActive
                            animationDuration={600}
                            cornerRadius={8}
                            animationEasing="ease-in-out"
                        >
                            {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <AnimatedNumber value={`${avgValue.toFixed(1)}%`} className="text-2xl font-bold text-(--db-text-primary) leading-none" />
                    {overallSqft != null && (
                        <div className="inline-flex gap-1 items-center mt-2">
                            <AnimatedNumber value={Math.round(overallSqft).toLocaleString()} className="text-[10px] text-(--db-text-primary)" />
                            <span className="text-[10px] text-(--db-text-primary) leading-tight">sqft avg</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-3 w-full min-w-0">
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
                            <AnimatedNumber value={`${item.value}%`} className="text-[12px] font-semibold text-(--db-text-primary) shrink-0" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
