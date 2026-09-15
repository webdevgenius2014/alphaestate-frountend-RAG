"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { DistrictDetail } from "@/app/(admin dashboard)/constants";

interface Props {
    record: DistrictDetail;
    onClose: () => void;
}

const TREND_META: Record<string, { label: string; icon: string }> = {
    rising: { label: "Rising", icon: "📈" },
    stable: { label: "Stable", icon: "📊" },
    declining: { label: "Declining", icon: "📉" },
};

function formatPriceSqm(v: number | null): string {
    if (v == null) return "-";
    return `AED ${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })} / sqm`;
}

function formatPct(v: number | null): string {
    if (v == null) return "-";
    return `${Number(v).toFixed(1)}%`;
}

function capitalize(s: string | null): string {
    if (!s) return "-";
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function DistrictDetailDrawer({ record, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        setMounted(true);
        const id = setTimeout(() => setVisible(true), 16);
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setVisible(false); setTimeout(onClose, 300); }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            clearTimeout(id);
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    if (!mounted) return null;

    const trendKey = String(record.trendDirection ?? "").toLowerCase();
    const trendMeta = TREND_META[trendKey] ?? { label: capitalize(record.trendDirection), icon: "📊" };
    const isActive = String(record.status ?? "").toLowerCase() !== "inactive";

    return createPortal(
        <div className="fixed inset-0 z-9999">
            {/* Full-screen backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-80" : "opacity-0"}`}
                onClick={handleClose}
            />

            {/* Drawer panel */}
            <div className={`absolute right-0 top-0 bottom-0 w-full max-w-121.25 bg-(--db-modal-bg) flex flex-col shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}>

                <div className="flex items-center justify-between px-5 pt-6 pb-4.5">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary)">District Detail</h2>
                    <button onClick={handleClose} className="absolute top-4 right-4 z-20">
                        <img src="/close.svg" alt="" />
                    </button>
                </div>

                <div className="overflow-y-auto thin-scroll">

                    <div className="w-full h-63.25 bg-(--db-sidebar-bg) px-5 rounded-md shrink-0 overflow-hidden">
                        <img src={record.coverImageUrl || "/property-1.png"} alt={record.name} className="w-full h-full object-cover rounded-md" />
                    </div>

                    <div className="flex flex-col gap-3.25 px-5 py-5">

                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[19px] font-medium text-(--db-text-primary)">{record.name}</h3>
                            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${isActive ? "bg-[#5E9F622E] text-[#5E9F62]" : "bg-[#6B72802E] text-[#6B7280]"}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* Description */}
                        {record.description && (
                            <div>
                                <p className="text-lg font-medium text-(--db-text-primary) mb-1">Description</p>
                                <p className="text-sm text-(--db-text-primary) leading-6 font-normal">{record.description}</p>
                            </div>
                        )}

                        {/* Avg price/sqm */}
                        <p className="text-base font-medium text-[#D28A44]">{formatPriceSqm(record.avgPriceSqm)}</p>

                        {/* Stats card */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Total Transactions</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.totalTransactions.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Trend</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary) flex items-center gap-1.5">
                                    <span>{trendMeta.icon}</span>{trendMeta.label}
                                </p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Avg ROI</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.avgRoi)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Rental Yield</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.avgRentalYield)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Market Signal</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{capitalize(record.marketSignal)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Appreciation Potential</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{capitalize(record.appreciationPotential)}</p>
                            </div>
                        </div>

                        {/* Property mix */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4">
                            <p className="text-lg font-medium text-(--db-text-primary) mb-3">Property Mix</p>
                            <div className="grid grid-cols-3 gap-x-6 gap-y-2.5">
                                <div>
                                    <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Apartments</p>
                                    <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.apartmentsPct)}</p>
                                </div>
                                <div>
                                    <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Villas</p>
                                    <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.villasPct)}</p>
                                </div>
                                <div>
                                    <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Townhouses</p>
                                    <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.townhousesPct)}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
