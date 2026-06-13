"use client";

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { AlertROITrendChart } from "@/app/components/dashboard/smart-alerts-charts";
import { CreateAlertModal, EditAlertModal, DeleteAlertModal } from "@/app/components/dashboard/alert-modals";
import {
    ALERT_STATS, ALERT_NOTIFICATION_METHODS, ALERT_FEED_ITEMS,
    AlertEditIcon, AlertDeleteIcon, AlertBellIcon,
    SelectChevron,
    type AlertFeedItem,
} from "@/app/(user dashboard)/constants";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function SectionHeading({ children }: { children: ReactNode }) {
    return <p className="text-[17px] font-semibold text-[#D28A44] mb-3.75">{children}</p>;
}

const freqSelectCls = "w-full text-sm border border-(--db-border) rounded-md px-3 py-2.5 bg-(--db-sidebar-bg) text-(--db-text-primary) outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";

function statTiles(a: AlertFeedItem) {
    return [
        { label: "ROI", value: a.roi },
        { label: "Rental Yield", value: a.rentalYield },
        { label: "Appreciation", value: a.appreciation },
        { label: "AI Score", value: a.aiScore },
    ];
}

export default function SmartAlertsPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [checked, setChecked] = useState<Set<string>>(
        () => new Set(ALERT_NOTIFICATION_METHODS.flatMap((m) => m.items))
    );

    const closeCreate = useCallback(() => setCreateOpen(false), []);
    const closeEdit = useCallback(() => setEditOpen(false), []);
    const closeDelete = useCallback(() => setDeleteOpen(false), []);

    const activeAlert = ALERT_FEED_ITEMS[activeIdx];

    const toggleCheck = (item: string) =>
        setChecked((prev) => {
            const next = new Set(prev);
            next.has(item) ? next.delete(item) : next.add(item);
            return next;
        });

    return (
        <div className="flex flex-col min-h-full">
            {createOpen && <CreateAlertModal onClose={closeCreate} />}
            {editOpen && <EditAlertModal alert={activeAlert} onClose={closeEdit} />}
            {deleteOpen && <DeleteAlertModal alert={activeAlert} onClose={closeDelete} />}

            <div className="flex-1 space-y-6">

                <div className="flex items-end flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Smart Alerts Center</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
                            AI-powered monitoring for investment opportunities, market movements, and district performance alerts.
                        </p>
                    </div>
                    <ModalButton className="py-2.75! max-w-fit px-5 text-sm!" onClick={() => setCreateOpen(true)}>
                         CREATE ALERT
                    </ModalButton>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {ALERT_STATS.map((s) => (
                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                            <div className="flex items-center justify-start gap-2 mb-2.5">
                                <div className="shrink-0 w-10 h-10 flex justify-center items-center bg-[#D28A441F] rounded-sm">{s.icon}</div>
                                <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                            </div>
                            <AnimatedNumber
                                value={s.value}
                                className="text-2xl mb-1 md:text-[32px] font-semibold text-(--db-text-primary) leading-[100%]"
                            />
                            <p className="text-[13px] font-normal text-(--db-text-muted)">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Manage Alert Preferences ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Manage Alert Preferences</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Configure which alerts you receive and how you'd like to be notified.
                    </p>

                    <div className="bg-(--db-main-bg) px-4 py-5 mb-5">
                        <SectionHeading>Notification Methods</SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {ALERT_NOTIFICATION_METHODS.map((method) => (
                                <div key={method.label} className="w-full">
                                    <div className="flex items-center gap-2.5 mb-4.5">
                                        <div className="bg-[#D28A441F] w-8.5 h-8.5 rounded-[3px] flex justify-center items-center text-[#D28A44] shrink-0">
                                            {method.icon}
                                        </div>
                                        <span className="text-base font-semibold text-(--db-text-primary)">{method.label}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {method.items.map((item) => (
                                            <label
                                                key={item}
                                                className="flex items-center gap-2.5 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked.has(item)}
                                                    onChange={() => toggleCheck(item)}
                                                    className="w-5.75 h-5.75 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                                />
                                                {item}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--db-main-bg) px-4 py-5 mb-5">
                        <SectionHeading>Notification Frequency</SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(["ROI Alerts", "Market Updates", "Price Alerts"] as const).map((lbl) => (
                                <div key={lbl}>
                                    <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{lbl}</label>
                                    <div className="relative">
                                        <select className={freqSelectCls}>
                                            <option>Immediate</option>
                                            <option>Hourly Digest</option>
                                            <option>Daily Summary</option>
                                            <option>Weekly Report</option>
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <SelectChevron />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex">
                        <ModalButton className="py-4! max-w-fit px-5">SAVE NOTIFICATION PREFERENCES</ModalButton>
                    </div>
                </Card>

                {/* ── Active Smart Alerts ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Active Smart Alerts</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Real-time AI-detected market opportunities and signals across monitored districts.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-[331px_1fr] gap-5">

                        {/* Left — Live Feed */}
                        <div className="bg-(--db-main-bg) rounded-sm p-5 overflow-hidden">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-3.5">Live Alert Feed</h3>
                            <div className="space-y-3.75">
                                {ALERT_FEED_ITEMS.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`w-full text-left pl-4.75 pr-2 py-3.5 transition-colors ease-linear ${activeIdx === idx ? "bg-[#D28A444F]" : "bg-(--db-sidebar-bg) hover:bg-[#D28A444F]"}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-sm font-normal text-(--db-text-primary)">{item.type}</span>
                                            <span className="text-[9px] text-(--db-text-primary) shrink-0 mt-0.5">{item.timeAgo}</span>
                                        </div>
                                        <span className="text-base text-[#D28A44] font-medium">{item.district}</span>
                                        <div className="flex items-center justify-between gap-1.5">
                                            <p className="text-[13px] text-(--db-text-primary) font-normal">{item.description}</p>
                                            <div className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center">
                                                <AlertBellIcon />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right — Detail Panel */}
                        <div className="bg-(--db-main-bg) rounded-sm p-5">
                            <div className="flex items-start justify-between gap-4 mb-3.5">
                                <h3 className="text-[17px] font-semibold text-[#D28A44]">{activeAlert.type}</h3>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        title="Edit alert"
                                        className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center"
                                    >
                                        <AlertEditIcon />
                                    </button>
                                    <button
                                        onClick={() => setDeleteOpen(true)}
                                        title="Delete alert"
                                        className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center"
                                    >
                                        <AlertDeleteIcon />
                                    </button>
                                    <button
                                        title="Duplicate alert"
                                        className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center"
                                    >
                                        <AlertBellIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-[17px] text-(--db-text-primary) font-medium mb-0.5">
                                    {activeAlert.district}
                                </p>
                                <p className="text-[13px] text-(--db-text-primary) font-normal mb-2.25">
                                    {activeAlert.detail}
                                </p>
                                <span className={`text-[10px] text-(--db-text-primary) font-normal flex gap-1 items-center`}>
                                    <span className={`w-2 h-2 rounded-full block ${activeAlert.badgeCls}`}></span>
                                    {activeAlert.badge}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                {statTiles(activeAlert).map((t) => (
                                    <div key={t.label} className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <p className="">{t.label}: <b>{t.value}</b></p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-(--db-sidebar-bg) p-4">
                                <p className="text-sm font-medium text-(--db-text-primary) mb-3">ROI Trend — Last 30 Days</p>
                                <AlertROITrendChart />
                            </div>
                        </div>

                    </div>
                </Card>

            </div>
        </div>
    );
}
