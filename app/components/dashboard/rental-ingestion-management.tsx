"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { thCls, tdCls, UploadIcon } from "@/app/(admin dashboard)/constants";

const EXCEL_ACCEPT = ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
const CSV_ACCEPT = ".csv,text/csv";
const EXCEL_EXT = /\.(xlsx|xls)$/i;
const CSV_EXT = /\.csv$/i;

const INDEX_COLUMNS = ["Date", "Property Type", "Index Value", "Municipality", "Zone", "App Type"];
const RENTAL_COLUMNS = ["Date", "Average of rolling_average", "Property Type", "Municipality", "District", "Property Layout"];
const RENTAL_SHEET_NAME = "Resi Rent Prices By Period";
const SALES_COLUMNS = [
    "Transaction Date", "District", "Community", "Project", "Property Type", "Rooms", "Area (SQM)",
    "Sale Price (AED)", "Price/SQM", "Sale Type", "Transaction Type", "Asset Class", "Plot Area (SQM)", "Share",
];

const COVERAGE_LIMIT = 20;
const SALES_POLL_MS = 5000;
const SALES_DONE_STATUSES = ["completed", "success", "failed", "error"];

const STATUS_STYLES: Record<string, string> = {
    completed: "bg-[#5E9F622E] text-[#5E9F62]",
    success: "bg-[#5E9F622E] text-[#5E9F62]",
    processing: "bg-[#D28A442E] text-[#D28A44]",
    pending: "bg-[#D28A442E] text-[#D28A44]",
    queued: "bg-[#D28A442E] text-[#D28A44]",
    failed: "bg-[#CF2D482E] text-[#CF2D48]",
    error: "bg-[#CF2D482E] text-[#CF2D48]",
};

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

type ApiRes = { status?: number; data?: { success?: boolean; message?: string; error?: string; data?: unknown } } | undefined;
type IndexResult = { rowsUpserted?: number };
type RentalResult = { filesProcessed?: number; filesSkipped?: number; rowsInserted?: number; rowsUpdated?: number; districtsCovered?: string[]; duration?: string };
type SalesLog = { id?: string; filename?: string; status?: string; rowsProcessed?: number; rowsSkipped?: number; rowsFailed?: number };
type RecomputeResult = { propertiesComputed?: number; duration?: string };
type DistrictsResult = { districtsProcessed?: number; duration?: string };

function isOk(res: ApiRes) {
    return Boolean(res?.data?.success) || res?.status === 200 || res?.status === 201;
}

function errorMessage(res: ApiRes, fallback: string): string {
    if (res?.status === 401) return "Your admin session has expired. Please log in again.";
    const msg = res?.data?.message || res?.data?.error || "";
    if (/only \.xlsx and \.xls/i.test(msg)) return "Only .xlsx and .xls files are accepted for this upload.";
    if (/unexpected field/i.test(msg)) return "Upload field name mismatch — please contact the backend team.";
    return msg || fallback;
}

function Dropzone({
    multiple,
    accept,
    onFiles,
    label,
}: {
    multiple?: boolean;
    accept: string;
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
                <p className="text-sm font-normal text-(--db-text-muted) break-all">{label}</p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }}
            />
        </div>
    );
}

