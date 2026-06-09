"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";

const EXPORT_SECTIONS = [
    "Price Trend Analysis",
    "ROI Performance",
    "AI Market Signals",
    "Investment Movement",
    "District Comparison",
];

const selectCls = "w-full bg-[#FEF5EC] border border-[#EAD5B8] text-[#0B1F3A] rounded-md px-4 py-3 text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";

function SelectChevron() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#D28A44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-semibold text-[#D28A44] mb-1.5">{children}</label>;
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
                className="bg-white rounded-[10px] w-full max-w-141.5 shadow-2xl relative flex flex-col"
                style={{ maxHeight: "92vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20"
                >
                    <img src="/close.svg" alt="" />
                </button>

                {/* ── Sticky header ── */}
                <div className="sticky top-0 bg-white rounded-t-2xl px-8 pt-8 pb-5 border-b border-[#F0E8DF] z-10 shrink-0">
                    <h2 className="text-[22px] font-bold text-[#0B1F3A] text-center mb-1.5">
                        Export Market Intelligence Report
                    </h2>
                    <p className="text-sm text-[#0B1F3A]/55 text-center leading-relaxed">
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
                            className="h-auto! bg-[#FEF5EC]! border-[#EAD5B8]! text-[#0B1F3A]! rounded-md! placeholder-[#0B1F3A]/40! focus:border-[#D28A44]/60!"
                        />
                    </div>

                    <div>
                        <FieldLabel>Include Sections</FieldLabel>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-3 mt-1">
                            {EXPORT_SECTIONS.map((s) => (
                                <label key={s} className="flex items-center gap-2 text-xs text-[#0B1F3A] cursor-pointer select-none">
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
                <div className="sticky bottom-0 bg-white rounded-b-2xl px-8 pb-8 pt-4 border-t border-[#F0E8DF] shrink-0">
                    <button className="w-full bg-[#0B1F3A] text-white text-sm font-bold py-4 rounded-md tracking-widest hover:bg-[#0D2444] transition-colors">
                        GENERATE PDF REPORT
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
