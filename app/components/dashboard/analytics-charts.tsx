"use client";

import { useState } from "react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
    DISTRICT_ROI_DATA,
    INVESTMENT_MOVEMENT_DATA,
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
};

export function DistrictROIChart({ data: apiData }: { data?: Array<{ district: string; roi: number }> }) {
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
            const match = DISTRICT_ROI_DATA.find(r => r.district.toLowerCase() === d.district.toLowerCase());
            return { district: d.district, roi: d.roi, color: match?.color ?? DISTRICT_ROI_DATA[i % DISTRICT_ROI_DATA.length]?.color ?? "#D28A44" };
          })
        : DISTRICT_ROI_DATA;

    const chartData = baseRows.map((d, i) => ({
        district: d.district,
        roi: hidden.has(i) ? 0 : d.roi,
    }));

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={480}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: -20, bottom: 10 }}
                        barSize={35}
                    >
                        <defs>
                            <pattern
                                id="roiStripe"
                                patternUnits="userSpaceOnUse"
                                width="8"
                                height="8"
                                patternTransform="rotate(45)"
                            >
                                <rect width="8" height="8" fill="#D8D4CE" />
                                <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="3" />
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
                            width={115}
                        />
                        <Tooltip
                            formatter={(v) => [`${v}%`, "ROI"]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ fill: "var(--db-border)", fillOpacity: 0.15 }}
                        />
                        <Bar
                            dataKey="roi"
                            radius={[0, 4, 4, 0]}
                            isAnimationActive={animActive}
                            animationDuration={COUNT_MS}
                            animationEasing="ease-in-out"
                            onMouseEnter={(_: unknown, idx: number) => setHoverIdx(idx)}
                            onMouseLeave={() => setHoverIdx(null)}
                        >
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={hoverIdx === i ? baseRows[i].color : "url(#roiStripe)"}
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

const INVESTMENT_SERIES = [
    { key: "yas" as const, name: "Yas Island", color: "#D28A44" },
    { key: "alReem" as const, name: "AL Reem Island", color: "#0B1F3A" },
    { key: "saadiyat" as const, name: "Saadiyat", color: "#C4A07A" },
];

function fmtM(v: number) {
    if (v >= 1000) return `AED ${+(v / 1000).toFixed(1)}B`;
    return `AED ${v}M`;
}