function StepCard({ step, title, source, children }: { step: number; title: string; source?: string; children: ReactNode }) {
    return (
        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D28A44] text-white text-xs font-semibold flex items-center justify-center shrink-0">{step}</span>
                <div>
                    <p className="text-sm font-medium text-(--db-text-primary)">{title}</p>
                    {source && <p className="text-xs text-(--db-text-muted) mt-0.5">Source: {source}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

function ColumnHint({ columns, note }: { columns: string[]; note?: ReactNode }) {
    return (
        <div className="text-xs text-(--db-text-muted)">
            <span className="font-medium text-(--db-text-primary)">Required columns: </span>
            {columns.join(", ")}
            {note && <p className="mt-1">{note}</p>}
        </div>
    );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div>
            <p className="text-[13px] text-(--db-text-muted)">{label}</p>
            <p className="text-sm font-medium text-(--db-text-primary)">{value}</p>
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
                    This recomputes ROI, rental yield, cap rate and AI score for all properties using the latest uploaded data. It takes 2–3 minutes — keep this page open until it finishes.
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
    const [indexResult, setIndexResult] = useState<IndexResult | null>(null);

    const [rentalFiles, setRentalFiles] = useState<File[]>([]);
    const [bulkUploading, setBulkUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<RentalResult | null>(null);

    const [salesFile, setSalesFile] = useState<File | null>(null);
    const [salesUploading, setSalesUploading] = useState(false);
    const [salesLog, setSalesLog] = useState<SalesLog | null>(null);

    const [coverage, setCoverage] = useState<any[]>([]);
    const [coverageLoading, setCoverageLoading] = useState(false);
    const [coveragePage, setCoveragePage] = useState(1);
    const [coverageTotal, setCoverageTotal] = useState(0);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [recomputing, setRecomputing] = useState(false);
    const [recomputeResult, setRecomputeResult] = useState<RecomputeResult | null>(null);

    const [districtsRecomputing, setDistrictsRecomputing] = useState(false);
    const [districtsResult, setDistrictsResult] = useState<DistrictsResult | null>(null);

    const [indexCooldown, setIndexCooldown] = useState(false);
    const [bulkCooldown, setBulkCooldown] = useState(false);
    const [salesCooldown, setSalesCooldown] = useState(false);
    const [recomputeCooldown, setRecomputeCooldown] = useState(false);
    const [districtsCooldown, setDistrictsCooldown] = useState(false);

    const cooldownTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const salesPollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => () => {
        cooldownTimers.current.forEach(clearTimeout);
        if (salesPollTimer.current) clearTimeout(salesPollTimer.current);
    }, []);

    const startCooldown = (setCooldown: (v: boolean) => void) => {
        setCooldown(true);
        cooldownTimers.current.push(setTimeout(() => setCooldown(false), 15000));
    };

    const fetchCoverage = (page: number) => {
        setCoverageLoading(true);
        appService.getRentalCoverage(page, COVERAGE_LIMIT).then((res) => {
            setCoverageLoading(false);
            const d = res?.data?.data;
            const items = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.data) ? d.data : [];
            setCoverage(items);
            setCoverageTotal(Number(d?.total ?? items.length) || 0);
        });
    };

    useEffect(() => {
        fetchCoverage(coveragePage);
    }, [coveragePage]);

    const refreshCoverage = () => {
        if (coveragePage === 1) fetchCoverage(1);
        else setCoveragePage(1);
    };

    const coverageTotalPages = Math.max(1, Math.ceil(coverageTotal / COVERAGE_LIMIT));
    const coverageWindowStart = Math.max(1, Math.min(coveragePage - 2, coverageTotalPages - 4));
    const coveragePages = Array.from(
        { length: Math.min(5, coverageTotalPages - coverageWindowStart + 1) },
        (_, i) => coverageWindowStart + i
    );

    // Step 1: Rental Price Index
    const pickIndexFile = (fl: FileList | null) => {
        const f = fl?.[0];
        if (!f) return;
        if (!EXCEL_EXT.test(f.name)) {
            toast.error("Rental Price Index must be an Excel file (.xlsx or .xls).");
            return;
        }
        setIndexFile(f);
    };

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
        if (isOk(res) && rowsUpserted > 0) {
            toast.success(`${rowsUpserted} rows loaded from index file.`);
            setIndexResult(res.data.data);
            setIndexFile(null);
            startCooldown(setIndexCooldown);
            refreshCoverage();
        } else if (isOk(res)) {
            toast.error("No data found in file — check the column names match the expected format.");
        } else {
            toast.error(errorMessage(res, "Failed to upload index file."));
        }
    };

    // Step 2: Rental Prices
    const pickRentalFiles = (fl: FileList | null) => {
        if (!fl || fl.length === 0) return;
        const all = Array.from(fl);
        const valid = all.filter((f) => EXCEL_EXT.test(f.name));
        if (valid.length < all.length) {
            toast.error(`${all.length - valid.length} file(s) ignored — only .xlsx and .xls files are accepted.`);
        }
        if (valid.length > 0) setRentalFiles(valid);
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

        if (isOk(res)) {
            const data = res?.data?.data;
            setUploadResult(data);
            if (data?.filesSkipped > 0 && !data?.rowsInserted && !data?.rowsUpdated) {
                toast.error(`File format not recognised — check the sheet is named "${RENTAL_SHEET_NAME}" and the column names match.`);
            } else {
                toast.success(`${data?.filesProcessed ?? 0} file(s) processed successfully.`);
                if (data?.filesSkipped > 0) {
                    toast.error(`${data.filesSkipped} file(s) were skipped — check the sheet name and column names.`);
                }
            }
            setRentalFiles([]);
            startCooldown(setBulkCooldown);
            refreshCoverage();
        } else {
            toast.error(errorMessage(res, "Failed to upload rental files."));
        }
    };

    // Step 3: Sales Transactions
    const pickSalesFile = (fl: FileList | null) => {
        const f = fl?.[0];
        if (!f) return;
        if (!CSV_EXT.test(f.name)) {
            toast.error("Sales transactions must be a .csv file.");
            return;
        }
        setSalesFile(f);
    };

    const pollSalesLog = (logId: string) => {
        if (salesPollTimer.current) clearTimeout(salesPollTimer.current);
        salesPollTimer.current = setTimeout(async () => {
            const res = await appService.getAdminCSVById(logId);
            const log = res?.data?.data;
            if (!log) return;
            setSalesLog(log);
            const status = String(log.status ?? "").toLowerCase();
            if (!SALES_DONE_STATUSES.includes(status)) {
                pollSalesLog(logId);
            } else if (status === "failed" || status === "error") {
                toast.error("Sales transactions import failed — see the import log for details.");
            } else {
                toast.success(`Sales import finished: ${log.rowsProcessed ?? 0} rows processed.`);
            }
        }, SALES_POLL_MS);
    };

    const handleSalesUpload = async () => {
        if (salesCooldown) {
            toast.error("Please try again after 15 seconds.");
            return;
        }
        if (!salesFile) {
            toast.error("Please select a sales transactions CSV to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", salesFile);

        setSalesUploading(true);
        const res = await appService.importAdminCSV(formData);
        setSalesUploading(false);

        if (isOk(res)) {
            const logId = res?.data?.data?.logId;
            toast.success(res?.data?.data?.message ?? "Ingestion job queued successfully.");
            setSalesLog({ id: logId, filename: salesFile.name, status: "queued" });
            setSalesFile(null);
            startCooldown(setSalesCooldown);
            if (logId) pollSalesLog(logId);
        } else {
            toast.error(errorMessage(res, "Failed to upload sales transactions."));
        }
    };

    // Step 4: Recompute Financial Metrics
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

        if (isOk(res)) {
            const data = res?.data?.data;
            setRecomputeResult(data);
            toast.success(`Recomputed metrics for ${data?.propertiesComputed ?? 0} properties in ${data?.duration ?? "-"}.`);
            setConfirmOpen(false);
            startCooldown(setRecomputeCooldown);
        } else {
            toast.error(errorMessage(res, "Failed to trigger recomputation."));
        }
    };

    // Step 5: Recompute Districts
    const handleRecomputeDistricts = async () => {
        if (districtsCooldown) {
            toast.error("Please try again after 15 seconds.");
            return;
        }
        setDistrictsRecomputing(true);
        const res = await appService.recomputeDistricts();
        setDistrictsRecomputing(false);

        if (isOk(res)) {
            const data = res?.data?.data;
            setDistrictsResult(data);
            toast.success(`Recomputed ${data?.districtsProcessed ?? 0} districts in ${data?.duration ?? "-"}.`);
            startCooldown(setDistrictsCooldown);
        } else {
            toast.error(errorMessage(res, "Failed to recompute districts."));
        }
    };

    const salesStatus = String(salesLog?.status ?? "").toLowerCase();

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            {/* Section header */}
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Data Ingestion &amp; Recompute</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                    After receiving new ADREC data, always follow this order : Rental Price Index → Rental Prices → Sales Transactions → Recompute Financial Metrics → Recompute Districts.
                </p>
            </div>

            {/* Step 1: Index upload */}
            <StepCard step={1} title="Rental Price Index" source="ADREC → Price Indices → Residential Rental Price Indices → Export">
               {/* could be used further */}
                {/* <ColumnHint columns={INDEX_COLUMNS} note="Index Value is based on 100 = Jan 2020. App Type is All Rents or New Rents." /> */}
                <Dropzone
                    accept={EXCEL_ACCEPT}
                    label={indexFile ? indexFile.name : "Excel file only (.xlsx, .xls) — e.g. adrec_rent_price_index_ALL.xlsx"}
                    onFiles={pickIndexFile}
                />
                <Button
                    variant="primary"
                    className={`py-2.5! w-full max-w-full transition-[filter] ${indexCooldown ? "blur-[1.5px]" : ""}`}
                    disabled={indexUploading}
                    onClick={handleIndexUpload}
                >
                    {indexUploading ? "UPLOADING..." : indexCooldown ? "PLEASE WAIT..." : "UPLOAD INDEX"}
                </Button>
                {indexResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-(--db-border)">
                        <Stat label="Rows upserted" value={str(indexResult.rowsUpserted)} />
                    </div>
                )}
            </StepCard>

            {/* Step 2: Rental prices */}
            <StepCard step={2} title="Rental Prices" source="ADREC → Leasing Contracts → Average Rents Per Year → Export">
                 {/* could be used further */}
                {/* <ColumnHint
                    columns={RENTAL_COLUMNS}
                    note={<>Sheet must be named <b className="text-(--db-text-primary)">{RENTAL_SHEET_NAME}</b>. One file with all districts is recommended; individual district files also work.</>}
                /> */}
                <Dropzone
                    multiple
                    accept={EXCEL_ACCEPT}
                    label={rentalFiles.length > 0 ? `${rentalFiles.length} file(s) selected` : "Excel files only (.xlsx, .xls) — e.g. adrec_average_annual_rents_quarterly_ALL.xlsx"}
                    onFiles={pickRentalFiles}
                />
                {rentalFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {rentalFiles.map((f, i) => (
                            <span key={`${f.name}-${i}`} className="text-xs px-2 py-1 rounded-sm bg-[#D28A442E] text-[#D28A44]">{f.name}</span>
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
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-(--db-border)">
                        <Stat label="Files processed" value={str(uploadResult.filesProcessed)} />
                        <Stat label="Files skipped" value={str(uploadResult.filesSkipped)} />
                        <Stat label="Rows inserted" value={str(uploadResult.rowsInserted)} />
                        <Stat label="Rows updated" value={str(uploadResult.rowsUpdated)} />
                        <Stat label="Duration" value={str(uploadResult.duration)} />
                        {Array.isArray(uploadResult.districtsCovered) && uploadResult.districtsCovered.length > 0 && (
                            <div className="col-span-2 sm:col-span-5">
                                <p className="text-[13px] text-(--db-text-muted) mb-1">Districts covered ({uploadResult.districtsCovered.length})</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {uploadResult.districtsCovered.map((d: string, i: number) => (
                                        <span key={`${d}-${i}`} className="text-xs px-2 py-1 rounded-sm bg-[#5E9F622E] text-[#5E9F62] capitalize">{d}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </StepCard>

            {/* Step 3: Sales transactions */}
            <StepCard step={3} title="Sales Transactions" source="ADREC → Transactions → Latest Sales → Export">
                 {/* could be used further */}
                {/* <ColumnHint columns={SALES_COLUMNS} note="Dates as YYYY-MM-DD. Large files are processed in the background — progress is tracked below." /> */}
                <Dropzone
                    accept={CSV_ACCEPT}
                    label={salesFile ? salesFile.name : "CSV file only (.csv) — e.g. transactions_YYYY-MM-DD.csv"}
                    onFiles={pickSalesFile}
                />
                <Button
                    variant="primary"
                    className={`py-2.5! w-full max-w-full transition-[filter] ${salesCooldown ? "blur-[1.5px]" : ""}`}
                    disabled={salesUploading}
                    onClick={handleSalesUpload}
                >
                    {salesUploading ? "UPLOADING..." : salesCooldown ? "PLEASE WAIT..." : "UPLOAD SALES TRANSACTIONS"}
                </Button>
                {salesLog && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-(--db-border)">
                        <Stat label="File" value={<span className="break-all">{str(salesLog.filename)}</span>} />
                        <Stat
                            label="Status"
                            value={
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium capitalize ${STATUS_STYLES[salesStatus] ?? STATUS_STYLES.processing}`}>
                                    {salesStatus || "processing"}
                                </span>
                            }
                        />
                        <Stat label="Rows processed" value={str(salesLog.rowsProcessed)} />
                        <Stat label="Rows skipped" value={str(salesLog.rowsSkipped)} />
                        <Stat label="Rows failed" value={str(salesLog.rowsFailed)} />
                    </div>
                )}
            </StepCard>

             {/* Step 4: Recompute financial metrics */}
            <StepCard step={4} title="Recompute Financial Metrics">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[13px] text-(--db-text-primary) max-w-xl">
                        Recomputes ROI, rental yield, cap rate and AI score for all properties. Run after any data upload — takes 2–3 minutes.
                    </p>
                    <Button
                        variant="navy"
                        className={`shrink-0 transition-[filter] ${recomputeCooldown ? "blur-[1.5px]" : ""}`}
                        onClick={openRecomputeConfirm}
                        disabled={recomputing}
                    >
                        {recomputing ? "RECOMPUTING..." : recomputeCooldown ? "PLEASE WAIT..." : "RECOMPUTE FINANCIAL METRICS"}
                    </Button>
                </div>
                {recomputeResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-(--db-border)">
                        <Stat label="Properties computed" value={str(recomputeResult.propertiesComputed)} />
                        <Stat label="Duration" value={str(recomputeResult.duration)} />
                    </div>
                )}
            </StepCard>

            {/* Step 5: Recompute districts */}
            <StepCard step={5} title="Recompute Districts">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[13px] text-(--db-text-primary) max-w-xl">
                        Recomputes district averages (ROI, rental yield), trend direction and market signal. Run after financial metrics have finished.
                    </p>
                    <Button
                        variant="navy"
                        className={`shrink-0 transition-[filter] ${districtsCooldown ? "blur-[1.5px]" : ""}`}
                        onClick={handleRecomputeDistricts}
                        disabled={districtsRecomputing || recomputing}
                    >
                        {districtsRecomputing ? "RECOMPUTING..." : districtsCooldown ? "PLEASE WAIT..." : "RECOMPUTE DISTRICTS"}
                    </Button>
                </div>
                {districtsResult && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-(--db-border)">
                        <Stat label="Districts processed" value={str(districtsResult.districtsProcessed)} />
                        <Stat label="Duration" value={str(districtsResult.duration)} />
                    </div>
                )}
            </StepCard>

            {/* Coverage table */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-(--db-text-primary)">Rental Coverage Report</p>
                    {coverageTotal > 0 && (
                        <p className="text-[13px] text-(--db-text-muted)">
                            Showing {(coveragePage - 1) * COVERAGE_LIMIT + 1}–{Math.min(coveragePage * COVERAGE_LIMIT, coverageTotal)} of {coverageTotal}
                        </p>
                    )}
                </div>
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
                            {coverageLoading && coverage.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={`${tdCls} text-center py-8`}>Loading coverage...</td>
                                </tr>
                            )}
                            {coverage.length === 0 && !coverageLoading && (
                                <tr>
                                    <td colSpan={5} className={`${tdCls} text-center py-8`}>
                                        No rental data ingested yet — upload files above.
                                    </td>
                                </tr>
                            )}
                            {coverage.map((row, i) => (
                                <tr key={`${coveragePage}-${i}`} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
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

                {coverageTotalPages > 1 && (
                    <div className={`flex items-center justify-center gap-1.5 ${coverageLoading ? "opacity-60 pointer-events-none" : ""}`}>
                        {coveragePages.map((p) => (
                            <button
                                key={p}
                                onClick={() => setCoveragePage(p)}
                                className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${coveragePage === p
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
