"use client";

import { useRouter } from "next/navigation";
import { DISTRICT_DATA, DISTRICT_TREND_CONFIG, EyeIcon, EditIcon, type DrawerRecord, tdCls, actionBtnCls, thCls } from "@/app/(admin dashboard)/constants";
import ModalButton from "../ui/modal-button";

export function DistrictDataManagement({ onEye }: { onEye: (detail: DrawerRecord) => void }) {
    const router = useRouter();
    const goToForm = () => router.push("/ai-data/add-district");

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            {/* Section header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">District Data Management</h2>
                    <p className="text-[13px] text-(--db-text-primary) mt-0.5">
                        Manage district-level market intelligence and transaction datasets.
                    </p>
                </div>
                <ModalButton className="max-w-fit px-9 py-2.5!" onClick={goToForm}> ADD DISTRICT</ModalButton>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-(--db-border) rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                            <th className={thCls}>District</th>
                            <th className={thCls}>Transactions</th>
                            <th className={thCls}>Avg Price/SQM</th>
                            <th className={thCls}>Trend</th>
                            <th className={thCls}>Status</th>
                            <th className={thCls}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DISTRICT_DATA.map((row, i) => {
                            const trend = DISTRICT_TREND_CONFIG[row.trend];
                            return (
                                <tr
                                    key={i}
                                    className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                >
                                    <td className={`${tdCls} font-medium`}>{row.district}</td>
                                    <td className={tdCls}>{row.transactions.toLocaleString()}</td>
                                    <td className={tdCls}>{row.avgPrice}</td>
                                    <td className={tdCls}>
                                        <span className={`flex items-center gap-1.5`}>
                                            <span>{trend.icon}</span>
                                            {row.trend}
                                        </span>
                                    </td>
                                    <td className={tdCls}>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#5E9F622E] text-[#5E9F62]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            Active
                                        </span>
                                    </td>
                                    <td className={tdCls}>
                                        <div className="flex items-center gap-2">
                                            <button className={actionBtnCls} onClick={() => onEye(row.detail)}><EyeIcon /></button>
                                            <button className={actionBtnCls} onClick={goToForm}><EditIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
