"use client";

import { useState, useEffect } from "react";
import appService from "@/app/services/appService";
import { SubscriptionPieChart } from "@/app/components/dashboard/admin-analytics-charts";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import Button from "@/app/components/ui/button";
import { EditPlanModal, InvoiceDetailModal, InvoiceListModal } from "@/app/components/dashboard/billing-modals";
import { generateInvoicePdfBlob } from "@/app/components/dashboard/invoice-pdf";
import {
    BILLING_STATS,
    BILLING_PLANS,
    BILLING_ACTIVE_SUBS,
    BILLING_HISTORY,
    BILLING_RENEWALS,
    BILLING_INSIGHTS,
    type BillingPlan,
    EyeIcon,
    DownloadIcon,
} from "@/app/(admin dashboard)/constants";
import { SortIcon } from "@/app/(user dashboard)/constants";
import ModalButton from "@/app/components/ui/modal-button";
import { formatDate } from "@/app/constant";

// ── Local helpers ─────────────────────────────────────────────────────────────

function SectionCard({ title, sub, children, className = "", controls }: {
    title: string; sub?: string; children: React.ReactNode; className?: string; controls?: React.ReactNode;
}) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">{title}</h2>
                    {sub && <p className="text-[13px] text-(--db-text-primary) mt-0.5">{sub}</p>}
                </div>
                {controls && <div className="flex items-center gap-2 shrink-0">{controls}</div>}
            </div>
            {children}
        </div>
    );
}

function ActiveBadge({ status }: { status: "active" | "expired" | "pending" }) {
    const map = {
        active: { bg: "bg-[#5E9F622E]", text: "text-[#5E9F62]", label: "Active" },
        expired: { bg: "bg-[#CF2D481F]", text: "text-[#CF2D48]", label: "Expired" },
        pending: { bg: "bg-[#D28A441F]", text: "text-[#D28A44]", label: "Pending" },
    }[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${map.bg} ${map.text}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {map.label}
        </span>
    );
}

function PaidBadge({ status }: { status: "paid" | "failed" | "pending" }) {
    const map = {
        paid: { bg: "bg-[#5E9F622E]", text: "text-[#5E9F62]", label: "Paid" },
        failed: { bg: "bg-[#CF2D481F]", text: "text-[#CF2D48]", label: "Failed" },
        pending: { bg: "bg-[#D28A441F]", text: "text-[#D28A44]", label: "Pending" },
    }[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${map.bg} ${map.text}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {map.label}
        </span>
    );
}
// ── Page ─────────────────────────────────────────────────────────────────────

const tdCls = "px-5 py-3.5 text-(--db-text-primary) whitespace-nowrap";
const thCls = "px-5 py-3 font-semibold whitespace-nowrap text-left";
const PAGE_LIMIT = 10;
const UPCOMING_PAGE_SIZE = 3;

function resolveUser(row: any): string {
    const u = row.user ?? row.fullName ?? row.userName ?? "";
    if (typeof u === "object" && u !== null) return u.fullName ?? u.email ?? u.userName ?? "";
    return u;
}

function str(val: any): string {
    if (val == null) return "";
    if (typeof val === "object") return val.name ?? val.planName ?? val.title ?? val.value ?? JSON.stringify(val);
    return String(val);
}

