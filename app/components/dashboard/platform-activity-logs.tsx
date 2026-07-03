"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { ACTIVITY_LOGS, thCls, tdCls, compactSelect } from "@/app/(admin dashboard)/constants";
import { SelectChevron, SortIcon } from "@/app/(user dashboard)/constants";

const EXT_BY_MIME: Record<string, string> = {
    "text/csv": "csv",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/pdf": "pdf",
    "application/json": "json",
};

const PAGE_LIMIT = 10;

function str(val: any): string {
    if (val == null) return "";
    if (typeof val === "object") return val.name ?? val.fullName ?? val.title ?? JSON.stringify(val);
    return String(val);
}

function resolveAdmin(row: any): string {
    const a = row.admin ?? row.adminName ?? row.user ?? row.actor ?? "";
    if (typeof a === "object" && a !== null) return a.fullName ?? a.name ?? a.email ?? "";
    return String(a);
}

function resolveTime(row: any): string {
    const t = row.time ?? row.createdAt ?? row.timestamp ?? row.date ?? "";
    if (!t) return "";
    const parsed = new Date(t);
    if (isNaN(parsed.getTime())) return String(t);
    return parsed.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function PlatformActivityLogs() {
    const [dateRange, setDateRange]       = useState("");
    const [role, setRole]                 = useState("");
    const [module, setModule]             = useState("");
    const [logs, setLogs]                 = useState<any[]>([]);
    const [page, setPage]                 = useState(1);
    const [totalPages, setTotalPages]     = useState(1);
    const [exporting, setExporting]       = useState(false);

    useEffect(() => {
        appService
            .getAdminActivityLogs(page, PAGE_LIMIT, {
                period: dateRange || undefined,
                role: role || undefined,
                module: module || undefined,
            })
            .then((res) => {
                if (res?.data?.data) {
                    const d = res.data.data;
                    const items = Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : [];
                    setLogs(items);
                    setTotalPages(Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? PAGE_LIMIT))));
                }
            });
    }, [page, dateRange, role, module]);

    const rows = logs.length > 0 ? logs : ACTIVITY_LOGS;

    const handleExport = async () => {
        setExporting(true);
        const res = await appService.exportAdminActivityLogs({
            period: dateRange || undefined,
            role: role || undefined,
            module: module || undefined,
        });
        setExporting(false);

        if (!res?.data || res.status >= 400) {
            toast.error("Failed to export activity logs.");
            return;
        }

        const contentType = res.headers?.["content-type"] || "text/csv";
        const disposition: string = res.headers?.["content-disposition"] || "";
        const nameMatch = disposition.match(/filename="?([^"; ]+)"?/i);
        const ext = EXT_BY_MIME[contentType.split(";")[0].trim()] || "csv";
        const filename = nameMatch?.[1] || `activity-logs.${ext}`;

        const blob = new Blob([res.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Activity Logs</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">Review administrator actions and platform events.</p>
            </div>

            {/* Filter row */}
            <div className="flex p-3.75 bg-(--db-main-bg) flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-(--db-text-primary)">
                    <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                    <SortIcon />
                                  </button>
                    <span>Filter By</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Date Range */}
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
                            className={compactSelect}
                        >
                            <option value="">Date Range</option>
                            <option value="last_year">Last Year</option>
                            <option value="last_6months">Last 6 Month</option>
                            <option value="last_month">Last Month</option>
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                    </div>
                    {/* Role */}
                    <div className="relative">
                        <select
                            value={role}
                            onChange={(e) => { setRole(e.target.value); setPage(1); }}
                            className={compactSelect}
                        >
                            <option value="">Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                    </div>
                    {/* Module */}
                    <div className="relative">
                        <select
                            value={module}
                            onChange={(e) => { setModule(e.target.value); setPage(1); }}
                            className={compactSelect}
                        >
                            <option value="">Module</option>
                            <option value="Properties">Properties</option>
                            <option value="Subscriptions">Subscriptions</option>
                            <option value="Platform">Platform</option>
                            <option value="Reports">Reports</option>
                            <option value="Auth">Auth</option>
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-(--db-border) rounded-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                <th className={thCls}>Admin</th>
                                <th className={thCls}>Action</th>
                                <th className={thCls}>Module</th>
                                <th className={thCls}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row: any, i: number) => (
                                <tr key={row.id ?? i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                    <td className={`${tdCls} font-medium`}>{resolveAdmin(row)}</td>
                                    <td className={tdCls}>{str(row.action ?? row.activity ?? row.description)}</td>
                                    <td className={tdCls}>{str(row.module ?? row.resource ?? row.entityType)}</td>
                                    <td className={tdCls}>{resolveTime(row)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
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

            {/* Export */}
            <div>
                <Button variant="primary" className="py-2.5! max-w-fit px-8" onClick={handleExport} disabled={exporting}>
                    {exporting ? "EXPORTING..." : "EXPORT LOGS"}
                </Button>
            </div>

        </div>
    );
}
