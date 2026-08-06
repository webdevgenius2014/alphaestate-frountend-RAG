"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { SYSTEM_SERVICES } from "@/app/(admin dashboard)/constants";

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

function StatusRing() {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto mb-5">
            <circle
                cx="70" cy="70" r={radius} fill="none"
                stroke="currentColor" strokeOpacity="0.12" strokeWidth="10"
                className="text-(--db-text-primary)"
            />
            <circle
                cx="70" cy="70" r={radius} fill="none" stroke={GREEN} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={0} transform="rotate(-90 70 70)"
            />
            <text x="70" y="66" textAnchor="middle" fontSize="26" fontWeight="700" fill={GREEN}>100%</text>
            <text x="70" y="86" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="1" fill={GREEN} opacity="0.8">HEALTHY</text>
        </svg>
    );
}

export function SystemStatusModal({ onClose }: { onClose: () => void }) {
    useModalEsc(onClose);
    const checkedAt = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-121.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-9 pb-8 text-center">
                    <StatusRing />

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">System Status</h2>
                    <p className="text-sm font-semibold mb-6" style={{ color: GREEN }}>
                        All Systems 100% Operational
                    </p>

                    <div className="space-y-2.5 text-left">
                        {SYSTEM_SERVICES.map((svc) => (
                            <div
                                key={svc.name}
                                className="flex items-center justify-between gap-3 rounded-md px-4 py-3"
                                style={{ backgroundColor: "#5E9F620F", border: "1px solid #5E9F621F" }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="shrink-0" style={{ color: GREEN }}>{svc.icon}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-(--db-text-primary) truncate">{svc.name}</p>
                                        <p className="text-xs text-(--db-text-muted) truncate">{svc.sub}</p>
                                    </div>
                                </div>
                                <span
                                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold"
                                    style={{ backgroundColor: "#5E9F621C", color: GREEN }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full block" style={{ backgroundColor: GREEN }} />
                                    {svc.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-(--db-text-muted) mt-6">Last checked: {checkedAt}</p>
                </div>
            </div>
        </div>,
        document.body
    );
}
