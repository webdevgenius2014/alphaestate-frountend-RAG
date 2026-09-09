"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import appService from "@/app/services/appService";

function useModalEsc(onClose: () => void) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);
}

const GREEN = "#5E9F62";
const RED = "#CF2D48";

type EngineStatus = {
    status?: string;
    database?: string;
    cache?: string;
    lastIngestion?: string;
    transactionCount?: number;
};

function isOk(value?: string) {
    return typeof value === "string" && value.toLowerCase() === "ok";
}

function formatDateTime(iso?: string) {
    if (!iso) return undefined;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusRing({ percent, healthy }: { percent: number; healthy: boolean }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const color = healthy ? GREEN : RED;
    const offset = circumference - (percent / 100) * circumference;
    return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto mb-5">
            <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="currentColor" strokeOpacity="0.12" strokeWidth="10"
                className="text-(--db-text-primary)"
            />
            <circle
                cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 70 70)"
            />
            <text x="70" y="66" textAnchor="middle" fontSize="26" fontWeight="700" fill={color}>{Math.round(percent)}%</text>
            <text x="70" y="86" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="1" fill={color} opacity="0.8">
                {healthy ? "HEALTHY" : "DEGRADED"}
            </text>
        </svg>
    );
}

export function SystemStatusModal({ onClose }: { onClose: () => void }) {
    useModalEsc(onClose);
    const [data, setData] = useState<EngineStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [checkedAt, setCheckedAt] = useState<string>("");

    useEffect(() => {
        let cancelled = false;
        appService.getAiEngineStatus().then((res) => {
            if (cancelled) return;
            const payload = res?.data?.data ?? res?.data;
            if (res?.status && res.status >= 200 && res.status < 300 && payload) {
                setData(payload);
            } else {
                setError(true);
            }
            setLoading(false);
            setCheckedAt(new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
        });
        return () => { cancelled = true; };
    }, []);

    const services = data
        ? [
            {
                name: "AI Engine",
                sub: data.transactionCount != null ? `${data.transactionCount.toLocaleString()} transactions indexed` : "Query & retrieval engine",
                status: data.status,
            },
            { name: "Database", sub: "Transaction data store", status: data.database },
            { name: "Cache", sub: "Query response cache", status: data.cache },
        ]
        : [];

    const okCount = services.filter((s) => isOk(s.status)).length;
    const percent = services.length ? (okCount / services.length) * 100 : 0;
    const healthy = services.length > 0 && okCount === services.length;
    const lastIngestionLabel = formatDateTime(data?.lastIngestion);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-121.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-9 pb-8 text-center">
                    {loading ? (
                        <p className="text-sm text-(--db-text-muted) py-16">Checking system status…</p>
                    ) : error || !data ? (
                        <p className="text-sm py-16" style={{ color: RED }}>
                            Unable to fetch system status. Please try again.
                        </p>
                    ) : (
                        <>
                            <StatusRing percent={percent} healthy={healthy} />

                            <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">System Status</h2>
                            <p className="text-sm font-semibold mb-6" style={{ color: healthy ? GREEN : RED }}>
                                {healthy ? "All Systems Operational" : "Some Systems Degraded"}
                            </p>

                            <div className="space-y-2.5 text-left">
                                {services.map((svc) => {
                                    const ok = isOk(svc.status);
                                    const color = ok ? GREEN : RED;
                                    return (
                                        <div
                                            key={svc.name}
                                            className="flex items-center justify-between gap-3 rounded-md px-4 py-3"
                                            style={{ backgroundColor: ok ? "#5E9F620F" : "#CF2D480F", border: `1px solid ${ok ? "#5E9F621F" : "#CF2D481F"}` }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-(--db-text-primary) truncate">{svc.name}</p>
                                                    <p className="text-xs text-(--db-text-muted) truncate">{svc.sub}</p>
                                                </div>
                                            </div>
                                            <span
                                                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold"
                                                style={{ backgroundColor: ok ? "#5E9F621C" : "#CF2D481C", color }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: color }} />
                                                {svc.status ?? "unknown"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {lastIngestionLabel && (
                                <p className="text-xs text-(--db-text-muted) mt-6">Last ingestion: {lastIngestionLabel}</p>
                            )}
                            <p className="text-xs text-(--db-text-muted) mt-1">Last checked: {checkedAt}</p>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
