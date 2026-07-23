"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { thCls, tdCls, UploadIcon } from "@/app/(admin dashboard)/constants";

const ACCEPT = ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

function str(val: any): string {
    if (val == null || val === "") return "-";
    return String(val);
}

function formatMonth(dateStr: any): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString("en-GB", { month: "short", year: "numeric" });
}

function Dropzone({
    multiple,
    onFiles,
    label,
}: {
    multiple?: boolean;
    onFiles: (files: FileList | null) => void;
    label: string;
}) {
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
            className={`border bg-(--db-modal-field-bg) rounded-md flex items-center justify-center gap-4 p-8 cursor-pointer transition-colors ${dragOver ? "border-[#D28A44] bg-[#D28A441A]" : "border-(--db-modal-field-border) hover:border-[#D28A44]/60"}`}
        >
            <div className="rounded-full bg-[#D28A441F] flex items-center justify-center w-14 h-14 shrink-0">
                <UploadIcon />
            </div>
            <div className="text-left">
                <p className="text-sm text-(--db-text-primary)">
                    <span className="text-[#D28A44] font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm font-normal text-(--db-text-muted)">{label}</p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                multiple={multiple}
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
            />
        </div>
    );
}

function ConfirmRecomputeModal({ onClose, onConfirm, loading }: { onClose: () => void; onConfirm: () => void; loading: boolean }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose, loading]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={() => !loading && onClose()}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-md shadow-2xl p-7 flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-[19px] font-medium text-(--db-text-primary)">Recompute Financial Metrics</h2>
                <p className="text-sm text-(--db-text-muted)">
                    This will update rental yield, ROI, and cap rate for all properties using the latest rental data. This takes 10–60 seconds.
                </p>
                <div className="flex items-center justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>CANCEL</Button>
                    <Button variant="primary" onClick={onConfirm} disabled={loading}>
                        {loading ? "RECOMPUTING..." : "CONFIRM"}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function RentalIngestionManagement() {
    const [indexFile, setIndexFile] = useState<File | null>(null);
    const [indexUploading, setIndexUploading] = useState(false);

    const [rentalFiles, setRentalFiles] = useState<File[]>([]);
    const [bulkUploading, setBulkUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);

    const [coverage, setCoverage] = useState<any[]>([]);
    const [coverageLoading, setCoverageLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [recomputing, setRecomputing] = useState(false);

    const [indexCooldown, setIndexCooldown] = useState(false);
    const [bulkCooldown, setBulkCooldown] = useState(false);
    const [recomputeCooldown, setRecomputeCooldown] = useState(false);

    const cooldownTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    useEffect(() => () => cooldownTimers.current.forEach(clearTimeout), []);

    const startCooldown = (setCooldown: (v: boolean) => void) => {
        setCooldown(true);
        cooldownTimers.current.push(setTimeout(() => setCooldown(false), 15000));
    };

    const fetchCoverage = () => {
        setCoverageLoading(true);
        appService.getRentalCoverage().then((res) => {
            setCoverageLoading(false);
            const d = res?.data?.data;
            if (Array.isArray(d)) setCoverage(d);
        });
    };

    useEffect(() => {
        fetchCoverage();
    }, []);

    const handleIndexUpload = async () => {
        if (indexCooldown) {
            toast.error("Please try again after 15 seconds.");
            return;
        }
        if (!indexFile) {
            toast.error("Please select an index file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", indexFile);

        setIndexUploading(true);
        const res = await appService.uploadRentalIndexFile(formData);
        setIndexUploading(false);

        const rowsUpserted = res?.data?.data?.rowsUpserted;
        if ((res?.data?.success || res?.status === 200) && rowsUpserted > 0) {
            toast.success(`${rowsUpserted} rows loaded from index file.`);
            setIndexFile(null);
            startCooldown(setIndexCooldown);
            fetchCoverage();
        } else if ((res?.data?.success || res?.status === 200) && !rowsUpserted) {
            toast.error("No data found in file.");
        } else {
            toast.error(res?.data?.message || "Failed to upload index file.");
        }
    };

    const handleBulkUpload = async () => {
        if (bulkCooldown) {
            toast.error("Please try again after 15 seconds.");
            return;
        }
        if (rentalFiles.length === 0) {
            toast.error("Please select at least one rental file to upload.");
            return;
        }
        const formData = new FormData();
        rentalFiles.forEach((f) => formData.append("files", f));

        setBulkUploading(true);
        const res = await appService.uploadRentalFiles(formData);
        setBulkUploading(false);

        if (res?.data?.success || res?.status === 200) {
            const data = res?.data?.data;
            setUploadResult(data);
            toast.success(`${data?.filesProcessed ?? 0} file(s) processed successfully.`);
            if (data?.filesSkipped > 0) {
                toast.error(`${data.filesSkipped} file(s) had no usable data and were skipped. Check that annual_rent_aed and district columns are populated.`);
            }
            setRentalFiles([]);
            startCooldown(setBulkCooldown);
            fetchCoverage();
        } else {
            toast.error(res?.data?.message || "Failed to upload rental files.");
        }
    };

    const openRecomputeConfirm = () => {
        if (recomputeCooldown) {
            toast.error("Please try again after 15 seconds.");
            return;
        }
        setConfirmOpen(true);
    };

    const handleRecompute = async () => {
        setRecomputing(true);
        const res = await appService.triggerAnalyticsComputation();
        setRecomputing(false);

        if (res?.data?.success || res?.status === 200) {
            const data = res?.data?.data;
            toast.success(`Recomputed metrics for ${data?.propertiesComputed ?? 0} properties in ${data?.duration ?? "-"}.`);
            setConfirmOpen(false);
            startCooldown(setRecomputeCooldown);
        } else {
            toast.error(res?.data?.message || "Failed to trigger recomputation.");
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            {/* Section header */}
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Rental Ingestion</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    Upload ADREC rental exports, track district coverage, then recompute financial metrics — index first, then bulk rental files, then recompute.
                </p>
            </div>

            {/* Index upload */}
            <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-(--db-text-primary)">Rent Price Index</p>
                <Dropzone
                    label={indexFile ? indexFile.name : "Excel file only (.xlsx, .xls)"}
                    onFiles={(fl) => fl && fl.length > 0 && setIndexFile(fl[0])}
                />
                <Button
                    variant="primary"
                    className={`py-2.5! w-full max-w-full transition-[filter] ${indexCooldown ? "blur-[1.5px]" : ""}`}
                    disabled={indexUploading}
                    onClick={handleIndexUpload}
                >
                    {indexUploading ? "UPLOADING..." : indexCooldown ? "PLEASE WAIT..." : "UPLOAD INDEX"}
                </Button>
            </div>

            {/* Bulk upload */}
            <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-(--db-text-primary)">Bulk Rental Price Files</p>
                <Dropzone
                    multiple
                    label={rentalFiles.length > 0 ? `${rentalFiles.length} file(s) selected` : "Up to 200 Excel files (.xlsx, .xls)"}
                    onFiles={(fl) => fl && setRentalFiles(Array.from(fl))}
                />
                {rentalFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {rentalFiles.map((f, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-sm bg-[#D28A442E] text-[#D28A44]">{f.name}</span>
                        ))}
                    </div>
                )}
                <Button
                    variant="primary"
                    className={`py-2.5! w-full max-w-full transition-[filter] ${bulkCooldown ? "blur-[1.5px]" : ""}`}
                    disabled={bulkUploading}
                    onClick={handleBulkUpload}
                >
                    {bulkUploading ? "UPLOADING..." : bulkCooldown ? "PLEASE WAIT..." : "UPLOAD RENTAL FILES"}
                </Button>

                {uploadResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-(--db-border)">
                        <div>
                            <p className="text-[13px] text-(--db-text-muted)">Files processed</p>
                            <p className="text-sm font-medium text-(--db-text-primary)">{str(uploadResult.filesProcessed)}</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-(--db-text-muted)">Rows inserted</p>
                            <p className="text-sm font-medium text-(--db-text-primary)">{str(uploadResult.rowsInserted)}</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-(--db-text-muted)">Rows updated</p>
                            <p className="text-sm font-medium text-(--db-text-primary)">{str(uploadResult.rowsUpdated)}</p>
                        </div>
                        <div>
                            <p className="text-[13px] text-(--db-text-muted)">Duration</p>
                            <p className="text-sm font-medium text-(--db-text-primary)">{str(uploadResult.duration)}</p>
                        </div>
                        {Array.isArray(uploadResult.districtsCovered) && uploadResult.districtsCovered.length > 0 && (
                            <div className="col-span-2 sm:col-span-4">
                                <p className="text-[13px] text-(--db-text-muted) mb-1">Districts covered</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {uploadResult.districtsCovered.map((d: string, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-sm bg-[#5E9F622E] text-[#5E9F62]">{d}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Coverage table */}
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-(--db-text-primary)">Coverage Report</p>
                <div className="overflow-x-auto border border-(--db-border) rounded-md">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                <th className={thCls}>District</th>
                                <th className={thCls}>Property Type</th>
                                <th className={thCls}>Layout</th>
                                <th className={thCls}>Date Range</th>
                                <th className={thCls}>Data Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coverage.length === 0 && !coverageLoading && (
                                <tr>
                                    <td colSpan={5} className={`${tdCls} text-center py-8`}>
                                        No rental data ingested yet — upload files above.
                                    </td>
                                </tr>
                            )}
                            {coverage.map((row, i) => (
                                <tr key={i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                    <td className={`${tdCls} font-medium capitalize`}>{str(row.district)}</td>
                                    <td className={`${tdCls} capitalize`}>{str(row.propertyType)}</td>
                                    <td className={`${tdCls} capitalize`}>{str(row.layout)}</td>
                                    <td className={tdCls}>{formatMonth(row.fromDate)} – {formatMonth(row.toDate)}</td>
                                    <td className={tdCls}>
                                        <span className="inline-flex items-center gap-1.5">
                                            {row.dataPoints}
                                            {row.dataPoints < 3 && (
                                                <span className="text-xs px-1.5 py-0.5 rounded-sm bg-[#E09A4A2E] text-[#E09A4A]">low confidence</span>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recompute */}
            <div className="flex items-center justify-between gap-4 bg-(--db-warm-card-bg) rounded-[10px] p-4">
                <p className="text-[13px] text-(--db-text-primary)">
                    After ingesting rental data, recompute rental yield, ROI, and cap rate for all properties.
                </p>
                <Button
                    variant="navy"
                    className={`shrink-0 transition-[filter] ${recomputeCooldown ? "blur-[1.5px]" : ""}`}
                    onClick={openRecomputeConfirm}
                >
                    {recomputeCooldown ? "PLEASE WAIT..." : "RECOMPUTE FINANCIAL METRICS"}
                </Button>
            </div>

            {confirmOpen && (
                <ConfirmRecomputeModal
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleRecompute}
                    loading={recomputing}
                />
            )}
        </div>
    );
}
