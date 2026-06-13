"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron } from "@/app/(user dashboard)/constants";

const EXPORT_SECTIONS = [
    "Price Trend Analysis",
    "ROI Performance",
    "AI Market Signals",
    "Investment Movement",
    "District Comparison",
];

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";


function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select className={selectCls}>{children}</select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SelectChevron />
                </span>
            </div>
        </div>
    );
}

export function ExportReportModal({ onClose }: { onClose: () => void }) {
    const [checked, setChecked] = useState<Set<string>>(new Set());

    const toggle = (s: string) =>
        setChecked((prev) => {
            const next = new Set(prev);
            next.has(s) ? next.delete(s) : next.add(s);
            return next;
        });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-141.5 shadow-2xl relative flex flex-col"
                style={{ maxHeight: "92vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                {/* ── Sticky header ── */}
                <div className="sticky top-0 bg-(--db-modal-bg) rounded-t-2xl px-8 pt-8 pb-5 z-10 shrink-0">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary) text-center mb-2.5">
                        Export Market Intelligence Report
                    </h2>
                    <p className="text-sm text-(--db-text-muted) text-center font-normal max-w-97.5 mx-auto">
                        Generate a branded PDF report based on the current<br />
                        analytics and selected market filters.
                    </p>
                </div>

                {/* ── Scrollable form body ── */}
                <div className="flex-1 overflow-y-auto px-7.5 py-5 space-y-5 hide-scroll">

                    <SelectField label="Report Type">
                        <option>Market Analytics Summary</option>
                        <option>District Performance Report</option>
                        <option>Investment ROI Report</option>
                        <option>Rental Yield Report</option>
                    </SelectField>

                    <SelectField label="District">
                        <option>Yas Island</option>
                        <option>Al Reem Island</option>
                        <option>Saadiyat Island</option>
                        <option>Al Khalidiyah</option>
                        <option>Corniche</option>
                        <option>Masdar City</option>
                    </SelectField>

                    <div>
                        <FieldLabel>Time Range</FieldLabel>
                        <Input
                            defaultValue="Last 30 Days"
                            className="h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-muted)! focus:border-[#D28A44]/60!"
                        />
                    </div>

                    <div>
                        <FieldLabel>Include Sections</FieldLabel>
                        <div className="flex flex-wrap gap-x-6.25 gap-y-3.75 mt-1">
                            {EXPORT_SECTIONS.map((s) => (
                                <label key={s} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={checked.has(s)}
                                        onChange={() => toggle(s)}
                                        className="w-4 h-4 rounded-sm accent-[#D28A44] cursor-pointer shrink-0"
                                    />
                                    {s}
                                </label>
                            ))}
                        </div>
                    </div>

                    <SelectField label="Property Type">
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Townhouse</option>
                        <option>Commercial</option>
                    </SelectField>

                </div>

                {/* ── Sticky footer ── */}
                <div className="sticky bottom-0 bg-(--db-modal-bg) rounded-b-2xl px-8 pb-8 pt-4 border-t border-(--db-modal-divider) shrink-0">
                    <ModalButton>GENERATE PDF REPORT</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
