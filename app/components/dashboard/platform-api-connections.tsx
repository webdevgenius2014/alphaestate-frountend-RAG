"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import appService from "@/app/services/appService";
import { API_CONNECTIONS, API_STATUS_CONFIG, type APIConnectionStatus } from "@/app/(admin dashboard)/constants";
import { formatRelativeTime } from "@/app/utils/session";
import ModalButton from "../ui/modal-button";

const DEFAULT_STATUS_STYLE = { bg: "bg-[#D28A442E]", color: "text-[#D28A44]", dot: "bg-[#D28A44]" };

function capitalize(status?: string) {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : status;
}

function num(v: unknown) {
    return Number(v ?? 0).toLocaleString();
}

function buildConnections(d: any) {
    return [
        {
            name: "ADREC Data Feed",
            icon: API_CONNECTIONS[0]?.icon,
            status: capitalize(d.adrecDataFeed?.status),
            metrics: [
                { label: "Last Sync:", value: formatRelativeTime(d.adrecDataFeed?.lastSync ?? null) },
                { label: "Records Today:", value: num(d.adrecDataFeed?.recordsToday) },
            ],
            action: "VIEW DETAILS",
        },
        {
            name: "AI Intelligence Engine",
            icon: API_CONNECTIONS[1]?.icon,
            status: capitalize(d.aiEngine?.status),
            metrics: [
                { label: "Requests Today:", value: num(d.aiEngine?.requestsToday) },
            ],
            action: "CONFIGURE",
        },
        {
            name: "PDF Report Service",
            icon: API_CONNECTIONS[2]?.icon,
            status: capitalize(d.pdfReportService?.status),
            metrics: [
                { label: "Reports Generated:", value: num(d.pdfReportService?.reportsGenerated) },
            ],
            action: "VIEW STATUS",
        },
        {
            name: "Email Notification",
            icon: API_CONNECTIONS[3]?.icon,
            status: capitalize(d.emailNotification?.status),
            metrics: [
                { label: "Emails Sent Today:", value: num(d.emailNotification?.emailsSentToday) },
            ],
            action: "CONFIGURE",
        },
    ];
}

function PdfStatusModal({ isOpen, onClose, status }: { isOpen: boolean; onClose: () => void; status?: string }) {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const st = API_STATUS_CONFIG[status as APIConnectionStatus] ?? DEFAULT_STATUS_STYLE;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-100.75 shadow-2xl relative px-7 pt-8 pb-7 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>
                <h2 className="text-[20px] font-medium text-(--db-text-primary) mb-4">PDF Report Service Status</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-sm font-medium ${st.bg} ${st.color}`}>
                    <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    {status ?? "Unknown"}
                </span>
            </div>
        </div>,
        document.body
    );
}

export function PlatformAPIConnections() {
    const [connections, setConnections] = useState<any[] | null>(null);
    const [pdfStatusOpen, setPdfStatusOpen] = useState(false);

    useEffect(() => {
        appService.getPlatformConnections().then((res) => {
            if (res?.data?.data) {
                setConnections(buildConnections(res.data.data));
            }
        });
    }, []);

    const rows = connections ?? API_CONNECTIONS;
    const pdfStatus = rows.find((c: any) => c.name === "PDF Report Service")?.status;

    return (
        <>
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">API & Data Connections</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">Monitor external integrations and data service connections.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {rows.map((conn: any, i: number) => {
                    const st = API_STATUS_CONFIG[conn.status as APIConnectionStatus] ?? DEFAULT_STATUS_STYLE;
                    return (
                        <div key={conn.id ?? conn.name ?? i} className="bg-(--db-main-bg) border border-(--db-border) rounded-md p-5 flex flex-col gap-4">

                            <div className="flex items-center gap-4">
                                <div className="shrink-0 w-13 h-13 bg-[#D28A441A] rounded-md flex items-center justify-center">
                                    {conn.icon}
                                </div>
                                <p className="text-[15px] font-medium text-(--db-text-primary) leading-snug">{conn.name}</p>
                            </div>

                            <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-sm font-medium ${st.bg} ${st.color}`}>
                                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                                {conn.status}
                            </span>

                            <div className="flex flex-col gap-5 flex-1">
                                {(conn.metrics ?? []).map((m: { label: string; value: string }, j: number) => (
                                    <div key={j}>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal">{m.label}</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{m.value}</p>
                                    </div>
                                ))}
                            </div>

                            {conn.name === "PDF Report Service" ? (
                                <ModalButton className="py-2! rounded-sm!" onClick={() => setPdfStatusOpen(true)}>
                                    {conn.action ?? "VIEW STATUS"}
                                </ModalButton>
                            ) : conn.name === "Email Notification" ? (
                                <ModalButton className="py-2! rounded-sm!">{conn.action ?? "CONFIGURE"}</ModalButton>
                            ) : null /* "VIEW DETAILS" (ADREC Data Feed) and "CONFIGURE" (AI Intelligence Engine) are not wired up yet */}

                        </div>
                    );
                })}
            </div>

        </div>
        <PdfStatusModal isOpen={pdfStatusOpen} onClose={() => setPdfStatusOpen(false)} status={pdfStatus} />
        </>
    );
}
