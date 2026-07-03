"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { thCls, tdCls, actionBtnCls, EyeIcon, UploadIcon } from "@/app/(admin dashboard)/constants";

const PAGE_LIMIT = 10;

const CSV_TEMPLATE_HEADERS = [
    "Asset Class",
    "Property Type",
    "Sale Application Date",
    "Property Sold Area (SQM)",
    "Land Plot Ground Area (SQM)",
    "Property Layout",
    "District",
    "Community",
    "Project Name",
    "Property Sale Price (AED)",
    "Property Sold Share",
    "Rate (AED per SQM)",
    "Sale Application Type",
    "Sale Sequence",
];

const CSV_TEMPLATE_ROWS = [
    ["residential", "apartment", "2026-05-29", "99.26", "6493.02", "1 bed", "Al Reem Island", "RT3", "Rixos Residences Al Reem Island", "2512721", "1", "25314.53758", "off-plan", "primary"],
    ["residential", "villa", "2026-04-14", "312.5", "820.4", "4 beds", "Yas Island", "Yas Acres", "Yas Acres Villas", "5450000", "1", "17440.00", "ready", "secondary"],
    ["residential", "townhouse", "2026-03-02", "220.75", "410.1", "3 beds", "Saadiyat Island", "Saadiyat Grove", "Saadiyat Grove Townhouses", "4120000", "1", "18670.65", "off-plan", "primary"],
    ["commercial", "office", "2026-02-18", "150.0", "0", "-", "Downtown Dubai", "Business Bay", "Prime Business Tower", "3200000", "1", "21333.33", "ready", "secondary"],
    ["residential", "penthouse", "2026-01-25", "410.9", "0", "5 beds", "Al Reem Island", "Shams Abu Dhabi", "Sky Tower Penthouses", "8900000", "1", "21663.42", "off-plan", "primary"],
];

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
    completed: { bg: "bg-[#5E9F622E]", color: "text-[#5E9F62]", dot: "bg-[#5E9F62]" },
    success: { bg: "bg-[#5E9F622E]", color: "text-[#5E9F62]", dot: "bg-[#5E9F62]" },
    processing: { bg: "bg-[#D28A442E]", color: "text-[#D28A44]", dot: "bg-[#D28A44]" },
    pending: { bg: "bg-[#D28A442E]", color: "text-[#D28A44]", dot: "bg-[#D28A44]" },
    failed: { bg: "bg-[#CF2D482E]", color: "text-[#CF2D48]", dot: "bg-[#CF2D48]" },
    error: { bg: "bg-[#CF2D482E]", color: "text-[#CF2D48]", dot: "bg-[#CF2D48]" },
};

function str(val: any): string {
    if (val == null || val === "") return "-";
    return String(val);
}

function num(val: any): string {
    if (val == null || val === "") return "-";
    const n = Number(val);
    return Number.isNaN(n) ? String(val) : n.toLocaleString();
}

