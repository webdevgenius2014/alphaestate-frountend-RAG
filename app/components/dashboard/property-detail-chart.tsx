"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    if (Math.abs(v) >= 1_000_000) return `AED ${+(v / 1_000_000).toFixed(2)}M`;
    if (Math.abs(v) >= 1_000) return `AED ${+(v / 1_000).toFixed(1)}K`;
    return `AED ${Math.round(v).toLocaleString()}`;
}

export type PerfPoint = { month: string; value: number; transactionCount?: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2025-09" → "Sep 2025"
export function formatMonth(month: string) {
    const [year, m] = (month ?? "").split("-");
    const name = MONTHS[Number(m) - 1];
    return name && year ? `${name} ${year}` : month;
}

export function mapPriceHistory(items: any[]): PerfPoint[] {
    return (items ?? [])
        .filter((d) => d?.month && d?.avgPriceAed != null)
        .sort((a, b) => String(a.month).localeCompare(String(b.month)))
        .map((d) => ({
            month: formatMonth(d.month),
            value: Number(d.avgPriceAed),
            transactionCount: d.transactionCount != null ? Number(d.transactionCount) : undefined,
        }));
}

const SERIES_KEY = "value";
const SERIES_LABEL = "Average Property Value";
const SERIES_COLOR = "#D28A44";

export function PropertyPerformanceChart({ data, loading = false }: { data: PerfPoint[]; loading?: boolean }) {
    const [hidden, setHidden] = useState(false);

    const toggle = () => setHidden((prev) => !prev);

    if (loading || data.length === 0) {
        return (
            <div className="bg-(--db-main-bg) p-5 h-100 flex items-center justify-center">
                <p className="text-[13px] text-(--db-text-primary)">
                    {loading ? "Loading price history..." : "No price history available for this property."}
                </p>
            </div>
        );
    }

    const values = data.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const pad = (dataMax - dataMin) * 0.15 || dataMax * 0.05 || 1;
    const min = Math.max(0, dataMin - pad);
    const max = dataMax + pad;

    return (
        <div className="bg-(--db-main-bg) p-5">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fill: "var(--db-text-primary)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={fmtAED}
                        domain={[min, max]}
                        allowDecimals={false}
                        width={72}
                    />
                    <Tooltip
                        formatter={(v, _name, item) => {
                            const count = (item?.payload as PerfPoint | undefined)?.transactionCount;
                            const label = count != null ? `${SERIES_LABEL} (${count} transactions)` : SERIES_LABEL;
                            return [fmtAED(v as number), label];
                        }}
                        contentStyle={tooltipStyle.contentStyle}
                        labelStyle={tooltipStyle.labelStyle}
                        cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey={SERIES_KEY}
                        stroke={SERIES_COLOR}
                        strokeWidth={2}
                        dot={{ r: 4, fill: SERIES_COLOR, stroke: SERIES_COLOR, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "var(--db-sidebar-bg)", strokeWidth: 2 }}
                        hide={hidden}
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                <button
                    onClick={toggle}
                    className="flex items-center gap-1.5 text-xs outline-none transition-opacity"
                    style={{ opacity: hidden ? 0.35 : 1 }}
                >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SERIES_COLOR }} />
                    <span className="text-(--db-text-primary)">{SERIES_LABEL}</span>
                </button>
            </div>
        </div>
    );
}
