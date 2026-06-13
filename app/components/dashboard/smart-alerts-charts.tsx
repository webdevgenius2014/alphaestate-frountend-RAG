"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ALERT_ROI_TREND_DATA } from "@/app/(user dashboard)/constants";

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

export function AlertROITrendChart() {
    return (
        <ResponsiveContainer width="100%" height={221}>
            <LineChart data={ALERT_ROI_TREND_DATA} margin={{ top: 5, right: 10, left: -0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--db-border)" strokeDasharray="4 4" />
                <XAxis
                    dataKey="week"
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
                    domain={[6, 9.5]}
                    ticks={[6.5, 7, 7.5, 8, 8.5, 9]}
                    width={38}
                />
                <Tooltip
                    formatter={(v) => [`${v}%`, "ROI"]}
                    contentStyle={tooltipStyle.contentStyle}
                    labelStyle={tooltipStyle.labelStyle}
                    cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                />
                <Line
                    type="natural"
                    dataKey="roi"
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
