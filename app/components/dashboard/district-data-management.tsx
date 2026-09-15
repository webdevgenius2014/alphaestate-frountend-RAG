"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import appService from "@/app/services/appService";
import { DISTRICT_DATA, DISTRICT_TREND_CONFIG, EyeIcon, EditIcon, TrashIcon, type DistrictDetail, tdCls, actionBtnCls, thCls } from "@/app/(admin dashboard)/constants";
import { DeleteDistrictModal } from "./admin-modals";
import ModalButton from "../ui/modal-button";

const PAGE_LIMIT = 20;

const TREND_META: Record<string, { label: string; icon: string }> = {
    rising: { label: "Rising", icon: "📈" },
    stable: { label: "Stable", icon: "📊" },
    declining: { label: "Declining", icon: "📉" },
};

function formatPriceSqm(v: unknown): string {
    if (v == null) return "-";
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : `AED ${n.toLocaleString()}`;
}

function toNumber(v: unknown): number | null {
    if (v == null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
}

function toDistrictDetail(d: any, fallback?: DistrictDetail): DistrictDetail {
    return {
        name: d?.name ?? fallback?.name ?? "-",
        status: String(d?.status ?? fallback?.status ?? "active"),
        description: d?.description ?? fallback?.description ?? null,
        coverImageUrl: d?.coverImageUrl ?? fallback?.coverImageUrl ?? null,
        avgPriceSqm: toNumber(d?.avgPriceSqm) ?? fallback?.avgPriceSqm ?? null,
        avgRentalYield: toNumber(d?.avgRentalYield) ?? fallback?.avgRentalYield ?? null,
        avgRoi: toNumber(d?.avgRoi) ?? fallback?.avgRoi ?? null,
        apartmentsPct: toNumber(d?.apartmentsPct) ?? fallback?.apartmentsPct ?? null,
        villasPct: toNumber(d?.villasPct) ?? fallback?.villasPct ?? null,
        townhousesPct: toNumber(d?.townhousesPct) ?? fallback?.townhousesPct ?? null,
        totalTransactions: toNumber(d?.totalTransactions) ?? fallback?.totalTransactions ?? 0,
        trendDirection: d?.trendDirectionOverride ?? d?.trendDirection ?? fallback?.trendDirection ?? null,
        marketSignal: d?.marketSignalOverride ?? d?.marketSignal ?? fallback?.marketSignal ?? null,
        appreciationPotential: d?.appreciationPotential ?? fallback?.appreciationPotential ?? null,
    };
}

type Row = {
    id?: string;
    name: string;
    transactions: number;
    avgPriceLabel: string;
    trendLabel: string;
    trendIcon: string;
    status: "active" | "inactive";
    detail: DistrictDetail;
};

export function DistrictDataManagement({ onEye }: { onEye: (detail: DistrictDetail) => void }) {
    const router = useRouter();
    const goToForm = (id?: string) => router.push(id ? `/ai-data/add-district?id=${id}` : "/ai-data/add-district");

    const [districts, setDistricts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
    const [viewLoadingId, setViewLoadingId] = useState<string | null>(null);

    useEffect(() => {
        appService.getAdminDistricts(page, PAGE_LIMIT).then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                const items = Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : [];
                setDistricts(items);
                setTotalPages(Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? PAGE_LIMIT))));
            }
        });
    }, [page, refreshKey]);

    const rows: Row[] = districts.length > 0
        ? districts.map((d: any) => {
            const trendKey = String(d.trendDirection ?? d.trend_direction ?? "").toLowerCase();
            const trendMeta = TREND_META[trendKey] ?? { label: d.trendDirection ?? d.trend_direction ?? "-", icon: "📊" };
            const avgPriceLabel = formatPriceSqm(d.avgPriceSqm ?? d.avg_price_sqm);
            const transactions = Number(d.totalTransactions ?? d.total_transactions ?? 0);
            return {
                id: d.id,
                name: d.name ?? "-",
                transactions,
                avgPriceLabel,
                trendLabel: trendMeta.label,
                trendIcon: trendMeta.icon,
                status: String(d.status ?? "active").toLowerCase() === "inactive" ? "inactive" : "active",
                detail: toDistrictDetail(d),
            } satisfies Row;
        })
        : DISTRICT_DATA.map((d) => ({
            id: undefined,
            name: d.district,
            transactions: d.transactions,
            avgPriceLabel: d.avgPrice,
            trendLabel: d.trend,
            trendIcon: DISTRICT_TREND_CONFIG[d.trend]?.icon ?? "📊",
            status: "active" as const,
            detail: {
                name: d.district,
                status: "active",
                description: d.detail.description,
                coverImageUrl: null,
                avgPriceSqm: toNumber(d.avgPrice.replace(/[^\d.]/g, "")),
                avgRentalYield: toNumber(d.detail.rentalYield.replace(/[^\d.]/g, "")),
                avgRoi: toNumber(d.detail.roi.replace(/[^\d.]/g, "")),
                apartmentsPct: null,
                villasPct: null,
                townhousesPct: null,
                totalTransactions: d.transactions,
                trendDirection: d.trend,
                marketSignal: null,
                appreciationPotential: null,
            } satisfies DistrictDetail,
        }));

    const handleView = async (row: Row) => {
        if (!row.id) { onEye(row.detail); return; }

        setViewLoadingId(row.id);
        const res = await appService.getAdminDistrictById(row.id);
        setViewLoadingId(null);

        const d = res?.data?.data;
        if (d) {
            onEye(toDistrictDetail(d, row.detail));
        } else {
            toast.error(res?.data?.message || "Failed to load district details.");
            onEye(row.detail);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.id) { setDeleteTarget(null); return; }
        const res = await appService.deleteAdminDistrictById(deleteTarget.id);
        setDeleteTarget(null);

        if (res?.data?.success || res?.status === 200 || res?.status === 204) {
            toast.success("District deleted, Status update to Inactive.");
            setRefreshKey((k) => k + 1);
        } else {
            toast.error(res?.data?.message || "Failed to delete district.");
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            {/* Section header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Data Management</h2>
                    <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                        Manage district-level market intelligence and transaction datasets.
                    </p>
                </div>
                <ModalButton className="max-w-fit px-9 py-2.5!" onClick={() => goToForm()}> ADD DISTRICT</ModalButton>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-(--db-border) rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                            <th className={thCls}>District</th>
                            <th className={thCls}>Transactions</th>
                            <th className={thCls}>Avg Price/SQM</th>
                            <th className={thCls}>Trend</th>
                            <th className={thCls}>Status</th>
                            <th className={thCls}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr
                                key={row.id ?? i}
                                className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                            >
                                <td className={`${tdCls} font-medium`}>{row.name}</td>
                                <td className={tdCls}>{row.transactions.toLocaleString()}</td>
                                <td className={tdCls}>{row.avgPriceLabel}</td>
                                <td className={tdCls}>
                                    <span className="flex items-center gap-1.5">
                                        <span>{row.trendIcon}</span>
                                        {row.trendLabel}
                                    </span>
                                </td>
                                <td className={tdCls}>
                                    {row.status === "active" ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#5E9F622E] text-[#5E9F62]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#6B72802E] text-[#6B7280]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            Inactive
                                        </span>
                                    )}
                                </td>
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
                                        <button className={actionBtnCls} title="Edit" onClick={() => goToForm(row.id)}><EditIcon /></button>
                                        <button className={actionBtnCls} title="Delete" onClick={() => setDeleteTarget(row)}><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {districts.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${page === p
                                ? "bg-[#D28A44] text-white"
                                : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            <DeleteDistrictModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />

        </div>
    );
}
