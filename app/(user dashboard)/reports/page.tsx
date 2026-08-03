"use client";

import { useState, useEffect } from "react";
import ModalButton from "@/app/components/ui/modal-button";
import Button from "@/app/components/ui/button";
import { toast } from "react-hot-toast";
import {
    DownloadReportModal,
    DeleteReportModal,
    GenerateReportModal,
    ExportHistoryModal,
    type ReportRow,
    type GenerateReportConfig,
} from "@/app/components/dashboard/alert-modals";
import {
    REPORT_TYPE_CARDS,
    REPORT_PROPERTY_TYPES,
    REPORT_TIME_PERIODS,
    REPORT_FORMATS,
    SALE_TYPE_OPTIONS,
    ReportDownloadIcon,
    ReportShareIcon,
    ReportTrashIcon,
    SelectChevron,
} from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";

function formatReportDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function humanizeReportType(value?: string) {
    if (!value) return "-";
    return value
        .split("_")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function toReportRow(r: any): ReportRow {
    return {
        name: r.name ?? r.reportName ?? "Untitled Report",
        type: humanizeReportType(r.type ?? r.reportType),
        district: r.district ?? "-",
        date: r.createdAt ? formatReportDate(r.createdAt) : (r.date ?? "-"),
        status: r.status ?? "Ready",
    };
}

const inputCls =
    "w-full border border-[#D28A441F] rounded-[3px] p-[12px_14px] bg-(--db-sidebar-bg) text-(--db-text-primary) text-[13px] outline-none focus:border-[#D28A44]/60 transition-colors appearance-none cursor-pointer";

function Toggle({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`relative w-13.75 h-6 rounded-full border transition-colors ease-linear shrink-0 ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-main-bg) border-(--db-toggle-border)"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <div className={`absolute top-px w-5 h-5 rounded-full shadow transition-all ease-linear ${checked ? "right-0.5 bg-(--db-main-bg)" : "left-0.5 bg-[#D28A44]"}`} />
        </button>
    );
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <p className="text-[15px] font-medium text-(--db-text-primary) mb-2">{label}</p>
            <div className="relative">
                <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
                    {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)">
                    <SelectChevron />
                </span>
            </div>
        </div>
    );
}

function periodLabelToEnum(label: string): "last_year" | "last_6months" | "last_2_years" | "all_time" {
    switch (label) {
        case "Last 6 Months":
            return "last_6months";
        case "Last 2 Years":
            return "last_2_years";
        case "All Time":
            return "all_time";
        default:
            return "last_year";
    }
}

const actionBtnCls = "w-[23px] h-[23px] rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear";

export default function ReportsPage() {
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set(["district"]));
    const toggleType = (id: string) => setSelectedTypes((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

    const [districts, setDistricts] = useState<Array<{ id?: string; name: string }>>([]);
    const [district, setDistrict] = useState("");
    const [propType, setPropType] = useState(REPORT_PROPERTY_TYPES[0]);
    const [timePeriod, setTimePeriod] = useState(REPORT_TIME_PERIODS[0]);
    const [format, setFormat] = useState(REPORT_FORMATS[0]);
    const [aiInsights] = useState(false);

    const [saleType, setSaleType] = useState(SALE_TYPE_OPTIONS[0]);
    const [areaSqm, setAreaSqm] = useState("");
    const [askingPrice, setAskingPrice] = useState("");

    const [generateCooldown, setGenerateCooldown] = useState(false);

    const [downloadReport, setDownloadReport] = useState<ReportRow | null>(null);
    const [deleteReport, setDeleteReport] = useState<ReportRow | null>(null);
    const [generateConfig, setGenerateConfig] = useState<GenerateReportConfig | null>(null);
    const [exportHistoryOpen, setExportHistoryOpen] = useState(false);

    const [reports, setReports] = useState<ReportRow[]>([]);
    const [reportsLoading, setReportsLoading] = useState(true);

    const isValidationSelected = selectedTypes.has("validation");

    function refreshReports() {
        appService.getReportsHistory(1, 20).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const d = res.data?.data;
                const items = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.data) ? d.data : [];
                setReports(items.map(toReportRow));
            }
            setReportsLoading(false);
        });
    }

    useEffect(() => {
        refreshReports();
    }, []);

    useEffect(() => {
        appService.getAllDistricts().then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const items = res.data?.data ?? [];
                const names = items
                    .map((item: any) => (typeof item === "string" ? { name: item } : { id: item.id ?? item._id, name: item.name ?? item.district ?? "" }))
                    .filter((d: any) => d.name);
                setDistricts(names);
                setDistrict((prev) => prev || names[0]?.name || "");
            }
        });
    }, []);

    function handleGenerate() {
        if (generateCooldown) return;

        if (isValidationSelected && (!district || !areaSqm || !askingPrice)) {
            toast.error("Deal Validation Report requires district, area (SQM), and asking price.");
            return;
        }

        setGenerateCooldown(true);
        setTimeout(() => setGenerateCooldown(false), 15000);

        const primaryType = REPORT_TYPE_CARDS.find((r) => selectedTypes.has(r.id));
        const districtObj = districts.find((d) => d.name === district);

        setGenerateConfig({
            reportName: `${district || "Market"} ${primaryType?.title ?? "Analysis"}`,
            format,
            types: Array.from(selectedTypes),
            district,
            districtId: districtObj?.id,
            propertyType: propType,
            period: periodLabelToEnum(timePeriod),
            saleType: isValidationSelected ? saleType : undefined,
            areaSqm: isValidationSelected ? Number(areaSqm) : undefined,
            askingPriceAed: isValidationSelected ? Number(askingPrice) : undefined,
        });

        handleReset();
    }

    function handleReset() {
        setSelectedTypes(new Set(["district"]));
        setDistrict(districts[0]?.name || "");
        setPropType(REPORT_PROPERTY_TYPES[0]);
        setTimePeriod(REPORT_TIME_PERIODS[0]);
        setFormat(REPORT_FORMATS[0]);
        setSaleType(SALE_TYPE_OPTIONS[0]);
        setAreaSqm("");
        setAskingPrice("");
    }

    return (
        <div className="w-full">
            <div className="flex items-start flex-wrap justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Reports Center</h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-lg">
                        Generate professional market intelligence reports powered by verified ADREC transaction data and AI-driven property analysis.
                    </p>
                </div>
                <ModalButton className="max-w-fit px-5 py-2.5! text-[13px]!" onClick={() => setExportHistoryOpen(true)}>EXPORT HISTORY</ModalButton>
            </div>

            <div className="mb-5 bg-(--db-sidebar-bg) p-5">
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-4/75">Generate Report</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[365px_auto] gap-5">
                    <div className="bg-(--db-main-bg) p-5 rounded-sm">
                        <p className="text-[17px] font-semibold text-[#D28A44] mb-4">Report Type Cards</p>
                        <div className="space-y-4">
                            {REPORT_TYPE_CARDS.map((rt) => (
                                <label
                                    key={rt.id}
                                    className={`rounded-[3px] p-3.75 flex-col flex cursor-pointer transition-colors ${selectedTypes.has(rt.id) ? "bg-[#D28A444D]" : "bg-[#D28A441A]"}`}
                                >
                                    <div className="flex items-start gap-3 mb-0.5">
                                        <input type="checkbox" value={rt.id} checked={selectedTypes.has(rt.id)} onChange={() => toggleType(rt.id)} className="hidden" />
                                        <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedTypes.has(rt.id) ? "border-[#D28A44]" : "border-[#D28A44]"}`}>
                                            {selectedTypes.has(rt.id) && <span className="w-3 h-3 rounded-full bg-[#D28A44] block" />}
                                        </span>
                                        <p className="text-[15px] font-medium text-(--db-text-primary)">{rt.title}</p>
                                    </div>
                                    <p className="text-[13px] text-(--db-text-primary) mt-1">{rt.desc}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--db-main-bg) p-5 rounded-sm">
                        <p className="text-[17px] font-semibold text-[#D28A44] mb-4">Generate Report</p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="Report Type" options={REPORT_TYPE_CARDS.map(r => r.title)} value={REPORT_TYPE_CARDS.find(r => selectedTypes.has(r.id))?.title ?? REPORT_TYPE_CARDS[0].title} onChange={(v) => { const id = REPORT_TYPE_CARDS.find(r => r.title === v)?.id; if (id) setSelectedTypes(new Set([id])); }} />
                                <SelectField label="District Selection" options={districts.length ? districts.map(d => d.name) : [""]} value={district} onChange={setDistrict} />
                            </div>
                            <SelectField label="Property Type" options={REPORT_PROPERTY_TYPES} value={propType} onChange={setPropType} />
                            <SelectField label="Time Period" options={REPORT_TIME_PERIODS} value={timePeriod} onChange={setTimePeriod} />
                            <SelectField label="Report Format" options={REPORT_FORMATS} value={format} onChange={setFormat} />

                            {isValidationSelected && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-2">Area (SQM)</p>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="145"
                                            className={inputCls}
                                            value={areaSqm}
                                            onChange={(e) => setAreaSqm(e.target.value.replace(/[^0-9.]/g, ""))}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-2">Asking Price (AED)</p>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="2,400,000"
                                            className={inputCls}
                                            value={askingPrice}
                                            onChange={(e) => setAskingPrice(e.target.value.replace(/[^0-9]/g, ""))}
                                        />
                                    </div>
                                    <SelectField label="Sale Type" options={SALE_TYPE_OPTIONS} value={saleType} onChange={setSaleType} />
                                </div>
                            )}

                            <div>
                                <p className="text-[13px] font-medium text-(--db-text-primary) mb-2.5">Include AI Insights</p>
                                <Toggle checked={aiInsights} disabled />
                                {generateCooldown && (
                                    <p className="text-[11px] text-(--db-text-muted) mt-1.5">Coming soon .....</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <Button variant="primary" className="py-2.5!" onClick={handleGenerate} disabled={generateCooldown}>
                                    {generateCooldown ? "PLEASE WAIT..." : "GENERATE REPORT"}
                                </Button>
                                <ModalButton className="max-w-fit px-5 py-2.5!" onClick={handleReset}>RESET FORM</ModalButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-(--db-sidebar-bg) p-5">
                <div className="mb-4">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">My Reports</h2>
                    <p className="text-[13px] text-(--db-text-primary) mt-0.5">Access previously generated market intelligence reports and downloadable investment assessments.</p>
                </div>

                <div className="overflow-x-auto border border-(--db-border) rounded-md">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-sm font-semibold text-(--db-text-primary)">
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">Report Name</th>
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">Report Type</th>
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">District</th>
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">Generated Date</th>
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">Status</th>
                                <th className="px-5 py-3 whitespace-nowrap font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportsLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-6 text-center text-(--db-text-primary)">Loading...</td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-6 text-center text-(--db-text-primary)">No data found</td>
                                </tr>
                            ) : (
                            reports.map((row, i) => (
                                <tr key={i} className="border-b border-(--db-border) last:border-0 divide-x divide-(--db-border) text-(--db-text-primary) odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                    <td className="px-5 py-3.5 font-medium whitespace-nowrap">{row.name}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">{row.type}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">{row.district}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">{row.date}</td>
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[13px] font-medium bg-[#5E9F622E] text-[#5E9F62]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#5E9F62] block" />
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button className={actionBtnCls} title="Download" onClick={() => setDownloadReport(row)}><ReportDownloadIcon /></button>
                                            <button className={actionBtnCls} title="Share"><ReportShareIcon /></button>
                                            <button className={`${actionBtnCls} hover:text-rose-500 hover:border-rose-400`} title="Delete" onClick={() => setDeleteReport(row)}><ReportTrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {downloadReport && (
                <DownloadReportModal report={downloadReport} onClose={() => setDownloadReport(null)} />
            )}
            {deleteReport && (
                <DeleteReportModal report={deleteReport} onClose={() => setDeleteReport(null)} onConfirm={() => setDeleteReport(null)} />
            )}
            {generateConfig && (
                <GenerateReportModal config={generateConfig} onClose={() => setGenerateConfig(null)} onLogged={refreshReports} />
            )}
            {exportHistoryOpen && (
                <ExportHistoryModal onClose={() => setExportHistoryOpen(false)} />
            )}
        </div>
    );
}
