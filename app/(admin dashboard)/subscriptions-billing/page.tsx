"use client";

import { useState, useEffect } from "react";
import appService from "@/app/services/appService";
import { SubscriptionPieChart } from "@/app/components/dashboard/admin-analytics-charts";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import Button from "@/app/components/ui/button";
import { EditPlanModal, InvoiceDetailModal } from "@/app/components/dashboard/billing-modals";
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
const UPCOMING_PAGE_SIZE = 10;

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

export default function SubscriptionsBillingPage() {
    const [editingPlan, setEditingPlan]               = useState<any>(null);
    const [loadingPlanId, setLoadingPlanId]           = useState<string | null>(null);
    const [viewingInvoice, setViewingInvoice]         = useState<any>(null);

    const [dashboardStats, setDashboardStats]         = useState<any>(null);
    const [activeSubs, setActiveSubs]                 = useState<any[]>([]);
    const [activeSubsPage, setActiveSubsPage]         = useState(1);
    const [activeSubsTotalPages, setActiveSubsTotalPages] = useState(1);
    const [billingHistory, setBillingHistory]         = useState<any[]>([]);
    const [billingPeriod, setBillingPeriod]           = useState<string>("");
    const [billingPage, setBillingPage]               = useState(1);
    const [billingTotalPages, setBillingTotalPages]   = useState(1);
    const [upcomingRenewals, setUpcomingRenewals]     = useState<any[]>([]);
    const [upcomingPage, setUpcomingPage]             = useState(1);
    const [plans, setPlans]                           = useState<any[]>([]);
    const [planActiveUsers, setPlanActiveUsers]       = useState<Record<string, number>>({});
    const [subPerformance, setSubPerformance]         = useState<any>(null);
    const [revenueInsights, setRevenueInsights]       = useState<any>(null);

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
        appService.getActiveSubscriptions(activeSubsPage, PAGE_LIMIT).then((res) => {
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
    }, [activeSubsPage]);

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
        const res = await appService.getBillingHistoryById(row.id);
        setViewingInvoice(res?.data?.data ?? row);
    };

    const handleDownloadInvoice = async (row: any) => {
        if (row.stripePdfUrl) { window.open(row.stripePdfUrl, "_blank"); return; }
        const res = await appService.getBillingHistoryById(row.id);
        const detail = res?.data?.data ?? row;
        if (detail.stripePdfUrl) { window.open(detail.stripePdfUrl, "_blank"); return; }

        const userName  = typeof detail.user === "object" ? (detail.user?.fullName ?? detail.user?.email ?? "") : (detail.fullName ?? detail.user ?? "");
        const userEmail = typeof detail.user === "object" ? (detail.user?.email ?? "") : "";
        const fmtDate   = (d: string) => { try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }); } catch { return d || "-"; } };
        const status    = detail.status ?? "paid";

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Invoice ${detail.invoiceNumber ?? detail.id}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:48px;color:#111;background:#fff}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #D28A44}
.brand{font-size:22px;font-weight:700;color:#D28A44}
.inv-meta{text-align:right}
.inv-meta h1{font-size:28px;font-weight:700}
.inv-meta p{font-size:13px;color:#666;margin-top:4px;font-family:monospace}
.section{margin-bottom:28px}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;margin-bottom:10px}
.row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0f0f0}
.row:last-child{border-bottom:none}
.lbl{font-size:13px;color:#666}
.val{font-size:13px;font-weight:600;text-align:right}
.amount-box{display:flex;justify-content:space-between;align-items:center;background:#fdf6ee;border:1px solid #D28A44;border-radius:8px;padding:16px 20px;margin-top:24px}
.amt-lbl{font-size:15px;font-weight:600;color:#D28A44}
.amt-val{font-size:26px;font-weight:700;color:#D28A44}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700;background:#5E9F622E;color:#5E9F62}
.footer{margin-top:40px;padding-top:14px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#aaa}
@media print{body{padding:24px}}
</style></head><body>
<div class="header">
  <div class="brand">Alpha Estate</div>
  <div class="inv-meta"><h1>INVOICE</h1><p>${detail.invoiceNumber ?? detail.id ?? ""}</p></div>
</div>
<div class="section">
  <div class="sec-title">Billed To</div>
  <div class="row"><span class="lbl">Name</span><span class="val">${userName || "-"}</span></div>
  <div class="row"><span class="lbl">Email</span><span class="val">${userEmail || "-"}</span></div>
</div>
<div class="section">
  <div class="sec-title">Invoice Details</div>
  <div class="row"><span class="lbl">Invoice No.</span><span class="val">${detail.invoiceNumber ?? detail.id ?? "-"}</span></div>
  <div class="row"><span class="lbl">Plan</span><span class="val">${detail.planName ?? detail.plan?.name ?? "-"}</span></div>
  <div class="row"><span class="lbl">Billing Cycle</span><span class="val">${detail.billingCycle ?? detail.plan?.billingInterval ?? "-"}</span></div>
  <div class="row"><span class="lbl">Payment Date</span><span class="val">${fmtDate(detail.paymentDate ?? detail.date ?? "")}</span></div>
  <div class="row"><span class="lbl">Status</span><span class="val"><span class="badge">&#10003; ${status.charAt(0).toUpperCase() + status.slice(1)}</span></span></div>
</div>
<div class="amount-box">
  <span class="amt-lbl">Total Amount</span>
  <span class="amt-val">AED ${detail.amountAed ?? detail.amount ?? "-"}</span>
</div>
<div class="footer">System-generated invoice &bull; Alpha Estate &bull; ${new Date().getFullYear()}</div>
</body></html>`;

    //  further to download the invoice while clicking on the download button
        // const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        // const url  = URL.createObjectURL(blob);
        // const link = document.createElement("a");
        // link.href     = url;
        // link.download = `${detail.invoiceNumber ?? detail.id ?? "invoice"}.html`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const upcomingTotalPages = Math.ceil(upcomingRenewals.length / UPCOMING_PAGE_SIZE);
    const pagedUpcoming        = upcomingRenewals.slice((upcomingPage - 1) * UPCOMING_PAGE_SIZE, upcomingPage * UPCOMING_PAGE_SIZE);

    return (
        <div className="flex flex-col gap-5">
            {editingPlan && <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSave={handleSavePlan} />}
            {viewingInvoice && <InvoiceDetailModal invoice={viewingInvoice} onClose={() => setViewingInvoice(null)} />}

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
                    <Button variant="secondary" className="w-auto! py-2.5!">
                        EXPORT BILLING REPORT
                    </Button>
                    <Button variant="navy" className="w-auto! py-2.5!">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[30%_auto] gap-5">
                <div className="bg-(--db-sidebar-bg) rounded-md p-5">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Subscription Performance</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Monitor plan adoption, subscription growth, and recurring revenue performance.
                    </p>
                    <SubscriptionPieChart data={subPerformance ?? undefined} />
                </div>

                <SectionCard title="Plan Management" sub="Manage available subscription plans.">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(plans.length > 0 ? plans : BILLING_PLANS).map((p: any) => (
                            <div
                                key={p.name ?? p.planName}
                                className="flex flex-col gap-3 bg-[#D28A4421] rounded-sm p-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-[20px] text-(--db-text-primary)">{p.name ?? p.planName}</span>
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
                        <select className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none">
                            <option>Last Year</option>
                            <option>6 Months</option>
                            <option>30 Days</option>
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
                    {Array.from({ length: activeSubsTotalPages }, (_, idx) => idx + 1).map((p) => (
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
                    {Array.from({ length: billingTotalPages }, (_, idx) => idx + 1).map((p) => (
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
                                    <th className={thCls}>Amount</th>
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
                                        <td className={tdCls}>{str(row.renewalDate)}</td>
                                        <td className={`${tdCls} font-medium`}>{str(row.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        {Array.from({ length: upcomingTotalPages }, (_, idx) => idx + 1).map((p) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(revenueInsights ?? dashboardStats ? [
                            { label: "Monthly Revenue", value: String((revenueInsights ?? dashboardStats)?.monthlyRevenue ?? "") },
                            { label: "Yearly Revenue", value: String((revenueInsights ?? dashboardStats)?.annualRevenue ?? "") },
                            { label: "Revenue Per User", value: String((revenueInsights ?? dashboardStats)?.revenuePerUser ?? "") },
                            { label: "Subscription Growth", value: String((revenueInsights ?? dashboardStats)?.subscriptionGrowth ?? "") },
                        ] : BILLING_INSIGHTS).map((item) => (
                            <div
                                key={item.label}
                                className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-1"
                            >
                                <p className="text-sm text-(--db-text-primary) font-medium mb-2 leading-snug">{item.label}</p>
                                <AnimatedNumber
                                    value={item.value}
                                    className="text-lg font-medium text-(--db-text-primary)"
                                />
                            </div>
                        ))}
                    </div>
                </SectionCard>

            </div>
        </div>
    );
}
