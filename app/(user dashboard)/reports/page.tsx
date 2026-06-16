"use client";

import { useState } from "react";
import ModalButton from "@/app/components/ui/modal-button";
import Button from "@/app/components/ui/button";
import { DownloadReportModal, DeleteReportModal, GenerateReportModal, type ReportRow } from "@/app/components/dashboard/alert-modals";
import {
    REPORT_TYPE_CARDS,
    REPORT_DISTRICTS,
    REPORT_PROPERTY_TYPES,
    REPORT_TIME_PERIODS,
    REPORT_FORMATS,
    REPORT_TABLE_ROWS,
    ReportDownloadIcon,
    ReportShareIcon,
    ReportTrashIcon,
    SelectChevron,
} from "@/app/(user dashboard)/constants";

const inputCls =
    "w-full border border-[#D28A441F] rounded-[3px] p-[12px_14px] bg-(--db-sidebar-bg) text-(--db-text-primary) text-[13px] outline-none focus:border-[#D28A44]/60 transition-colors appearance-none cursor-pointer";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative w-13.75 h-6 rounded-full border transition-colors ease-linear shrink-0 ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-main-bg) border-(--db-toggle-border)"}`}
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

const actionBtnCls = "w-[23px] h-[23px] rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear";

export default function ReportsPage() {
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set(["district"]));
    const toggleType = (id: string) => setSelectedTypes((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    const [district, setDistrict] = useState(REPORT_DISTRICTS[0]);
    const [propType, setPropType] = useState(REPORT_PROPERTY_TYPES[0]);
    const [timePeriod, setTimePeriod] = useState(REPORT_TIME_PERIODS[0]);
    const [format, setFormat] = useState(REPORT_FORMATS[0]);
    const [aiInsights, setAiInsights] = useState(true);
    const [downloadReport, setDownloadReport] = useState<ReportRow | null>(null);
    const [deleteReport, setDeleteReport]     = useState<ReportRow | null>(null);
    const [generateOpen, setGenerateOpen]     = useState(false);

    return (
        <div className="w-full">
            <div className="flex items-start flex-wrap justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Reports Center</h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-lg">
                        Generate professional market intelligence reports powered by verified ADREC transaction data and AI-driven property analysis.
                    </p>
                </div>
                <ModalButton className="max-w-fit px-5 py-2.5! text-[13px]!">EXPORT HISTORY</ModalButton>
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
                                <SelectField label="District Selection" options={REPORT_DISTRICTS} value={district} onChange={setDistrict} />
                            </div>
                            <SelectField label="Property Type" options={REPORT_PROPERTY_TYPES} value={propType} onChange={setPropType} />
                            <SelectField label="Time Period" options={REPORT_TIME_PERIODS} value={timePeriod} onChange={setTimePeriod} />
                            <SelectField label="Report Format" options={REPORT_FORMATS} value={format} onChange={setFormat} />

                            <div>
                                <p className="text-[13px] font-medium text-(--db-text-primary) mb-2.5">Include AI Insights</p>
                                <Toggle checked={aiInsights} onChange={() => setAiInsights((p) => !p)} />
                            </div>

                            <div className="flex items-center gap-4 pt-1">
                                <Button variant="primary" className="py-2.5!" onClick={() => setGenerateOpen(true)}>GENERATE REPORT</Button>
                                <ModalButton className="max-w-fit px-5 py-2.5!">RESET FORM</ModalButton>
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
                            {REPORT_TABLE_ROWS.map((row, i) => (
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
                            ))}
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
            {generateOpen && (
                <GenerateReportModal
                    reportName={`${district} ${REPORT_TYPE_CARDS.find(r => selectedTypes.has(r.id))?.title ?? "Analysis"}`}
                    onClose={() => setGenerateOpen(false)}
                />
            )}
        </div>
    );
}
