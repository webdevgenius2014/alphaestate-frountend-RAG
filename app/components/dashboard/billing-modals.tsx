"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import { BILLING_PLANS, type BillingPlan } from "@/app/(admin dashboard)/constants";
import appService from "@/app/services/appService";
import { generateInvoicePdfBlob } from "@/app/components/dashboard/invoice-pdf";

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";
const inputCls = "h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-primary)! focus:border-[#D28A44]/60!";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

function resolveInvoiceUser(row: any): string {
    const u = row.user ?? row.fullName ?? row.userName ?? "";
    if (typeof u === "object" && u !== null) return u.fullName ?? u.email ?? u.userName ?? "";
    return u;
}

function invoiceStr(val: any): string {
    if (val == null) return "";
    if (typeof val === "object") return val.name ?? val.planName ?? val.title ?? val.value ?? JSON.stringify(val);
    return String(val);
}

// ── Invoice List Modal ────────────────────────────────────────────────────────

const INVOICE_LIST_LIMIT = 8;
const invoiceListTdCls = "px-4 py-3 text-(--db-text-primary) whitespace-nowrap text-sm";
const invoiceListThCls = "px-4 py-2.5 font-semibold whitespace-nowrap text-left text-xs";

export function InvoiceListModal({ onClose, onViewInvoice }: { onClose: () => void; onViewInvoice: (row: any) => void }) {
    const [period, setPeriod] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [onClose]);

    useEffect(() => {
        setLoading(true);
        appService.getBillingHistory(period || undefined, page, INVOICE_LIST_LIMIT).then((res) => {
            const d = res?.data?.data;
            if (d) {
                setRows(Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : []);
                setTotalPages(Math.max(1, Math.ceil((d.total ?? 1) / (d.limit ?? INVOICE_LIST_LIMIT))));
            } else {
                setRows([]);
                setTotalPages(1);
            }
            setLoading(false);
        });
    }, [period, page]);

    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
        paid:    { bg: "bg-[#5E9F622E]", text: "text-[#5E9F62]", label: "Paid" },
        failed:  { bg: "bg-[#CF2D481F]", text: "text-[#CF2D48]", label: "Failed" },
        pending: { bg: "bg-[#D28A441F]", text: "text-[#D28A44]", label: "Pending" },
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-4xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 md:px-9.5 pt-7 md:pt-9.5 pb-7">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-[25px] font-medium text-(--db-text-primary)">All Invoices</h2>
                            <p className="text-sm text-(--db-text-primary) opacity-60 mt-0.5">Browse and filter the complete invoice history.</p>
                        </div>
                        <select
                            value={period}
                            onChange={(e) => { setPeriod(e.target.value); setPage(1); }}
                            className="text-xs border border-(--db-modal-field-border) rounded-sm px-2.5 py-2 bg-(--db-modal-field-bg) text-(--db-text-primary) outline-none"
                        >
                            <option value="">All Time</option>
                            <option value="last_year">Last Year</option>
                            <option value="last_6months">6 Months</option>
                            <option value="last_month">30 Days</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto max-h-[50vh] overflow-y-auto border border-(--db-border) rounded-md">
                        <table className="w-full">
                            <thead className="sticky top-0">
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                    <th className={invoiceListThCls}>Invoice ID</th>
                                    <th className={invoiceListThCls}>User</th>
                                    <th className={invoiceListThCls}>Plan</th>
                                    <th className={invoiceListThCls}>Date</th>
                                    <th className={invoiceListThCls}>Amount</th>
                                    <th className={invoiceListThCls}>Status</th>
                                    <th className={invoiceListThCls}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} className={`${invoiceListTdCls} text-center py-6`}>Loading...</td></tr>
                                ) : rows.length === 0 ? (
                                    <tr><td colSpan={7} className={`${invoiceListTdCls} text-center py-6`}>No invoices found</td></tr>
                                ) : (
                                    rows.map((row: any, i: number) => {
                                        const statusKey = (row.status ?? "paid") as string;
                                        const statusStyle = statusMap[statusKey] ?? statusMap.paid;
                                        return (
                                            <tr
                                                key={row.id ?? row.invoiceId ?? i}
                                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 hover:bg-(--db-main-bg) transition-colors cursor-pointer"
                                                onClick={() => onViewInvoice(row)}
                                            >
                                                <td className={`${invoiceListTdCls} font-mono text-xs`}>{invoiceStr(row.invoiceNumber ?? row.invoiceId ?? row.id)}</td>
                                                <td className={invoiceListTdCls}>{resolveInvoiceUser(row)}</td>
                                                <td className={invoiceListTdCls}>{invoiceStr(row.plan ?? row.planName)}</td>
                                                <td className={invoiceListTdCls}>{invoiceStr(row.paymentDate ?? row.date ?? row.createdAt ?? row.billingDate)}</td>
                                                <td className={`${invoiceListTdCls} font-medium`}>{invoiceStr(row.amountAed ?? row.amount)}</td>
                                                <td className={invoiceListTdCls}>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        {statusStyle.label}
                                                    </span>
                                                </td>
                                                <td className={invoiceListTdCls}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onViewInvoice(row); }}
                                                        className="text-xs font-semibold text-[#D28A44] hover:underline"
                                                    >
                                                        VIEW
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-5">
                            {Array.from(
                                { length: Math.min(5, totalPages - Math.max(1, Math.min(page - 2, totalPages - 4)) + 1) },
                                (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                            ).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-7 h-7 rounded-sm text-sm font-medium transition-colors ${page === p
                                        ? "bg-[#D28A44] text-white"
                                        : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Invoice Detail Modal ──────────────────────────────────────────────────────

export function InvoiceDetailModal({ invoice, onClose }: { invoice: any; onClose: () => void }) {
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [onClose]);

    const formatDate = (d: string) => {
        if (!d) return "-";
        try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
        catch { return d; }
    };

    const statusKey = (invoice.status ?? "paid") as string;
    const statusMap: Record<string, { bg: string; text: string }> = {
        paid:    { bg: "bg-[#5E9F622E]", text: "text-[#5E9F62]" },
        failed:  { bg: "bg-[#CF2D481F]", text: "text-[#CF2D48]" },
        pending: { bg: "bg-[#D28A441F]", text: "text-[#D28A44]" },
    };
    const statusStyle = statusMap[statusKey] ?? statusMap.paid;

    const userName  = typeof invoice.user === "object" ? (invoice.user?.fullName ?? invoice.user?.email ?? "") : (invoice.fullName ?? invoice.user ?? "");
    const userEmail = typeof invoice.user === "object" ? (invoice.user?.email ?? "") : "";
    const invoiceNumber = invoice.invoiceNumber ?? invoice.invoiceId ?? invoice.id ?? "invoice";

    const handleDownloadPdf = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            const blob = await generateInvoicePdfBlob({
                invoiceNumber: String(invoiceNumber),
                userName: userName || "-",
                userEmail: userEmail || "-",
                planName: invoice.planName ?? invoice.plan?.name ?? "-",
                billingCycle: invoice.billingCycle ?? invoice.plan?.billingInterval ?? "-",
                paymentDate: formatDate(invoice.paymentDate ?? invoice.date ?? ""),
                status: statusKey.charAt(0).toUpperCase() + statusKey.slice(1),
                amountLabel: invoice.amountAed != null ? `AED ${invoice.amountAed}` : `${invoice.amount ?? "-"}`,
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice_${invoiceNumber}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setDownloading(false);
        }
    };

    const rows = [
        { label: "Invoice No.",   value: invoice.invoiceNumber ?? invoice.invoiceId ?? invoice.id ?? "-" },
        { label: "User",          value: userName },
        { label: "Email",         value: userEmail },
        { label: "Plan",          value: invoice.planName ?? invoice.plan?.name ?? "-" },
        { label: "Billing Cycle", value: invoice.billingCycle ?? invoice.plan?.billingInterval ?? "-" },
        { label: "Amount",        value: invoice.amountAed != null ? `AED ${invoice.amountAed}` : invoice.amount ?? "-" },
        { label: "Payment Date",  value: formatDate(invoice.paymentDate ?? invoice.date ?? "") },
    ];

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 md:px-9.5 pt-7 md:pt-9.5 pb-4">
                    <div className="text-center mb-8">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-1">Invoice Details</h2>
                        <p className="text-xs text-(--db-text-primary) font-mono opacity-60">{invoice.invoiceNumber ?? invoice.id}</p>
                    </div>

                    <div className="divide-y divide-(--db-border)">
                        {rows.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between gap-4 py-3">
                                <span className="text-sm text-(--db-text-primary) opacity-60 shrink-0">{label}</span>
                                <span className="text-sm font-medium text-(--db-text-primary) text-right break-all">{value || "-"}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between gap-4 py-3">
                            <span className="text-sm text-(--db-text-primary) opacity-60">Status</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-7 pb-7 md:px-9.5 pt-3 flex gap-3 max-w-120 mx-auto">
                    <ModalButton onClick={handleDownloadPdf} disabled={downloading} className="flex-1">
                        {downloading ? "GENERATING..." : "DOWNLOAD PDF"}
                    </ModalButton>
                    <ModalButton onClick={onClose} className="flex-1">
                        CLOSE
                    </ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Edit Plan Modal ───────────────────────────────────────────────────────────

export function EditPlanModal({ plan, onClose, onSave }: {
    plan: any;
    onClose: () => void;
    onSave?: (id: string, payload: any) => Promise<void>;
}) {
    const rawPrice = String(plan.priceAed ?? plan.price ?? "").replace(/[^\d.]/g, "");
    const [price, setPrice] = useState(rawPrice);
    const [features, setFeatures] = useState(
        Array.isArray(plan.featuresJson) ? plan.featuresJson.join("\n") : (plan.description ?? "")
    );
    const [status, setStatus] = useState({
        active: plan.status === "active" || plan.isActive !== false,
        hidden: plan.status === "hidden",
        archived: plan.status === "archived",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [onClose]);

    const handleSave = async () => {
        if (!onSave) { onClose(); return; }
        setSaving(true);
        await onSave(plan.id, {
            priceAed: parseFloat(price) || undefined,
            status: status.active ? "active" : status.archived ? "archived" : "hidden",
            featuresJson: features.split("\n").filter(Boolean),
        });
        setSaving(false);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-197.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 md:px-9.5 md:pt-9.5 pt-7 pb-4 ">
                    <div className="text-center space-y-4 mb-10">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">Edit Subscription Plan</h2>
                        <p className="text-sm text-(--db-text-primary) font-normal">
                            Update pricing, features, and plan availability.
                        </p>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        <div>
                            <FieldLabel>Plan Name</FieldLabel>
                            <div className="relative">
                                <select className={`${selectCls} cursor-default opacity-70`} value={plan.name ?? plan.planName ?? ""} onChange={() => {}} disabled>
                                    <option value={plan.name ?? plan.planName ?? ""}>{plan.name ?? plan.planName ?? ""}</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel>Yearly Price</FieldLabel>
                                <Input
                                    placeholder={`AED ${parseInt(rawPrice || "0") * 10}`}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <FieldLabel>Monthly Price</FieldLabel>
                                <Input
                                    value={price}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Plan Status</FieldLabel>
                            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                                {(["active", "hidden", "archived"] as const).map((key) => (
                                    <label key={key} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={status[key]}
                                            onChange={() => setStatus((prev) => ({ ...prev, [key]: !prev[key] }))}
                                            className="w-4 h-4 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                        />
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Plan Features</FieldLabel>
                            <textarea
                                rows={4}
                                value={features}
                                onChange={(e) => setFeatures(e.target.value)}
                                placeholder="One feature per line"
                                className="w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 text-sm outline-none focus:border-[#D28A44]/60 transition resize-none placeholder-(--db-text-primary)"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-7 pb-7 md:px-9.5 max-w-86.5 mx-auto pt-3">
                    <ModalButton onClick={handleSave} disabled={saving}>
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
