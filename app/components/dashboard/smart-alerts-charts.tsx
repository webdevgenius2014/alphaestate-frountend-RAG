"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export type TrendPoint = { date: string; value: number };

const fmtTrendDate = (d: string) => {
    const date = new Date(d);
    return Number.isNaN(date.getTime()) ? d : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

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

export function AlertROITrendChart({ data, loading }: { data: TrendPoint[]; loading?: boolean }) {
    if (loading || !data.length) {
        return (
            <div className="h-55.25 flex items-center justify-center text-[13px] text-(--db-text-muted)">
                {loading ? "Loading trend..." : "Data not present"}
            </div>
        );
    }
    return (
        <ResponsiveContainer width="100%" height={221}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="4 4" />
                <XAxis
                    dataKey="date"
                    tickFormatter={fmtTrendDate}
                    tick={{ fill: "var(--db-text-primary)", fontSize: 10 }}
                    axisLine={{ stroke: "var(--db-border)" }}
                    tickLine={false}
                    tickMargin={6}
                />
                <YAxis
                    tick={{ fill: "var(--db-text-primary)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[(min: number) => Math.floor((min - 0.5) * 2) / 2, (max: number) => Math.ceil((max + 0.5) * 2) / 2]}
                    width={38}
                />
                <Tooltip
                    formatter={(v) => [`${v}%`, "ROI"]}
                    labelFormatter={(l) => fmtTrendDate(String(l))}
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                    cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                />
                <Line
                    type="natural"
                    dataKey="value"
                    stroke="#D28A44"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#D28A44", stroke: "var(--db-sidebar-bg)", strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
