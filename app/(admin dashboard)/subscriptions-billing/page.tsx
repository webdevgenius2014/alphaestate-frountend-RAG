"use client";

import { useState } from "react";
import { SubscriptionPieChart } from "@/app/components/dashboard/admin-analytics-charts";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import Button from "@/app/components/ui/button";
import { EditPlanModal } from "@/app/components/dashboard/billing-modals";
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

export default function SubscriptionsBillingPage() {
    const [editingPlan, setEditingPlan] = useState<BillingPlan | null>(null);

    return (
        <div className="flex flex-col gap-5">
            {editingPlan && <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} />}

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BILLING_STATS.map((s) => (
                    <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <AnimatedNumber
                            value={s.value}
                            className="text-2xl mb-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-[100%]"
                        />
                    </div>
                ))}
            </div>

            {/* Subscription Performance + Plan Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[30%_auto] gap-5">
                <div className="bg-(--db-sidebar-bg) rounded-md p-5">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Subscription Performance</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Monitor plan adoption, subscription growth, and recurring revenue performance.
                    </p>
                    <SubscriptionPieChart />
                </div>

                <SectionCard title="Plan Management" sub="Manage available subscription plans.">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {BILLING_PLANS.map((p) => (
                            <div
                                key={p.name}
                                className="flex flex-col gap-3 bg-[#D28A4421] rounded-sm p-4"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-[20px] text-(--db-text-primary)">{p.name}</span>
                                    <span className="text-[#D28A44] font-medium text-[20px]">{p.price} / month</span>
                                </div>
                                <p className="text-[10px] text-(--db-text-primary) leading-relaxed flex-1">{p.description}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <AnimatedNumber
                                        value={p.users.toLocaleString()}
                                        className="font-semibold text-[19px] text-(--db-text-primary)"
                                    />
                                    <span className="font-semibold text-[19px] text-(--db-text-primary)">Users</span>
                                </div>
                                <ModalButton className="py-2.25! rounded-sm!" onClick={() => setEditingPlan(p)}>
                                    EDIT PLAN
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
                            {BILLING_ACTIVE_SUBS.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={tdCls}>{row.user}</td>
                                    <td className={tdCls}>{row.plan}</td>
                                    <td className={tdCls}>{row.billingCycle}</td>
                                    <td className={tdCls}>{row.renewalDate}</td>
                                    <td className={`${tdCls} font-medium`}>{row.amount}</td>
                                    <td className={tdCls}><ActiveBadge status={row.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* Billing History */}
            <SectionCard
                title="Billing History"
                sub="Complete transaction and invoice history"
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
                            {BILLING_HISTORY.map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={`${tdCls} font-mono text-xs`}>{row.invoiceId}</td>
                                    <td className={tdCls}>{row.user}</td>
                                    <td className={tdCls}>{row.plan}</td>
                                    <td className={tdCls}>{row.date}</td>
                                    <td className={`${tdCls} font-medium`}>{row.amount}</td>
                                    <td className={tdCls}><PaidBadge status={row.status} /></td>
                                    <td className={tdCls}>
                                        <div className="flex items-center gap-2">
                                            <button className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear">
                                                <EyeIcon />
                                            </button>
                                            <button className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear">
                                                <DownloadIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                {BILLING_RENEWALS.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className={tdCls}>{row.user}</td>
                                        <td className={tdCls}>{row.plan}</td>
                                        <td className={tdCls}>{row.renewalDate}</td>
                                        <td className={`${tdCls} font-medium`}>{row.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                <SectionCard title="Revenue Insights" sub="Key financial metrics and growth indicators">
                    <div className="grid grid-cols-2 gap-4">
                        {BILLING_INSIGHTS.map((item) => (
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