function formatAedCompact(n: any): string {
    const num = Number(n);
    if (n == null || n === "-" || Number.isNaN(num)) return "-";
    const abs = Math.abs(num);
    if (abs >= 1e9) return `AED ${+(num / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `AED ${+(num / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `AED ${+(num / 1e3).toFixed(1)}K`;
    return `AED ${num.toFixed(0)}`;
}

export default function SubscriptionsBillingPage() {
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
    const [viewingInvoice, setViewingInvoice] = useState<any>(null);
    const [showInvoiceList, setShowInvoiceList] = useState(false);

    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [activeSubs, setActiveSubs] = useState<any[]>([]);
    const [activeSubsPage, setActiveSubsPage] = useState(1);
    const [activeSubsTotalPages, setActiveSubsTotalPages] = useState(1);
    const [activeSubsPeriod, setActiveSubsPeriod] = useState<string>("last_year");
    const [billingHistory, setBillingHistory] = useState<any[]>([]);
    const [billingPeriod, setBillingPeriod] = useState<string>("");
    const [billingPage, setBillingPage] = useState(1);
    const [billingTotalPages, setBillingTotalPages] = useState(1);
    const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [plans, setPlans] = useState<any[]>([]);
    const [planActiveUsers, setPlanActiveUsers] = useState<Record<string, number>>({});
    const [planTab, setPlanTab] = useState<"monthly" | "annual">("monthly");
    const [subPerformance, setSubPerformance] = useState<any>(null);
    const [revenueInsights, setRevenueInsights] = useState<any>(null);
    const [exportingBilling, setExportingBilling] = useState(false);

    useEffect(() => {
        appService.getSubscriptionDashboard().then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setDashboardStats(d);
                if (d.performance) {
                    const arr = Array.isArray(d.performance)
                        ? d.performance
                        : Object.entries(d.performance).map(([planName, percentage]) => ({ planName, count: 0, percentage: percentage as number }));
                    setSubPerformance(arr);
                }
                if (d.planManagement?.length) {
                    const map: Record<string, number> = {};
                    d.planManagement.forEach((pm: any) => { map[pm.id] = pm.activeUsers ?? 0; });
                    setPlanActiveUsers(map);
                }
            }
        });
        appService.getUpcomingRenewals(100).then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setUpcomingRenewals(Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : []);
            }
        });
        appService.getAdminSubscriptionPlans().then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setPlans(Array.isArray(d) ? d : []);
            }
        });
        appService.getRevenueInsights().then((res) => {
            if (res?.data?.data) setRevenueInsights(res.data.data);
        });
    }, []);

    useEffect(() => {
        appService.getActiveSubscriptions(activeSubsPage, PAGE_LIMIT, activeSubsPeriod || undefined).then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setActiveSubs(Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : []);
                setActiveSubsTotalPages(Math.ceil((d.total ?? 1) / (d.limit ?? PAGE_LIMIT)));
                if (d.performance) {
                    const arr = Array.isArray(d.performance)
                        ? d.performance
                        : Object.entries(d.performance).map(([planName, percentage]) => ({ planName, count: 0, percentage: percentage as number }));
                    setSubPerformance(arr);
                }
            }
        });
    }, [activeSubsPage, activeSubsPeriod]);

    useEffect(() => {
        appService.getBillingHistory(billingPeriod || undefined, billingPage, PAGE_LIMIT).then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setBillingHistory(Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : []);
                setBillingTotalPages(Math.ceil((d.total ?? 1) / (d.limit ?? PAGE_LIMIT)));
            }
        });
    }, [billingPeriod, billingPage]);

    const handleEditPlan = async (p: any) => {
        setLoadingPlanId(p.id);
        const res = await appService.getSubscriptionPlanById(p.id);
        setLoadingPlanId(null);
        setEditingPlan(res?.data?.data ?? p);
    };

    const handleSavePlan = async (id: string, payload: any) => {
        await appService.updateSubscriptionPlanById(id, payload);
        const res = await appService.getAdminSubscriptionPlans();
        if (res?.data?.data) setPlans(Array.isArray(res.data.data) ? res.data.data : []);
    };

    const handleViewInvoice = async (row: any) => {
        setShowInvoiceList(false);
        const res = await appService.getBillingHistoryById(row.id);
        setViewingInvoice(res?.data?.data ?? row);
    };

    const handleDownloadInvoice = async (row: any) => {
        const res = await appService.getBillingHistoryById(row.id);
        const detail = res?.data?.data ?? row;

        const userName = typeof detail.user === "object" ? (detail.user?.fullName ?? detail.user?.email ?? "") : (detail.fullName ?? detail.user ?? "");
        const userEmail = typeof detail.user === "object" ? (detail.user?.email ?? "") : "";
        const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }); } catch { return d || "-"; } };
        const status = detail.status ?? "paid";
        const invoiceNumber = detail.invoiceNumber ?? detail.id ?? "invoice";

        const blob = await generateInvoicePdfBlob({
            invoiceNumber: String(invoiceNumber),
            userName: userName || "-",
            userEmail: userEmail || "-",
            planName: detail.planName ?? detail.plan?.name ?? "-",
            billingCycle: detail.billingCycle ?? detail.plan?.billingInterval ?? "-",
            paymentDate: fmtDate(detail.paymentDate ?? detail.date ?? ""),
            status: status.charAt(0).toUpperCase() + status.slice(1),
            amountLabel: `AED ${detail.amountAed ?? detail.amount ?? "-"}`,
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${invoiceNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportBillingReport = async () => {
        if (exportingBilling) return;
        setExportingBilling(true);
        try {
            const res = await appService.exportBillingReport();
            if ((res?.status === 200 || res?.status === 201) && res?.data) {
                const disposition: string = res.headers?.["content-disposition"] || "";
                const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
                const filename = filenameMatch?.[1] || `billing-report-${new Date().toISOString().slice(0, 10)}.xlsx`;

                const url = URL.createObjectURL(res.data as Blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        } finally {
            setExportingBilling(false);
        }
    };

    const upcomingTotalPages = Math.ceil(upcomingRenewals.length / UPCOMING_PAGE_SIZE);
    const pagedUpcoming = upcomingRenewals.slice((upcomingPage - 1) * UPCOMING_PAGE_SIZE, upcomingPage * UPCOMING_PAGE_SIZE);

    return (
        <div className="flex flex-col gap-5">
            {editingPlan && <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSave={handleSavePlan} />}
            {viewingInvoice && <InvoiceDetailModal invoice={viewingInvoice} onClose={() => setViewingInvoice(null)} />}
            {showInvoiceList && <InvoiceListModal onClose={() => setShowInvoiceList(false)} onViewInvoice={handleViewInvoice} />}

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                        Subscriptions & Billing
                    </h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Manage subscription plans, monitor revenue, and track billing history.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                    <Button variant="secondary" className="w-auto! py-2.5!" onClick={handleExportBillingReport} disabled={exportingBilling}>
                        {exportingBilling ? "EXPORTING..." : "EXPORT BILLING REPORT"}
                    </Button>
                    <Button variant="navy" className="w-auto! py-2.5!" onClick={() => setShowInvoiceList(true)}>
                        VIEW INVOICES
                    </Button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BILLING_STATS.map((s, i) => {
                    const apiValues = [
                        dashboardStats?.totalActiveSubscriptions != null ? String(dashboardStats.totalActiveSubscriptions) : null,
                        dashboardStats?.monthlyRevenue != null ? String(dashboardStats.monthlyRevenue) : null,
                        dashboardStats?.revenuePerUser != null ? String(dashboardStats.revenuePerUser) : null,
                        dashboardStats?.annualRevenue != null ? String(dashboardStats.annualRevenue) : null,
                    ];
                    const val = apiValues[i] ?? s.value;
                    return (
                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                            <div className="flex items-center justify-start gap-2 mb-2.5">
                                <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                                <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                            </div>
                            <AnimatedNumber
                                value={val}
                                className="text-2xl mb-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-[100%]"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Subscription Performance + Plan Management */}
            <div className="grid grid-cols-1 xl:grid-cols-[30%_auto] gap-5">
                <div className="bg-(--db-sidebar-bg) rounded-md p-5">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Subscription Performance</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Monitor plan adoption, subscription growth, and recurring revenue performance.
                    </p>
                    <SubscriptionPieChart data={subPerformance ?? undefined} />
                </div>

                <SectionCard title="Plan Management" sub="Manage available subscription plans.">
                    <div className="flex gap-2 mb-4">
                        {(["monthly", "annual"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setPlanTab(tab)}
                                className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors capitalize ${
                                    planTab === tab
                                        ? "bg-[#D28A44] text-white"
                                        : "bg-(--db-main-bg) border border-(--db-border) text-(--db-text-primary) hover:bg-[#D28A4421]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(plans.length > 0 ? plans : BILLING_PLANS)
                            .filter((p: any) => (p.billingInterval ?? "monthly").toLowerCase() === planTab)
                            .map((p: any) => (
                            <div
                                key={p.name ?? p.planName}
                                className="flex flex-col gap-3 bg-[#D28A4421] rounded-sm p-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-[20px] text-(--db-text-primary)">{(p.name ?? p.planName ?? "").replace(/\s*(monthly|annual)\s*/i, "").trim()}</span>
                                    <span className="text-[#D28A44] font-medium text-[20px]">{p.priceAed ?? p.price ?? p.monthlyPrice} / {p.billingInterval ?? "month"}</span>
                                </div>
                                <p className="text-[10px] text-(--db-text-primary) leading-relaxed flex-1">{p.description}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <AnimatedNumber
                                        value={String(planActiveUsers[p.id] ?? p.users ?? p.activeUsers ?? p.userCount ?? 0)}
                                        className="font-semibold text-[19px] text-(--db-text-primary)"
                                    />
                                    <span className="font-semibold text-[19px] text-(--db-text-primary)">Users</span>
                                </div>
                                <ModalButton className="py-2.25! rounded-sm!" onClick={() => handleEditPlan(p)} disabled={loadingPlanId === p.id}>
                                    {loadingPlanId === p.id ? "LOADING..." : "EDIT PLAN"}
                                </ModalButton>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* Active Subscriptions */}
            <SectionCard
                title="Active Subscriptions"
                sub="Currently active user subscription records"
                controls={
                    <>
                        <select
                            value={activeSubsPeriod}
                            onChange={(e) => { setActiveSubsPeriod(e.target.value); setActiveSubsPage(1); }}
                            className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                        >
                            <option value="last_year">Last Year</option>
                            <option value="last_6months">6 Months</option>
                            <option value="last_month">30 Days</option>
                        </select>
                        <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                            <SortIcon />
                        </button>
                    </>
                }
            >
                <div className="overflow-x-auto border border-(--db-border) rounded-md">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                <th className={thCls}>User</th>
                                <th className={thCls}>Plan</th>
                                <th className={thCls}>Billing Cycle</th>
                                <th className={thCls}>Renewal Date</th>
                                <th className={thCls}>Amount</th>
                                <th className={thCls}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeSubs.length > 0 ? activeSubs : BILLING_ACTIVE_SUBS).map((row: any, i: number) => (
                                <tr
                                    key={row.id ?? i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={tdCls}>{resolveUser(row)}</td>
                                    <td className={tdCls}>{str(row.plan ?? row.planName)}</td>
                                    <td className={tdCls}>{str(row.plan?.billingInterval ?? row.billingCycle)}</td>
                                    <td className={tdCls}>{str(row.endsAt ?? row.renewalDate)}</td>
                                    <td className={`${tdCls} font-medium`}>{str(row.plan?.priceAed ?? row.amount)}</td>
                                    <td className={tdCls}><ActiveBadge status={row.status ?? "active"} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {Array.from(
                        {
                            length: Math.min(
                                5,
                                activeSubsTotalPages -
                                Math.max(
                                    1,
                                    Math.min(activeSubsPage - 2, activeSubsTotalPages - 4)
                                ) +
                                1
                            ),
                        },
                        (_, i) =>
                            Math.max(
                                1,
                                Math.min(activeSubsPage - 2, activeSubsTotalPages - 4)
                            ) + i
                    ).map((p) => (
                        <button
                            key={p}
                            onClick={() => setActiveSubsPage(p)}
                            className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${activeSubsPage === p
                                ? "bg-[#D28A44] text-white"
                                : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Billing History */}
            <SectionCard
                title="Billing History"
                sub="Complete transaction and invoice history"
                controls={
                    <>
                        <select
                            value={billingPeriod}
                            onChange={(e) => { setBillingPeriod(e.target.value); setBillingPage(1); }}
                            className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                        >
                            <option value="">All Time</option>
                            <option value="last_year">Last Year</option>
                            <option value="last_6months">6 Months</option>
                            <option value="last_month">30 Days</option>
                        </select>
                        <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                            <SortIcon />
                        </button>
                    </>
                }
            >
                <div className="overflow-x-auto border border-(--db-border) rounded-md">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                <th className={thCls}>Invoice ID</th>
                                <th className={thCls}>User</th>
                                <th className={thCls}>Plan</th>
                                <th className={thCls}>Date</th>
                                <th className={thCls}>Amount</th>
                                <th className={thCls}>Status</th>
                                <th className={thCls}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(billingHistory.length > 0 ? billingHistory : BILLING_HISTORY).map((row: any, i: number) => (
                                <tr
                                    key={row.id ?? row.invoiceId ?? i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={`${tdCls} font-mono text-xs`}>{str(row.invoiceNumber ?? row.invoiceId ?? row.id)}</td>
                                    <td className={tdCls}>{resolveUser(row)}</td>
                                    <td className={tdCls}>{str(row.plan ?? row.planName)}</td>
                                    <td className={tdCls}>{str(row.paymentDate ?? row.date ?? row.createdAt ?? row.billingDate)}</td>
                                    <td className={`${tdCls} font-medium`}>{str(row.amountAed ?? row.amount)}</td>
                                    <td className={tdCls}><PaidBadge status={row.status ?? "paid"} /></td>
                                    <td className={tdCls}>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleViewInvoice(row)} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear">
                                                <EyeIcon />
                                            </button>
                                            <button onClick={() => handleDownloadInvoice(row)} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear">
                                                <DownloadIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {Array.from(
                        {
                            length: Math.min(
                                5,
                                billingTotalPages -
                                Math.max(
                                    1,
                                    Math.min(billingPage - 2, billingTotalPages - 4)
                                ) +
                                1
                            ),
                        },
                        (_, i) =>
                            Math.max(
                                1,
                                Math.min(billingPage - 2, billingTotalPages - 4)
                            ) + i
                    ).map((p) => (
                        <button
                            key={p}
                            onClick={() => setBillingPage(p)}
                            className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${billingPage === p
                                ? "bg-[#D28A44] text-white"
                                : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Upcoming Renewals + Revenue Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <SectionCard title="Upcoming Renewals" sub="Subscriptions renewing in the next 30 days">
                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                    <th className={thCls}>User</th>
                                    <th className={thCls}>Plan</th>
                                    <th className={thCls}>Renewal Date</th>
                                     {/* Could be used further */}
                                    {/* <th className={thCls}>Amount</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {(upcomingRenewals.length > 0 ? pagedUpcoming : BILLING_RENEWALS).map((row: any, i: number) => (
                                    <tr
                                        key={row.id ?? i}
                                        className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className={tdCls}>{resolveUser(row)}</td>
                                        <td className={tdCls}>{str(row.plan ?? row.planName)}</td>
                                        <td className={tdCls}>{formatDate(row.renewalDate)}</td>
                                        {/* Could be used further */}
                                        {/* <td className={`${tdCls} font-medium`}>{str(row.amount)}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        {Array.from(
                            {
                                length: Math.min(
                                    5,
                                    upcomingTotalPages -
                                    Math.max(
                                        1,
                                        Math.min(upcomingPage - 2, upcomingTotalPages - 4)
                                    ) +
                                    1
                                ),
                            },
                            (_, i) =>
                                Math.max(
                                    1,
                                    Math.min(upcomingPage - 2, upcomingTotalPages - 4)
                                ) + i
                        ).map((p) => (
                            <button
                                key={p}
                                onClick={() => setUpcomingPage(p)}
                                className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${upcomingPage === p
                                        ? "bg-[#D28A44] text-white"
                                        : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard title="Revenue Insights" sub="Key financial metrics and growth indicators">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {(() => {
                            const revenueData = revenueInsights?.summary ?? revenueInsights ?? dashboardStats;
                            return revenueData ? [
                                { label: "Monthly Revenue", value: formatAedCompact(revenueData?.monthlyRevenue) },
                                { label: "Yearly Revenue", value: formatAedCompact(revenueData?.yearlyRevenue ?? revenueData?.annualRevenue) },
                                { label: "Revenue Per User", value: formatAedCompact(revenueData?.revenuePerUser) },
                                { label: "Subscription Growth", value: revenueData?.subscriptionGrowth != null ? `${revenueData.subscriptionGrowth}%` : "-" },
                            ] : BILLING_INSIGHTS;
                        })().map((item) => (
                            <div
                                key={item.label}
                                className="bg-(--db-main-bg) rounded-md p-4 md:p-5 flex flex-col gap-1"
                            >
                                <p className="text-[11px] md:text-sm text-(--db-text-primary) font-medium mb-1 md:mb-2 leading-snug">{item.label}</p>
                                <AnimatedNumber
                                    value={item.value}
                                    className="text-base md:text-lg font-medium text-(--db-text-primary)"
                                />
                            </div>
                        ))}
                    </div>
                </SectionCard>

            </div>
        </div>
    );
}
