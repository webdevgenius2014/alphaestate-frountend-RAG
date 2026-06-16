"use client";

import { useState } from "react";
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

function fmtAED(v: number) {
    const m = v / 1000;
    return `AED ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
}

const SERIES_KEY = "value";
const SERIES_LABEL = "Average Property Value";
const SERIES_COLOR = "#D28A44";

export function PropertyPerformanceChart({ data }: { data: PropertyDetailData["perfData"] }) {
    const [hidden, setHidden] = useState(false);

    const toggle = () => setHidden((prev) => !prev);

    const values = data.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;
    const step = range <= 600 ? 200 : range <= 1200 ? 400 : 600;
    const min = Math.floor((dataMin - step * 0.3) / step) * step;
    const max = Math.ceil((dataMax + step * 0.2) / step) * step;

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
                        width={72}
                    />
                    <Tooltip
                        formatter={(v) => [fmtAED(v as number), SERIES_LABEL]}
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
