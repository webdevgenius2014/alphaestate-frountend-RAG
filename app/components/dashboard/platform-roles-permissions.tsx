"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { ROLES_STATS, ROLES_TABLE, ROLE_PERMISSIONS, inputCls, labelCls, thCls, tdCls } from "@/app/(admin dashboard)/constants";

export function PlatformRolesPermissions() {
    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState<Set<string>>(() => new Set());

    const togglePerm = (p: string) =>
        setPermissions((prev) => { const next = new Set(prev); next.has(p) ? next.delete(p) : next.add(p); return next; });

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Roles & Permissions</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">Manage administrator roles and platform access levels.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {ROLES_STATS.map((s) => (
                    <div key={s.label} className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-10 h-10 bg-[#D28A441F] flex items-center justify-center rounded-sm">
                                {s.icon}
                            </div>
                            <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                        </div>
                        <AnimatedNumber value={s.value} className="text-2xl md:text-[42px] font-semibold text-(--db-text-primary) leading-none" />
                    </div>
                ))}
            </div>

            {/* Bottom 2-col */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

                {/* Roles Table */}
                <div className="bg-(--db-main-bg) rounded-md p-5">
                    <h3 className="text-[17px] font-medium text-(--db-text-primary) mb-4">Roles Table</h3>
                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                    <th className={thCls}>Role</th>
                                    <th className={thCls}>Users</th>
                                    <th className={thCls}>Access Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROLES_TABLE.map((row, i) => (
                                    <tr key={i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                        <td className={`${tdCls} font-medium`}>{row.role}</td>
                                        <td className={tdCls}>{row.users}</td>
                                        <td className={tdCls}>{row.accessLevel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Roll Assign */}
                <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-4">
                    <h3 className="text-[17px] font-medium text-(--db-text-primary)">Roll Assign</h3>

                    <div>
                        <label className={labelCls}>Role Name</label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Operations Manager"
                            className={inputCls}
                        />
                    </div>

                    <div>
                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-3">Permissions</p>
                        <div className="flex flex-col gap-3">
                            {ROLE_PERMISSIONS.map((perm) => {
                                const checked = permissions.has(perm);
                                return (
                                    <label key={perm} className="flex items-center gap-2.5 cursor-pointer">
                                        <input type="checkbox" checked={checked} onChange={() => togglePerm(perm)} className="hidden" />
                                        <span className={`shrink-0 w-4.75 h-4.75 rounded-[3px] border flex items-center justify-center transition-colors ease-linear ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-sidebar-bg) border-[#D28A4466]"}`}>
                                            {checked && (
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="text-sm text-(--db-text-primary)">{perm}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <Button variant="primary" className="py-2.5! mt-auto">SAVE CHANGES</Button>
                </div>
            </div>
        </div>
    );
}