export function InvestmentMovementChart({ data: apiData }: { data?: Array<{ month: string; yas: number; alReem: number; saadiyat: number }> }) {
    const animActive = useAnimSync();
    const [hidden, setHidden] = useState<Set<string>>(new Set());
    const chartData = apiData ?? INVESTMENT_MOVEMENT_DATA;

    const toggle = (key: string) =>
        setHidden((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });

    return (
        <div>
            <div className="bg-(--db-main-bg) rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
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
                            tickFormatter={fmtM}
                            width={76}
                            domain={[200, 1200]}
                            ticks={[200, 400, 600, 800, 1000, 1200]}
                        />
                        <Tooltip
                            formatter={(v, name) => [fmtM(Number(v)), name]}
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            cursor={{ stroke: "var(--db-border)", strokeWidth: 1 }}
                        />
                        {INVESTMENT_SERIES.map((s) => (
                            <Line
                                key={s.key}
                                type="natural"
                                dataKey={s.key}
                                name={s.name}
                                stroke={s.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: s.color, stroke: "var(--db-sidebar-bg)", strokeWidth: 2 }}
                                hide={hidden.has(s.key)}
                                isAnimationActive={animActive}
                                animationDuration={COUNT_MS}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 justify-center">
                {INVESTMENT_SERIES.map((s) => {
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

const GAUGE_SEGMENTS = [
    { value: 1, color: "#7A3210" },
    { value: 1, color: "#963D18" },
    { value: 1, color: "#B04E22" },
    { value: 1, color: "#C4622E" },
    { value: 1, color: "#D28A44" },
    { value: 1, color: "#DC9E60" },
    { value: 1, color: "#E5B47E" },
    { value: 1, color: "#ECC9A0" },
    { value: 1, color: "#F3DEC2" },
    { value: 1, color: "#FAF0E4" },
];

function BullishIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M1.77087 25.6914C1.72316 25.6914 1.67516 25.6799 1.63054 25.655C1.49106 25.5774 1.4408 25.4012 1.51845 25.2617C2.0792 24.2548 2.52165 23.1827 2.87121 21.9841C2.87403 21.9743 2.87742 21.9644 2.88165 21.9548C3.1417 21.3246 3.62142 20.8177 4.23215 20.5283C5.12721 20.1039 5.81248 19.6561 6.26876 19.1967C6.38142 19.0838 6.56439 19.083 6.67761 19.1956C6.79084 19.308 6.7914 19.491 6.67874 19.6045C6.16825 20.1183 5.44909 20.5916 4.48006 21.0507C4.00373 21.2766 3.62848 21.6707 3.42179 22.1617C3.06066 23.3959 2.60325 24.5022 2.02386 25.5429C1.97078 25.6381 1.87252 25.6914 1.77087 25.6914Z" fill="#D28A44" />
            <path d="M3.99245 25.6915C3.86031 25.6915 3.74115 25.6006 3.71066 25.4662C3.23941 23.3858 6.09259 22.3075 8.63095 21.6005C9.28206 21.419 9.84394 20.9706 10.1723 20.3706L10.7153 19.3787C10.7921 19.2386 10.9677 19.187 11.1078 19.264C11.2478 19.3406 11.2992 19.5165 11.2224 19.6565L10.6794 20.6484C10.2768 21.3842 9.58672 21.9343 8.78624 22.1573C5.4285 23.0928 3.99499 24.1036 4.2748 25.3386C4.31009 25.4942 4.2124 25.6492 4.05654 25.6845C4.03508 25.6893 4.01362 25.6915 3.99245 25.6915Z" fill="#D28A44" />
            <path d="M12.3625 21.8936C12.3577 21.8936 12.3529 21.8936 12.3481 21.8933C11.2444 21.8397 10.2065 21.7925 9.5472 21.7643C9.38767 21.7575 9.264 21.6225 9.27077 21.463C9.27755 21.3035 9.4176 21.1756 9.57204 21.1866C10.2319 21.2148 11.271 21.262 12.3764 21.3156C12.5359 21.3235 12.6587 21.459 12.6511 21.6186C12.6435 21.7733 12.5159 21.8936 12.3625 21.8936Z" fill="#D28A44" />
            <path d="M23.2896 23.187C23.2315 23.187 23.1733 23.1791 23.116 23.1633C21.7246 22.7804 21.1466 21.0414 20.9735 20.3748C20.0412 20.492 19.4991 20.8969 18.9736 21.2891C18.5746 21.5872 18.1621 21.8953 17.6121 22.0421C17.4596 22.0842 17.2995 21.9918 17.2583 21.8374C17.2171 21.6832 17.3086 21.5248 17.463 21.4836C17.9052 21.3653 18.24 21.1154 18.6277 20.8257C19.2351 20.3723 19.9234 19.8584 21.1788 19.7745C21.3228 19.7697 21.4546 19.8657 21.482 20.0089C21.4863 20.0312 21.9233 22.2352 23.2702 22.606C23.2896 22.6113 23.3089 22.6082 23.3272 22.5978C23.3506 22.5842 23.3679 22.5611 23.3749 22.5345C23.598 21.7295 24.0938 20.2881 24.9211 19.628C25.0402 19.5337 25.0572 19.4512 25.0589 19.3899C25.0668 19.1121 24.7294 18.7484 24.6108 18.6428C24.5179 18.5516 22.608 16.6573 21.9022 15.7157C21.7923 15.5697 21.6732 15.3904 21.5427 15.1939C20.8459 14.1441 19.8921 12.7066 18.292 13.1338C16.2167 13.6856 13.1317 15.0411 11.4746 15.7693C10.6953 16.1107 9.83776 16.2976 9.00877 16.4783C7.82204 16.7367 6.7011 16.9809 6.16265 17.6343C5.47399 18.4779 5.31164 19.8567 5.27408 20.4104C5.26336 20.5696 5.13008 20.686 4.96575 20.6792C4.80651 20.6682 4.68622 20.5304 4.69695 20.3708C4.74863 19.6147 4.94966 18.206 5.71569 17.2675C6.38232 16.4586 7.59842 16.1937 8.88567 15.913C9.68727 15.7386 10.516 15.5581 11.2422 15.2399C13.5561 14.2232 16.1885 13.0946 18.1432 12.5751C20.1456 12.0423 21.3211 13.8146 22.0244 14.874C22.1481 15.0603 22.2608 15.2303 22.3647 15.369C23.0454 16.2764 24.986 18.2015 25.0058 18.2207C25.0609 18.2687 25.6524 18.8077 25.6371 19.4041C25.6304 19.6672 25.5073 19.9013 25.2814 20.0806C24.5557 20.6594 24.0969 22.0943 23.9334 22.6847C23.8888 22.8558 23.7725 23.0083 23.6158 23.0987C23.5144 23.1571 23.4026 23.187 23.2896 23.187Z" fill="#D28A44" />
            <path d="M10.2044 25.6921C10.1923 25.6921 10.1799 25.6912 10.1675 25.6898C10.0091 25.6695 9.89697 25.5246 9.9173 25.3662C9.93395 25.2358 9.97264 24.795 9.7668 24.5951C9.69085 24.522 9.46073 24.4096 9.23795 24.3012C8.56736 23.9739 7.55371 23.4793 7.49809 22.5486C7.48849 22.3894 7.6099 22.2524 7.76943 22.2428C7.92699 22.2346 8.0659 22.3546 8.07522 22.5142C8.1108 23.1077 8.90873 23.497 9.49151 23.7814C9.79024 23.9271 10.0263 24.0423 10.1689 24.1795C10.543 24.5432 10.5311 25.1251 10.491 25.4396C10.4724 25.5856 10.3479 25.6921 10.2044 25.6921Z" fill="#D28A44" />
            <path d="M12.0293 25.692C11.879 25.692 11.752 25.5757 11.7413 25.4235C11.6981 24.8227 11.0529 24.1154 10.626 23.6475C10.5427 23.5557 10.4659 23.4719 10.4006 23.3965C9.91245 22.838 10.1973 22.2606 10.4261 21.7964C10.4741 21.6993 10.5229 21.6004 10.5664 21.4996C10.6296 21.3528 10.799 21.2859 10.9464 21.3489C11.093 21.4121 11.1605 21.5821 11.0972 21.7289C11.0501 21.8385 10.997 21.9463 10.9447 22.0522C10.6957 22.557 10.622 22.7711 10.8366 23.0167C10.8998 23.0896 10.9733 23.17 11.0532 23.2576C11.534 23.7847 12.2605 24.5812 12.3178 25.3823C12.3294 25.5415 12.2094 25.6799 12.0502 25.6912C12.0431 25.6917 12.036 25.692 12.0293 25.692Z" fill="#D28A44" />
            <path d="M16.2726 25.6921C16.1484 25.6921 16.0337 25.6116 15.9959 25.4865C15.8663 25.0576 15.5292 24.3091 15.1373 23.5798C14.9557 23.2367 15.0062 22.8276 15.2654 22.5356C15.8773 21.8425 16.8339 20.3748 16.8435 20.3601C16.9305 20.2263 17.1095 20.1876 17.2433 20.2754C17.3772 20.3624 17.4153 20.5414 17.328 20.6752C17.2879 20.737 16.339 22.1934 15.6986 22.9191C15.6006 23.0292 15.5808 23.1817 15.6475 23.3076C15.9719 23.911 16.3796 24.7578 16.5493 25.3194C16.5956 25.4721 16.5092 25.6336 16.3562 25.6796C16.3282 25.6881 16.3003 25.6921 16.2726 25.6921Z" fill="#D28A44" />
            <path d="M14.1671 25.692C14.1512 25.692 14.1349 25.6906 14.1185 25.6881C13.9612 25.6613 13.8551 25.5122 13.8816 25.3546C13.9127 25.1719 13.9971 24.7072 14.0479 24.4288C14.0773 24.2746 13.7568 23.7873 13.5848 23.5255C13.4982 23.394 13.414 23.2658 13.3434 23.1475C13.0311 22.6206 13.235 20.7444 13.305 20.1819C13.3245 20.0232 13.4685 19.9114 13.6275 19.9306C13.7862 19.9504 13.8985 20.0947 13.8788 20.2531C13.7472 21.3122 13.6952 22.6068 13.8407 22.8521C13.9067 22.9628 13.9863 23.0837 14.0679 23.2079C14.3876 23.6938 14.6894 24.1529 14.6163 24.5349C14.5663 24.8088 14.4824 25.2696 14.4519 25.4512C14.4279 25.5924 14.3057 25.692 14.1671 25.692Z" fill="#D28A44" />
            <path d="M21.5669 25.692C21.4131 25.692 21.2851 25.5709 21.2784 25.4156C21.2524 24.8221 20.8647 24.3028 20.1106 23.4939C19.5368 22.8772 19.4578 22.0457 19.4922 21.457C19.5015 21.2978 19.6404 21.178 19.7977 21.1854C19.957 21.1947 20.0787 21.3314 20.0693 21.4909C20.0414 21.9672 20.0993 22.6327 20.5338 23.1C21.2603 23.879 21.8191 24.5426 21.8561 25.3902C21.8631 25.5497 21.7395 25.6847 21.5799 25.6917C21.5757 25.692 21.5712 25.692 21.5669 25.692Z" fill="#D28A44" />
            <path d="M19.7082 25.6921C19.6752 25.6921 19.6413 25.6864 19.6086 25.6743C19.4586 25.6192 19.3818 25.4532 19.4369 25.3033C19.7018 24.5818 19.4697 24.4057 18.6827 24.0479C18.1132 23.7907 17.7815 23.2768 17.6033 22.8908C17.5364 22.7457 17.5999 22.574 17.7448 22.5071C17.8902 22.4399 18.0616 22.5037 18.1285 22.6486C18.2651 22.945 18.5139 23.3372 18.9213 23.5213C19.6038 23.8313 20.452 24.2168 19.9796 25.5026C19.9367 25.6195 19.826 25.6921 19.7082 25.6921Z" fill="#D28A44" />
            <path d="M5.80661 17.1238C5.06064 17.1238 4.17546 17.0015 3.7635 16.4851C3.48256 16.133 3.45489 15.6728 3.68077 15.1171C3.74628 14.9565 3.84426 14.7938 3.93885 14.6368C4.11108 14.3505 4.28925 14.0543 4.22092 13.8601C4.17122 13.7189 3.97612 13.5822 3.65677 13.4648C3.50684 13.4097 3.43004 13.2437 3.4851 13.0938C3.54016 12.9438 3.70703 12.8668 3.85612 12.9221C4.35673 13.1062 4.65461 13.3502 4.76642 13.6684C4.92511 14.1193 4.66421 14.5527 4.43409 14.935C4.34713 15.0796 4.26496 15.2159 4.21668 15.3351C4.0035 15.8586 4.16303 16.0588 4.21555 16.1243C4.61452 16.6249 6.08501 16.595 6.91824 16.458C7.07579 16.4326 7.22459 16.5391 7.25057 16.6966C7.27626 16.8542 7.16953 17.003 7.01198 17.0289C6.89932 17.0473 6.39645 17.1238 5.80661 17.1238Z" fill="#D28A44" />
            <path d="M23.5568 19.4752C23.4404 19.4752 23.3306 19.4043 23.2866 19.2889C23.2298 19.1398 23.3046 18.9726 23.454 18.9159C24.5995 18.4794 25.8026 18.3068 27.0334 18.4028C27.1924 18.4153 27.3115 18.5545 27.2991 18.7137C27.2867 18.8727 27.1458 18.991 26.9882 18.9794C25.8444 18.8888 24.7246 19.0506 23.6595 19.4563C23.6259 19.4693 23.5909 19.4752 23.5568 19.4752Z" fill="#D28A44" />
            <path d="M25.6196 25.6915H0.989325C0.829513 25.6915 0.700195 25.5622 0.700195 25.4024C0.700195 25.2426 0.829513 25.1133 0.989325 25.1133H25.6196C25.7794 25.1133 25.9087 25.2426 25.9087 25.4024C25.9087 25.5622 25.7794 25.6915 25.6196 25.6915Z" fill="#D28A44" />
            <path d="M8.3614 14.6035C8.20158 14.6035 8.07227 14.4742 8.07227 14.3144V12.2642C8.07227 12.1044 8.20158 11.9751 8.3614 11.9751H11.2247C11.3846 11.9751 11.5139 12.1044 11.5139 12.2642V13.4199C11.5139 13.5797 11.3846 13.709 11.2247 13.709C11.0649 13.709 10.9356 13.5797 10.9356 13.4199V12.5534H8.65053V14.3144C8.65053 14.4742 8.52121 14.6035 8.3614 14.6035Z" fill="#D28A44" />
            <path d="M14.0894 9.92944V12.15C13.1353 12.5316 12.1609 12.9451 11.2241 13.3556V9.92944H14.0894Z" fill="#D28A44" />
            <path d="M14.0909 12.5002C13.9311 12.5002 13.8018 12.3709 13.8018 12.2111V5.74409C13.8018 5.58427 13.9311 5.45496 14.0909 5.45496H16.9542C17.114 5.45496 17.2434 5.58427 17.2434 5.74409V11.1763C17.2434 11.3361 17.114 11.4654 16.9542 11.4654C16.7944 11.4654 16.6651 11.3361 16.6651 11.1763V6.03322H14.38V12.2111C14.38 12.3709 14.2507 12.5002 14.0909 12.5002Z" fill="#D28A44" />
            <path d="M19.8204 6.74316V10.843C19.1958 10.6927 18.4904 10.6869 17.6981 10.898C17.4582 10.9616 17.2124 11.0339 16.9551 11.1119V6.74316H19.8204Z" fill="#D28A44" />
            <path d="M22.6834 13.2098C22.5236 13.2098 22.3943 13.0804 22.3943 12.9206V4.78517H20.1095V10.9041C20.1095 11.0639 19.9802 11.1932 19.8204 11.1932C19.6606 11.1932 19.5312 11.0639 19.5312 10.9041V4.49604C19.5312 4.33623 19.6606 4.20691 19.8204 4.20691H22.6834C22.8433 4.20691 22.9726 4.33623 22.9726 4.49604V12.9206C22.9726 13.0804 22.8433 13.2098 22.6834 13.2098Z" fill="#D28A44" />
            <path d="M25.5508 2.30798V16.3077C25.3918 16.1428 25.2241 15.9694 25.0593 15.7959L25.0419 15.7785L23.3389 13.717L23.336 13.7113C23.1597 13.4539 22.9428 13.1446 22.6826 12.8236V2.30798H25.5508Z" fill="#D28A44" />
        </svg>
    );
}

function VolumeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M21.8912 7.1251L16.6155 12.6319C16.4829 12.7703 16.2759 12.8067 16.104 12.722L10.3046 9.8618L4.46541 14.948C4.28265 15.1073 4.00495 15.0881 3.84574 14.9054C3.68652 14.7225 3.70563 14.4449 3.88845 14.2857L9.94809 9.00736C10.0816 8.89102 10.272 8.86632 10.4308 8.94466C10.4308 8.94466 16.2038 11.7918 16.2038 11.7917L21.2691 6.50466L21.1196 6.52162C20.8788 6.54896 20.6611 6.37564 20.6337 6.13478C20.6063 5.89393 20.7796 5.67619 21.0205 5.64879L22.3807 5.4943C22.5112 5.47947 22.6416 5.52389 22.736 5.61541C22.8303 5.70688 22.8788 5.83579 22.8679 5.96678L22.7498 7.40192C22.7299 7.64354 22.5176 7.82351 22.2761 7.80364C22.0344 7.78371 21.8545 7.57146 21.8743 7.32983C21.8743 7.32983 21.8814 7.24391 21.8912 7.1251ZM1.26271 6.37053V25.586H27.1764C27.4188 25.586 27.6157 25.7828 27.6157 26.0252C27.6157 26.2676 27.4188 26.4644 27.1764 26.4644H0.823493C0.581101 26.4644 0.384277 26.2676 0.384277 26.0252V1.97486C0.384277 1.73247 0.581101 1.53564 0.823493 1.53564C1.06589 1.53564 1.26271 1.73247 1.26271 1.97486V5.4921L3.00354 5.49451C3.24593 5.49484 3.44248 5.69194 3.44215 5.93433C3.44182 6.17673 3.24472 6.37328 3.00233 6.37295L1.26271 6.37053ZM8.60596 13.6938H11.8693C12.1119 13.6938 12.3085 13.8905 12.3085 14.1331V24.3625C12.3085 24.6051 12.1119 24.8017 11.8693 24.8017H8.60596C8.36334 24.8017 8.16674 24.6051 8.16674 24.3625V14.1331C8.16674 13.8905 8.36334 13.6938 8.60596 13.6938ZM9.04517 14.5723V23.9233H11.4301V14.5723H9.04517ZM2.54418 18.481H5.80969C6.05225 18.481 6.2489 18.6776 6.2489 18.9202V24.3625C6.2489 24.6051 6.05225 24.8017 5.80969 24.8017H2.54418C2.30162 24.8017 2.10496 24.6051 2.10496 24.3625V18.9202C2.10496 18.6776 2.30162 18.481 2.54418 18.481ZM2.98339 19.3595V23.9233H5.37047V19.3595H2.98339ZM14.6656 15.6279H17.9289C18.1715 15.6279 18.3681 15.8245 18.3681 16.0671V24.3625C18.3681 24.6051 18.1715 24.8017 17.9289 24.8017H14.6656C14.423 24.8017 14.2264 24.6051 14.2264 24.3625V16.0671C14.2264 15.8245 14.423 15.6279 14.6656 15.6279ZM15.1048 16.5063V23.9233H17.4897V16.5063H15.1048ZM20.7273 9.97155H23.9907C24.2332 9.97155 24.4299 10.1682 24.4299 10.4108V24.3625C24.4299 24.6051 24.2332 24.8017 23.9907 24.8017H20.7273C20.4848 24.8017 20.2881 24.6051 20.2881 24.3625V10.4108C20.2881 10.1682 20.4848 9.97155 20.7273 9.97155ZM21.1665 10.85V23.9233H23.5515V10.85H21.1665ZM6.62597 5.49951C6.86836 5.49984 7.06491 5.69694 7.06458 5.93933C7.06425 6.18172 6.86716 6.37827 6.62476 6.37794L4.89283 6.37553C4.65043 6.3752 4.45389 6.17815 4.45421 5.93571C4.45454 5.69331 4.65164 5.49677 4.89403 5.4971L6.62597 5.49951ZM9.94326 5.50407C10.1857 5.5044 10.3823 5.7015 10.3819 5.94389C10.3815 6.18628 10.1845 6.38283 9.94205 6.3825L8.36422 6.38036C8.12178 6.37997 7.92528 6.18293 7.92561 5.94054C7.92594 5.69809 8.12298 5.50154 8.36543 5.50193L9.94326 5.50407ZM13.2681 5.50868C13.5105 5.50901 13.707 5.70605 13.7067 5.9485C13.7063 6.19089 13.5093 6.38744 13.2669 6.38711L11.698 6.38491C11.4556 6.38459 11.2591 6.18749 11.2594 5.9451C11.2598 5.7027 11.4569 5.50615 11.6992 5.50648L13.2681 5.50868ZM16.6375 5.51329C16.8798 5.51362 17.0764 5.71072 17.0761 5.95311C17.0757 6.1955 16.8786 6.39205 16.6362 6.39172L14.7863 6.3892C14.5439 6.38887 14.3474 6.19177 14.3477 5.94938C14.348 5.70693 14.5451 5.51044 14.7875 5.51077L16.6375 5.51329ZM19.7742 5.51851C20.0166 5.51895 20.213 5.71615 20.2125 5.9586C20.212 6.20099 20.0148 6.39738 19.7724 6.39694L18.4427 6.39419C18.2003 6.39375 18.0039 6.19655 18.0044 5.9541C18.0049 5.71171 18.2021 5.51532 18.4445 5.51582L19.7742 5.51851Z" fill="#D28A44" />
        </svg>
    );
}

function TrendArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 17 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.28731 4.99392C5.28731 4.60272 5.60445 4.28558 5.99565 4.28558H12.0059H12.0062H12.0165C12.4077 4.28558 12.7248 4.60272 12.7248 4.99392V11.0147C12.7248 11.4059 12.4077 11.7231 12.0165 11.7231C11.6253 11.7231 11.3082 11.4059 11.3082 11.0147V6.69357L5.49478 12.5069C5.21816 12.7835 4.76966 12.7835 4.49304 12.5069C4.21643 12.2303 4.21643 11.7818 4.49304 11.5052L10.296 5.70224H5.99565C5.60445 5.70224 5.28731 5.38513 5.28731 4.99392Z" fill="currentColor" />
        </svg>
    );
}

export function AIMarketIntelWidget() {
    return (
        <div className="flex flex-col gap-5">
            {/* Semicircle gauge */}
            <div className="relative" style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                        <Pie
                            data={GAUGE_SEGMENTS}
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
                            isAnimationActive
                            animationDuration={700}
                            animationEasing="ease-out"
                        >
                            {GAUGE_SEGMENTS.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label sits at bottom — the circle's midpoint */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none pb-1">
                    <AnimatedNumber value="0%" className="text-3xl font-bold text-(--db-text-primary) leading-none" />
                    <span className="text-[11px] text-(--db-text-primary) mt-1 leading-none">Market Growth</span>
                    <span className="text-[11px] text-(--db-text-primary) leading-none">Confidence</span>
                </div>
            </div>

            {/* Stat cards */}
            <div className="flex flex-col gap-3">
                <div className="bg-(--db-chat-bubble-bg) rounded-lg p-[12px_14px] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-(--db-icon-box-bg) w-11 h-11 flex justify-center items-center p-1.5 rounded-md shrink-0">
                            <BullishIcon />
                        </div>
                        <span className="text-xs text-(--db-text-primary)">Bullish Districts</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <AnimatedNumber value="12 Active" className="text-xl font-bold text-(--db-text-primary)" />
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5E9F62]">
                            <span className="bg-[#5E9F621C] text-[#5E9F62] w-6 h-6 rounded-full flex justify-center items-center shrink-0">
                                <TrendArrow />
                            </span>
                            <AnimatedNumber value="+4.8%" className="text-xs font-semibold text-[#5E9F62]" />
                        </div>
                    </div>
                </div>

                <div className="bg-(--db-chat-bubble-bg) rounded-lg p-[12px_14px] flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-(--db-icon-box-bg) w-11 h-11 flex justify-center items-center p-1.5 rounded-md shrink-0">
                            <VolumeIcon />
                        </div>
                        <span className="text-xs text-(--db-text-primary)">Investment Volume</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <AnimatedNumber value="AED 30.9B" className="text-xl font-bold text-(--db-text-primary)" />
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5E9F62]">
                            <span className="bg-[#5E9F621C] text-[#5E9F62] w-6 h-6 rounded-full flex justify-center items-center shrink-0">
                                <TrendArrow />
                            </span>
                            <AnimatedNumber value="+5.1%" className="text-xs font-semibold text-[#5E9F62]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
