"use client";

import { type ReactNode, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { UserActivityChart, SubscriptionPieChart } from "@/app/components/dashboard/admin-charts";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import {
    ADMIN_STATS,
    OPERATIONAL_ITEMS,
    AI_METRICS,
    RECENT_ACTIVITY,
    LIVE_ACTIVITY,
    SYSTEM_SERVICES,
} from "@/app/(admin dashboard)/constants";
import ModalButton from "@/app/components/ui/modal-button";
import { SortIcon } from "@/app/(user dashboard)/constants";
import { formatDate } from "@/app/constant";
import { generateAdminDashboardPdfBlob } from "@/app/components/dashboard/admin-dashboard-pdf";
import { SystemStatusModal } from "@/app/components/dashboard/system-status-modal";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function TrendArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.28731 4.99392C5.28731 4.60272 5.60445 4.28558 5.99565 4.28558H12.0059H12.0062H12.0165C12.4077 4.28558 12.7248 4.60272 12.7248 4.99392V11.0147C12.7248 11.4059 12.4077 11.7231 12.0165 11.7231C11.6253 11.7231 11.3082 11.4059 11.3082 11.0147V6.69357L5.49478 12.5069C5.21816 12.7835 4.76966 12.7835 4.49304 12.5069C4.21643 12.2303 4.21643 11.7818 4.49304 11.5052L10.296 5.70224H5.99565C5.60445 5.70224 5.28731 5.38513 5.28731 4.99392Z" fill="currentColor" />
        </svg>
    );
}

function CardTitle({ title, sub }: { title: string; sub?: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-base font-semibold text-(--db-text-primary)">{title}</h2>
            {sub && <p className="text-xs text-(--db-text-muted) mt-0.5 leading-4">{sub}</p>}
        </div>
    );
}

