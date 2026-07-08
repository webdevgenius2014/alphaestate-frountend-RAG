"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";

const SALE_TYPE_OPTIONS = ["off-plan", "ready", "court-mandated"];

function formatSaleTypeLabel(value: string): string {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const EXT_BY_MIME: Record<string, string> = {
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/pdf": "pdf",
};

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";


function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

function SelectField({
    label,
    value,
    onChange,
    children,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select className={selectCls} value={value} onChange={(e) => onChange(e.target.value)}>
                    {children}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SelectChevron />
                </span>
            </div>
        </div>
    );
}

export function ExportReportModal({ onClose }: { onClose: () => void }) {
    const [district, setDistrict] = useState("Yas Island");
    const [propertyType, setPropertyType] = useState("Apartment");
    const [saleType, setSaleType] = useState(SALE_TYPE_OPTIONS[0]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        const res = await appService.exportAnalyticsReport({
            district,
            propertyType,
            saleType,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
            limit: 1000,
        });
        setExporting(false);

        if (!res?.data || res.status >= 400) {
            toast.error("Failed to export report.");
            return;
        }

        const contentType = res.headers?.["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const disposition: string = res.headers?.["content-disposition"] || "";
        const nameMatch = disposition.match(/filename="?([^"; ]+)"?/i);
        const ext = EXT_BY_MIME[contentType.split(";")[0].trim()] || "xlsx";
        const filename = nameMatch?.[1] || `market-intelligence-report.${ext}`;

        const blob = new Blob([res.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Report exported successfully.");
        onClose();
    };

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
                        Generate an Excel report based on the current<br />
                        analytics and selected market filters.
                    </p>
                </div>

                {/* ── Scrollable form body ── */}
                <div className="flex-1 overflow-y-auto px-7.5 py-5 space-y-5 hide-scroll">

                    <SelectField label="District" value={district} onChange={setDistrict}>
                        <option>Yas Island</option>
                        <option>Al Reem Island</option>
                        <option>Saadiyat Island</option>
                        <option>Al Khalidiyah</option>
                        <option>Corniche</option>
                        <option>Masdar City</option>
                    </SelectField>

                    <SelectField label="Property Type" value={propertyType} onChange={setPropertyType}>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Townhouse</option>
                        <option>Commercial</option>
                    </SelectField>

                    <SelectField label="Sale Type" value={saleType} onChange={setSaleType}>
                        {SALE_TYPE_OPTIONS.map((s) => (
                            <option key={s} value={s}>{formatSaleTypeLabel(s)}</option>
                        ))}
                    </SelectField>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel>Date From</FieldLabel>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-muted)! focus:border-[#D28A44]/60!"
                            />
                        </div>
                        <div>
                            <FieldLabel>Date To</FieldLabel>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-muted)! focus:border-[#D28A44]/60!"
                            />
                        </div>
                    </div>

                </div>

                {/* ── Sticky footer ── */}
                <div className="sticky bottom-0 bg-(--db-modal-bg) rounded-b-2xl px-8 pb-8 pt-4 border-t border-(--db-modal-divider) shrink-0">
                    <ModalButton onClick={handleExport} disabled={exporting}>
                        {exporting ? "EXPORTING..." : "EXPORT REPORT (EXCEL)"}
                    </ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
