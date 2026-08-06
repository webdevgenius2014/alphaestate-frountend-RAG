"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export type CompareRow = {
    id: string;
    name: string;
    district: string;
    area: string;
    price: string;
    roi: string;
    rentalYield: string;
    appreciation: string;
    aiScore: string;
    signal: string;
};

const thCls = "px-5.5 py-3 whitespace-nowrap";
const tdCls = "px-5 py-3.5 font-medium";

export function ComparePropertiesModal({ rows, onClose }: { rows: CompareRow[]; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-5xl shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 md:px-9.5 pt-7 md:pt-9.5 pb-7">
                    <div className="mb-6">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary)">Property Comparison</h2>
                        <p className="text-sm text-(--db-text-primary) opacity-60 mt-0.5">
                            Side-by-side comparison of your selected properties.
                        </p>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto border border-(--db-border) rounded-md">
                        <table className="w-full min-w-150 text-sm">
                            <thead className="sticky top-0">
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-sm font-semibold text-(--db-text-primary)">
                                    <th className={`${thCls} w-45`}>Project Name</th>
                                    <th className={thCls}>District</th>
                                    <th className={thCls}>Area</th>
                                    <th className={thCls}>Price</th>
                                    <th className={thCls}>ROI</th>
                                    <th className={thCls}>Rental Yield</th>
                                    <th className={thCls}>Appreciation</th>
                                    <th className={thCls}>AI Score</th>
                                    <th className={thCls}>Investment Signal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b divide-x divide-(--db-border) text-(--db-text-primary) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className={`${tdCls} whitespace-nowrap`}>{row.name}</td>
                                        <td className={tdCls}>{row.district}</td>
                                        <td className={tdCls}>{row.area}</td>
                                        <td className={tdCls}>{row.price}</td>
                                        <td className={tdCls}>{row.roi}</td>
                                        <td className={tdCls}>{row.rentalYield}</td>
                                        <td className={tdCls}>{row.appreciation}</td>
                                        <td className={tdCls}>{row.aiScore}</td>
                                        <td className={tdCls}>{row.signal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
