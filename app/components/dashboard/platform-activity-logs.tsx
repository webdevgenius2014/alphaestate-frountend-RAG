"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
import { ACTIVITY_LOGS, thCls, tdCls, selectCls, compactSelect } from "@/app/(admin dashboard)/constants";
import { SelectChevron, SortIcon } from "@/app/(user dashboard)/constants";


export function PlatformActivityLogs() {
    const [dateRange, setDateRange]   = useState("Date Range");
    const [adminUser, setAdminUser]   = useState("Admin User");
    const [activityType, setActivityType] = useState("Activity Type");

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
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={compactSelect}>
                            <option>Date Range</option>
                            <option>Today</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Month</option>
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                    </div>
                    {/* Admin User */}
                    <div className="relative">
                        <select value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className={compactSelect}>
                            <option>Admin User</option>
                            <option>Sarah Admin</option>
                            <option>John Admin</option>
                            <option>Michael Admin</option>
                            <option>Emma Admin</option>
                        </select>
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                    </div>
                    {/* Activity Type */}
                    <div className="relative">
                        <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className={compactSelect}>
                            <option>Activity Type</option>
                            <option>Property Update</option>
                            <option>User Management</option>
                            <option>Report Action</option>
                            <option>API Settings</option>
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
                            {ACTIVITY_LOGS.map((row, i) => (
                                <tr key={i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                    <td className={`${tdCls} font-medium`}>{row.admin}</td>
                                    <td className={tdCls}>{row.action}</td>
                                    <td className={tdCls}>{row.module}</td>
                                    <td className={tdCls}>{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export */}
            <div>
                <Button variant="primary" className="py-2.5! max-w-fit px-8">EXPORT LOGS</Button>
            </div>

        </div>
    );
}