function formatDate(t: any): string {
    if (!t) return "-";
    const parsed = new Date(t);
    if (isNaN(parsed.getTime())) return String(t);
    return parsed.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: any }) {
    const key = String(status ?? "").toLowerCase();
    const st = STATUS_STYLES[key] ?? { bg: "bg-[#D28A442E]", color: "text-[#D28A44]", dot: "bg-[#D28A44]" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${st.bg} ${st.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {str(status)}
        </span>
    );
}

type View = "list" | "detail" | "upload";

export function CsvImportLogsModal({ onClose }: { onClose: () => void }) {
    const [view, setView] = useState<View>("list");
    const [logs, setLogs] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchLogs = () => {
        setLoading(true);
        appService.getAdminCSV(page, PAGE_LIMIT).then((res) => {
            setLoading(false);
            if (res?.data?.data) {
                const d = res.data.data;
                const items = Array.isArray(d) ? d : Array.isArray(d.data) ? d.data : Array.isArray(d.items) ? d.items : [];
                setLogs(items);
                setTotalPages(Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? PAGE_LIMIT))));
            }
        });
    };

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const openDetail = (row: any) => {
        setView("detail");
        setSelectedLog(row);
        if (row.id) {
            setDetailLoading(true);
            appService.getAdminCSVById(row.id).then((res) => {
                setDetailLoading(false);
                if (res?.data?.data) setSelectedLog(res.data.data);
            });
        }
    };

    const handleFile = (fl: FileList | null) => {
        if (!fl || fl.length === 0) return;
        setFile(fl[0]);
    };

    const handleOpenTemplate = () => {
        const lines = [CSV_TEMPLATE_HEADERS, ...CSV_TEMPLATE_ROWS].map((row) => row.join(","));
        const csvContent = lines.join("\n") + "\n";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a CSV file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        const res = await appService.importAdminCSV(formData);
        setUploading(false);

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("CSV uploaded successfully.");
            setFile(null);
            setView("list");
            setPage(1);
            fetchLogs();
        } else {
            toast.error(res?.data?.message || "Failed to upload CSV.");
        }
    };

    const title = view === "upload" ? "Import CSV" : view === "detail" ? "Import Log Details" : "CSV Import Logs";

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-181.5 shadow-2xl relative flex flex-col"
                style={{ maxHeight: "92vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                {/* Sticky header */}
                <div className="sticky top-0 bg-(--db-modal-bg) rounded-t-2xl px-7 pt-7 pb-4 z-10 shrink-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {view !== "list" && (
                            <button
                                onClick={() => { setView("list"); setSelectedLog(null); }}
                                className="w-8 h-8 flex items-center justify-center rounded-sm bg-(--db-icon-btn-bg) text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white transition-colors shrink-0"
                                title="Back"
                            >
                                &#8592;
                            </button>
                        )}
                        <h2 className="text-[21px] md:text-[25px] font-medium text-(--db-text-primary)">{title}</h2>
                    </div>
                    {view === "list" && (
                        <Button variant="primary" className="py-2.5! px-6 shrink-0 mr-8" onClick={() => setView("upload")}>
                            IMPORT CSV
                        </Button>
                    )}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 pb-7 hide-scroll">

                    {view === "list" && (
                        <div className="flex flex-col gap-4">
                            <div className="overflow-hidden border border-(--db-border) rounded-md">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                                <th className={thCls}>File Name</th>
                                                <th className={thCls}>Status</th>
                                                 {/* Could be used further */}
                                                {/* <th className={thCls}>Rows Processed</th>
                                                <th className={thCls}>Rows Failed</th>
                                                <th className={thCls}>Rows Skipped</th> */}
                                                <th className={thCls}>Date</th>
                                                <th className={thCls}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.length === 0 && !loading && (
                                                <tr>
                                                    <td colSpan={7} className={`${tdCls} text-center py-8`}>
                                                        No CSV import logs found.
                                                    </td>
                                                </tr>
                                            )}
                                            {logs.map((row, i) => (
                                                <tr key={row.id ?? i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                                    <td className={`${tdCls} font-medium`}>{str(row.filename)}</td>
                                                    <td className={tdCls}><StatusBadge status={row.status} /></td>
                                                    {/* Could be used further */}
                                                    {/* <td className={tdCls}>{num(row.rowsProcessed)}</td>
                                                    <td className={tdCls}>{num(row.rowsFailed)}</td>
                                                    <td className={tdCls}>{num(row.rowsSkipped)}</td> */}
                                                    <td className={tdCls}>{formatDate(row.createdAt)}</td>
                                                    <td className={tdCls}>
                                                        <button className={actionBtnCls} title="View" onClick={() => openDetail(row)}>
                                                            <EyeIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {logs.length > 0 && (
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
                        </div>
                    )}

                    {view === "detail" && (
                        <div className="flex flex-col gap-3.25">
                            {!selectedLog ? (
                                <p className="text-sm text-(--db-text-primary) py-8 text-center">Loading details...</p>
                            ) : (
                                <>
                                    {detailLoading && (
                                        <p className="text-[13px] text-(--db-text-muted)">Refreshing details...</p>
                                    )}
                                    <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
                                        <div className="col-span-2">
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">File Name</p>
                                            <p className="text-sm font-medium text-(--db-text-primary) break-all">{str(selectedLog.filename)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Status</p>
                                            <StatusBadge status={selectedLog.status} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Rows Processed</p>
                                            <p className="text-sm font-medium text-(--db-text-primary)">{num(selectedLog.rowsProcessed)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Rows Failed</p>
                                            <p className="text-sm font-medium text-(--db-text-primary)">{num(selectedLog.rowsFailed)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Rows Skipped</p>
                                            <p className="text-sm font-medium text-(--db-text-primary)">{num(selectedLog.rowsSkipped)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Created At</p>
                                            <p className="text-sm font-medium text-(--db-text-primary)">{formatDate(selectedLog.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[13px] text-(--db-text-muted) font-normal mb-0.5">Ingested At</p>
                                            <p className="text-sm font-medium text-(--db-text-primary)">{formatDate(selectedLog.ingestedAt)}</p>
                                        </div>
                                    </div>

                                    {selectedLog.errorLog && (
                                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4">
                                            <p className="text-sm font-medium text-(--db-text-primary) mb-2.5">Error Log</p>
                                            <p className="text-[13px] text-[#CF2D48] whitespace-pre-wrap break-words max-h-50 overflow-y-auto thin-scroll">
                                                {str(selectedLog.errorLog)}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {view === "upload" && (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-(--db-text-muted)">Upload a CSV file from your computer to bulk import properties.</p>
                                <Button variant="secondary" className="shrink-0" onClick={handleOpenTemplate}>
                                    TEMPLATE CSV
                                </Button>
                            </div>
                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files); }}
                                className={`border bg-(--db-modal-field-bg) rounded-md flex items-center justify-center gap-4 p-10 cursor-pointer transition-colors ${dragOver ? "border-[#D28A44] bg-[#D28A441A]" : "border-(--db-modal-field-border) hover:border-[#D28A44]/60"}`}
                            >
                                <div className="rounded-full bg-[#D28A441F] flex items-center justify-center w-16.25 h-16.25">
                                    <UploadIcon />
                                </div>
                                {file ? (
                                    <p className="text-sm text-(--db-text-primary) font-medium text-center">{file.name}</p>
                                ) : (
                                    <div className="text-left">
                                        <p className="text-sm text-(--db-text-primary)">
                                            <span className="text-[#D28A44] font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm font-normal text-(--db-text-muted)">CSV files only</p>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handleFile(e.target.files)} />
                            </div>

                            <Button variant="primary" className="py-3! w-full max-w-full" disabled={uploading} onClick={handleUpload}>
                                {uploading ? "UPLOADING..." : "UPLOAD CSV"}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
}
