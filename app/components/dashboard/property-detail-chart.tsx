"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PropertyDetailData } from "@/app/(user dashboard)/constants";

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

function fmtVal(v: number) {
    return `AED ${v}K`;
}

export function PropertyPerformanceChart({ data }: { data: PropertyDetailData["perfData"] }) {
    const values = data.map((d) => d.value);
    const min = Math.floor(Math.min(...values) / 5) * 5 - 5;
    const max = Math.ceil(Math.max(...values) / 5) * 5 + 5;

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="4 4" />
                <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--db-text-primary)", fontSize: 10 }}
                    axisLine={{ stroke: "var(--db-border)" }}
                    tickLine={false}
                    tickMargin={6}
                />
                <YAxis
                    tick={{ fill: "var(--db-text-primary)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmtVal}
                    domain={[min, max]}
                    width={60}
                />
                <Tooltip
                    formatter={(v) => [fmtVal(v as number), "Price"]}
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
