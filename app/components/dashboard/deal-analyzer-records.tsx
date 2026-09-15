"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { DealAnalyzerDetailDrawer } from "@/app/components/dashboard/deal-analyzer-detail-drawer";
import { DeleteDealRecordModal } from "@/app/components/dashboard/admin-modals";
import { formatRelativeTime } from "@/app/utils/session";
import { buildReportPdf } from "@/app/utils/reportPdf";
import {
    DEAL_ANALYZER_STATS,
    DEAL_ANALYZER_RECORDS,
    DEAL_VERDICT_CONFIG,
    type DealVerdict,
    type DealAnalysisDetail,
    EyeIcon,
    DownloadIcon,
    TrashIcon,
    thCls,
    tdCls,
    actionBtnCls,
} from "@/app/(admin dashboard)/constants";

function pick(obj: any, keys: string[]): unknown {
    for (const k of keys) {
        if (obj?.[k] != null) return obj[k];
    }
    return undefined;
}

function titleCase(s: string): string {
    return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCount(v: unknown): string | undefined {
    if (v == null) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : n.toLocaleString();
}

function resolveVerdict(v: unknown): DealVerdict {
    const s = String(v ?? "").toLowerCase();
    if (s.includes("good")) return "🟢 Good Deal";
    if (s.includes("fair")) return "🟡 Fair Deal";
    if (s.includes("overpriced") || s.includes("bad") || s.includes("poor")) return "🔴 Overpriced";
    return "🟡 Fair Deal";
}

function resolveDate(row: any): string {
    const t = row.date ?? row.createdAt ?? row.analyzedAt ?? row.timestamp;
    if (!t) return "-";
    const asDate = new Date(t);
    return isNaN(asDate.getTime()) ? String(t) : formatRelativeTime(t);
}

function toNumber(v: unknown): number | null {
    if (v == null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}

function toDealDetail(d: any, row?: any): DealAnalysisDetail {
    return {
        imageUrl: d?.imageUrl ?? d?.coverImageUrl ?? d?.propertyImageUrl ?? row?.imageUrl ?? row?.coverImageUrl ?? null,
        propertyType: d?.propertyType ?? row?.propertyType ?? "-",
        district: d?.district ?? row?.district ?? "-",
        areaSqm: toNumber(d?.areaSqm),
        askingPriceAed: toNumber(d?.askingPriceAed),
        saleType: d?.saleType ?? "-",
        bedrooms: d?.bedrooms ?? "-",
        expectedAnnualRentAed: toNumber(d?.expectedAnnualRentAed),
        dealScore: toNumber(d?.dealScore) ?? row?.dealScore ?? 0,
        dealVerdict: d?.dealVerdict ?? row?.dealVerdict ?? "",
        dealVerdictLabel: d?.dealVerdictLabel ?? "",
        estimatedMarketPriceAed: toNumber(d?.estimatedMarketPriceAed),
        pricePositionPct: toNumber(d?.pricePositionPct),
        pricePositionLabel: d?.pricePositionLabel ?? "-",
        marketVerdict: d?.marketVerdict ?? "-",
        avgPricePerSqm: toNumber(d?.avgPricePerSqm),
        comparableTransactions: toNumber(d?.comparableTransactions) ?? 0,
        districtTrend: d?.districtTrend ?? "-",
        demandActivity: d?.demandActivity ?? "-",
        roi: toNumber(d?.roi),
        rentalYield: toNumber(d?.rentalYield),
        userName: d?.userName ?? null,
        userEmail: d?.userEmail ?? null,
        createdAt: d?.createdAt ?? null,
        timeAgo: d?.timeAgo ?? null,
    };
}

export function DealAnalyzerRecords() {
    const [stats, setStats] = useState<any>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [drawerRecord, setDrawerRecord] = useState<DealAnalysisDetail | null>(null);
    const [viewLoadingId, setViewLoadingId] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

    useEffect(() => {
        appService.getAdminDealAnalyzerRecords().then((res) => {
            const d = res?.data?.data;
            if (d) {
                setStats(d.stats ?? d);
                const list = pick(d, ["records", "items", "deals"]);
                if (Array.isArray(list)) setRecords(list);
                else if (Array.isArray(d)) setRecords(d);
            }
        });
    }, [refreshKey]);

    const handleView = async (row: any) => {
        if (!row.id) { setDrawerRecord(toDealDetail(row, row)); return; }

        setViewLoadingId(row.id);
        const res = await appService.getAdminDealAnalyzerRecordById(row.id);
        setViewLoadingId(null);

        const d = res?.data?.data;
        if (d) {
            setDrawerRecord(toDealDetail(d, row));
        } else {
            toast.error(res?.data?.message || "Failed to load deal record details.");
            setDrawerRecord(toDealDetail(row, row));
        }
    };

    const handleDownload = async (row: any) => {
        if (!row.id) { toast.error("Deal record not found."); return; }

        setDownloadingId(row.id);
        const res = await appService.getAdminDealAnalyzerRecordById(row.id);
        setDownloadingId(null);

        const d = res?.data?.data;
        if (!d) {
            toast.error(res?.data?.message || "Failed to load deal record for download.");
            return;
        }

        const doc = await buildReportPdf({
            reportName: `Deal Analysis - ${titleCase(d.propertyType ?? row.propertyType ?? "")}`,
            district: d.district ?? row.district,
            propertyType: d.propertyType ?? row.propertyType,
            sections: [{ title: "Deal Analysis", dealResult: d }],
        });
        doc.save(`Deal_Analysis_${row.id}.pdf`);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.id) { setDeleteTarget(null); return; }
        const res = await appService.deleteAdminDealAnalyzerRecordById(deleteTarget.id);
        setDeleteTarget(null);

        if (res?.data?.success || res?.status === 200 || res?.status === 204) {
            toast.success("Deal record deleted.");
            setRefreshKey((k) => k + 1);
        } else {
            toast.error(res?.data?.message || "Failed to delete deal record.");
        }
    };

    const apiStats: (string | undefined)[] = [
        formatCount(pick(stats, ["totalAnalyses", "totalAnalysesCount", "total"])),
        formatCount(pick(stats, ["goodDeals", "goodDealsCount"])),
        formatCount(pick(stats, ["fairDeals", "fairDealsCount"])),
        formatCount(pick(stats, ["overpricedDeals", "overpricedDealsCount"])),
    ];

    const rows = records.length > 0 ? records : DEAL_ANALYZER_RECORDS;

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Deal Analyzer Records</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Review and manage historical deal analysis records.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {DEAL_ANALYZER_STATS.map((s, i) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                        <div className="flex items-center justify-start gap-2 mb-2.5">
                            <div className="shrink-0 bg-[#D28A441F] w-10 h-10 flex justify-center items-center rounded-sm">{s.icon}</div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <AnimatedNumber
                            value={apiStats[i] ?? s.value}
                            className="text-2xl md:text-[42px] font-semibold text-(--db-text-primary) leading-none mt-1"
                        />
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto border border-(--db-border) rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                            <th className={thCls}>Property</th>
                            <th className={thCls}>District</th>
                            <th className={thCls}>Deal Score</th>
                            <th className={thCls}>Verdict</th>
                            <th className={thCls}>Date</th>
                            <th className={thCls}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, i: number) => {
                            const verdict: DealVerdict = row.verdict && DEAL_VERDICT_CONFIG[row.verdict as DealVerdict]
                                ? row.verdict
                                : resolveVerdict(row.verdict ?? row.dealVerdict);
                            return (
                                <tr
                                    key={i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={`${tdCls} font-medium`}>
                                        {row.propertyType ? titleCase(String(row.propertyType)) : (row.property ?? row.propertyName ?? row.name ?? "-")}
                                    </td>
                                    <td className={tdCls}>{row.district}</td>
                                    <td className={tdCls}>{row.dealScore ?? row.score}</td>
                                    <td className={tdCls}>
                                        <span className="flex items-center gap-1.5">
                                            {verdict}
                                        </span>
                                    </td>
                                    <td className={tdCls}>{resolveDate(row)}</td>
                                    <td className={tdCls}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className={`${actionBtnCls} disabled:opacity-50`}
                                                title="View"
                                                disabled={viewLoadingId === row.id}
                                                onClick={() => handleView(row)}
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button
                                                className={`${actionBtnCls} disabled:opacity-50`}
                                                title="Download"
                                                disabled={downloadingId === row.id}
                                                onClick={() => handleDownload(row)}
                                            >
                                                <DownloadIcon />
                                            </button>
                                            <button
                                                className={`${actionBtnCls} hover:bg-[#E05252]`}
                                                title="Delete"
                                                onClick={() => setDeleteTarget(row)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {drawerRecord && <DealAnalyzerDetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />}

            <DeleteDealRecordModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />

        </div>
    );
}