export default function AdminDashboardPage() {
    const { user } = useTheme();
    const [period, setPeriod] = useState("last_year");
    const [dashboard, setDashboard] = useState<any>(null);
    const [exporting, setExporting] = useState(false);
    const [showSystemStatus, setShowSystemStatus] = useState(false);

    useEffect(() => {
        appService.getAdminDashboard(period).then((res) => {
            if (res?.data?.success && res.data.data) {
                setDashboard(res.data.data);
            }
        });
    }, [period]);

    const topStats = dashboard?.topStats;
    const adminStats = topStats
        ? ADMIN_STATS.map((s) => {
            const key = s.label === "Total Registered Users" ? "totalUsers"
                : s.label === "Active Subscriptions" ? "activeSubscriptions"
                : s.label === "AI Queries Processed" ? "aiQueriesProcessed"
                : s.label === "Reports Generated" ? "reportsGenerated"
                : null;
            const stat = key ? topStats[key] : null;
            if (!stat) return s;
            const up = stat.growthPercent >= 0;
            return {
                ...s,
                value: String(stat.count),
                up,
                change: `${up ? "+" : ""}${stat.growthPercent}% vs last period`,
            };
          })
        : ADMIN_STATS;

    const operationalIntelligence = dashboard?.operationalIntelligence;
    const operationalItems = operationalIntelligence
        ? OPERATIONAL_ITEMS.map((item) => {
            if (item.label === "Active Smart Alerts") return { ...item, value: String(operationalIntelligence.activeSmartAlerts) };
            if (item.label === "Deal Analyses Completed") return { ...item, value: String(operationalIntelligence.dealAnalysesCompleted) };
            if (item.label === "Districts Tracked") return { ...item, value: String(operationalIntelligence.districtsTracked) };
            if (item.label === "System Health") return { ...item, value: `${operationalIntelligence.systemHealth?.healthPercent ?? 0}%` };
            return item;
          })
        : OPERATIONAL_ITEMS;

    const userActivityData = dashboard?.userActivityChart
        ? dashboard.userActivityChart.months.map((month: string, i: number) => ({
            month,
            activeUsers: dashboard.userActivityChart.activeUsers[i],
            queries: dashboard.userActivityChart.aiQueries[i],
          }))
        : undefined;

    const aiIntelligence = dashboard?.aiIntelligence;
    const aiMetrics = aiIntelligence
        ? AI_METRICS.map((m) => {
            if (m.label === "AI Requests Today") return { ...m, value: String(aiIntelligence.requestsToday) };
            if (m.label === "Avg Response Time") return { ...m, value: `${aiIntelligence.avgResponseTimeSec} sec` };
            if (m.label === "Success Rate") return { ...m, value: `${aiIntelligence.successRate}%` };
            // Could be used further
            // if (m.label === "AI Confidence Score") return { ...m, value: `${aiIntelligence.aiConfidenceScore}%` };
            return m;
          })
        : AI_METRICS;

    const recentActivity = dashboard?.recentActivity?.length ? dashboard.recentActivity : RECENT_ACTIVITY;

    const systemHealth = operationalIntelligence?.systemHealth;
    const systemServiceItems = systemHealth
        ? [
            { name: "Database", sub: "Platform data store", healthy: !!systemHealth.services?.database },
            { name: "Storage", sub: "File & media storage", healthy: !!systemHealth.services?.storage },
            { name: "RAG Engine", sub: "AI query & retrieval engine", healthy: !!systemHealth.services?.ragEngine },
          ]
        : SYSTEM_SERVICES.map((svc) => ({ name: svc.name, sub: svc.sub, healthy: svc.type !== "error" }));

    const liveActivity = dashboard?.todaysActivity
        ? LIVE_ACTIVITY.map((item) => {
            if (item.label === "New Users") return { ...item, value: String(dashboard.todaysActivity.newUsers ?? item.value) };
            if (item.label === "Reports Generated") return { ...item, value: String(dashboard.todaysActivity.reportsGenerated ?? item.value) };
            if (item.label === "AI Queries") return { ...item, value: String(dashboard.todaysActivity.aiQueries ?? item.value) };
            if (item.label === "Alerts Triggered") return { ...item, value: String(dashboard.todaysActivity.alertsTriggered ?? item.value) };
           
            return item;
          })
        : LIVE_ACTIVITY;

    async function handleExportPdf() {
        if (exporting) return;
        setExporting(true);
        try {
            const dateLabel = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

            const blob = await generateAdminDashboardPdfBlob({
                userName: user?.fullName ?? "Admin",
                dateLabel,
                stats: adminStats.map((s: any) => ({ label: s.label, value: s.value, change: s.change ?? "" })),
                operationalItems: operationalItems.map((i: any) => ({ label: i.label, value: i.value })),
                aiMetrics: aiMetrics.map((m: any) => ({ label: m.label, value: m.value })),
                recentActivity: recentActivity.map((row: any) => ({
                    userName: row.userName,
                    action: row.action,
                    module: row.module,
                    time: formatDate(row.createdAt),
                })),
                liveActivity: liveActivity.map((i: any) => ({ label: i.label, value: i.value })),
                systemServices: systemServiceItems.map((svc) => ({ name: svc.name, status: svc.healthy ? "Operational" : "Down", sub: svc.sub })),
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Admin_Dashboard_Export_${dateLabel.replace(/\s+/g, "_")}.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            await appService.logReportGeneration({
                reportType: "market_snapshot",
                reportName: `Admin Dashboard Export - ${dateLabel}`,
                status: "completed",
            });
            toast.success("Dashboard exported successfully.");
        } catch (err) {
            console.error("Admin dashboard PDF export failed:", err);
            toast.error("Failed to export dashboard PDF.");
        } finally {
            setExporting(false);
        }
    }

    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-1 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">Admin Overview</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
                            Monitor platform performance, user activity, AI usage, and market intelligence operations across the platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                        <Button variant="navy" className="w-auto! py-2.5!" onClick={handleExportPdf} disabled={exporting}>
                            {exporting ? "EXPORTING..." : "EXPORT DASHBOARD"}
                        </Button>
                        <ModalButton className="py-2.5! max-w-fit px-5 text-sm!" onClick={() => setShowSystemStatus(true)}>
                            SYSTEM STATUS
                        </ModalButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {adminStats.map((s) => (
                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                            <div className="flex items-center justify-start gap-2 mb-2.5">
                                <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                                <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                            </div>
                            <AnimatedNumber value={s.value} className="text-2xl mb-2 mt-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-none" />
                            <div className="flex gap-2 items-center">
                                <div className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-green-600" : "text-red-500"}`}>
                                    <span className={`${s.up ? "bg-[#5E9F621C] text-[#5E9F62]" : "bg-[#C46A6A33] text-[#CF2D48] -rotate-180"} w-6 h-6 rounded-full flex justify-center items-center`}>
                                        <TrendArrow />
                                    </span>
                                </div>
                                <p className={`text-[13px] font-semibold ${s.up ? "text-green-600" : "text-red-500"}`}>{s.change}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Operational Intelligence + User Activity chart ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[40%_auto] gap-4">
                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Operational Intelligence</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Monitor activities, market intelligence, alerts, and overall platform performance
                        </p>
                        <div className="flex flex-col gap-5">
                            {operationalItems.map((item) => (
                                <div key={item.label}>
                                    <div className="flex bg-(--db-main-bg) hover:bg-(--db-drawer-header-bg) ease-linear transition-all items-center justify-between p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-sm bg-[#D28A441F] flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-medium text-(--db-text-primary)">{item.label}</span>
                                        </div>
                                        <AnimatedNumber value={item.value} className="text-[20px] font-semibold text-(--db-text-primary)" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-none!">

                        <div className="flex items-end flex-wrap justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">User Activity & Platform Usage</h2>
                                <p className="text-[13px] text-(--db-text-primary)">
                                    Track user engagement and platform activity trends
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none shrink-0"
                                >
                                    <option value="last_year">Last Year</option>
                                    <option value="last_6months">6 Months</option>
                                    <option value="last_month">Last Month</option>
                                </select>
                                <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                    <SortIcon />
                                </button>
                            </div>
                        </div>
                        <UserActivityChart data={userActivityData} />
                    </Card>
                </div>

                {/* ── Subscription Performance + AI Intelligence ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[30%_auto] gap-4">
                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Subscription Performance</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Monitor plan adoption, subscription growth, and recurring revenue performance.
                        </p>
                        <SubscriptionPieChart data={dashboard?.subscriptionPerformance} />
                    </Card>

                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">AI Intelligence Performance</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Monitor AI activity and system performance
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aiMetrics.map((m) => (
                                <div key={m.label} className={m.label === "Success Rate" ? "md:col-span-2" : undefined}>
                                    <div className="flex flex-col bg-(--db-main-bg) gap-5 justify-between p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-sm bg-[#D28A441F] flex items-center justify-center shrink-0">
                                                {m.icon}
                                            </div>
                                            <span className="text-sm font-medium text-(--db-text-primary)">{m.label}</span>
                                        </div>
                                        <div className="flex gap-14 items-center">
                                            <AnimatedNumber value={m.value} className="text-[26px] font-semibold text-(--db-text-primary)" />
                                            {m.progress && (
                                                <div className="h-1.25 bg-[#FFE7CF] rounded-sm flex items-center w-full">
                                                    <div className="w-5 h-full bg-[#D28A44] rounded-sm" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Recent Platform Activity ── */}
                <Card className="grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_262px] gap-4">
                    <Card className="overflow-hidden p-0!">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                            <div>
                                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Recent Platform Activity</h2>
                                <p className="text-[13px] text-(--db-text-primary)">Track the latest actions across the platform.</p>
                            </div>
                            <button className="w-full max-w-fit flex items-center justify-center gap-2 text-[14px] font-semibold text-[#D28A44] border border-[#D28A44] hover:bg-[#D28A44] hover:text-white rounded-sm px-4.75 py-2 transition-colors">
                                VIEW ALL
                            </button>
                        </div>
                        <div className="overflow-x-auto border border-(--db-border) rounded-md">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left font-semibold text-(--db-text-primary)">
                                        <th className="min-w-36 px-5 py-3 font-semibold whitespace-nowrap">User</th>
                                        <th className="min-w-72 px-5 py-3 font-semibold whitespace-nowrap">Action</th>
                                        <th className="min-w-36 px-5 py-3 font-semibold whitespace-nowrap">Module</th>
                                        <th className="min-w-28 px-5 py-3 font-semibold whitespace-nowrap">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((row: any, i: number) => (
                                        <tr key={i} className="border-b divide-x divide-(--db-border) text-(--db-text-primary) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                            <td className="px-5 py-3.5 font-medium whitespace-nowrap">{row.userName ?? '-'}</td>
                                            <td className="px-5 py-3.5">{row.action}</td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">{row.module}</td>
                                            <td className="px-5 py-3.5 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="rounded-none! bg-[#D28A4421]! flex flex-col">
                        <div className="flex relative p-[15px_16px] justify-between rounded-sm items-center gap-2 mb-3">
                            <div className="bg-(--db-main-bg) opacity-75 inset-0 w-full h-full absolute" />
                            <h3 className="text-[13px] relative z-1 font-medium text-(--db-text-primary)">Live Activity Status</h3>
                            <span className="w-3.25 relative z-1 h-3.25 rounded-full bg-[#5E9F62]" />
                        </div>
                        <div className="flex h-full relative p-[15px_16px] rounded-sm flex-col gap-3">
                            <div className="bg-(--db-main-bg) opacity-75 inset-0 w-full h-full absolute" />
                            <p className="text-lg relative z-1 font-semibold text-(--db-text-primary) mb-1 uppercase tracking-wide">Today's Activity</p>
                            {liveActivity.map((item) => (
                                <div key={item.label} className="flex relative z-1 text-[15px] text-(--db-text-primary) items-center gap-4">
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Card>

                {/* Could be used further */}
                {/* ── System Monitoring ── */}

                {/* <Card className="rounded-none!">
                    <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">System Monitoring</h2>
                            <p className="text-[13px] text-(--db-text-primary)">Monitor platform services, integrations, and system health.</p>
                        </div>
                        {systemHealth && (
                            <span
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-sm shrink-0"
                                style={{
                                    backgroundColor: systemHealth.status === "healthy" ? "#5E9F621C" : "#CF2D481C",
                                    color: systemHealth.status === "healthy" ? "#5E9F62" : "#CF2D48",
                                }}
                            >
                                {systemHealth.healthPercent}% {systemHealth.status === "healthy" ? "Healthy" : "Degraded"}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {systemServiceItems.map((svc) => (
                            <div key={svc.name} className="flex bg-(--db-main-bg) p-5 rounded-sm flex-col gap-3">
                                <p className="text-[15px] font-medium text-(--db-text-primary)">{svc.name}</p>

                                <span
                                    className="flex w-full items-center gap-1.5 px-3.75 py-4.5 rounded-sm text-[15px] font-semibold"
                                    style={{
                                        backgroundColor: svc.healthy ? "#5E9F621C" : "#CF2D481C",
                                        color: svc.healthy ? "#5E9F62" : "#CF2D48",
                                    }}
                                >
                                    <span className="w-3.25 h-3.25 rounded-full block bg-current" />
                                    {svc.healthy ? "Operational" : "Down"}
                                </span>
                                <p className="text-[12px] text-(--db-text-primary) mt-0.5">{svc.sub}</p>
                            </div>
                        ))}
                    </div>
                </Card> */}

            </div>

            {showSystemStatus && <SystemStatusModal onClose={() => setShowSystemStatus(false)} />}
        </div>
    );
}
