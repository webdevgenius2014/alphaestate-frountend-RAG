"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron, type AlertFeedItem } from "@/app/(user dashboard)/constants";

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";
const inputCls = "h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-muted)! focus:border-[#D28A44]/60!";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

function SelectField({ label, defaultValue, children }: { label: string; defaultValue?: string; children: React.ReactNode }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select className={selectCls} defaultValue={defaultValue}>{children}</select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SelectChevron />
                </span>
            </div>
        </div>
    );
}

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

const NOTIF_METHODS = ["Email Notifications", "SMS Alerts", "Push Notifications"];
const DISTRICTS = ["Yas Island", "Al Reem Island", "Saadiyat Island", "Al Khalidiyah", "Corniche", "Masdar City"];
const ALERT_TYPES = ["ROI Growth Alert", "Appreciation Opportunity", "Market Cooling Signal", "Rental Yield Spike", "Price Drop Alert"];

// ── Create Alert Modal ────────────────────────────────────────────────────

export function CreateAlertModal({ onClose }: { onClose: () => void }) {
    useModalEsc(onClose);
    const [delivery, setDelivery] = useState<Set<string>>(new Set(["Email"]));
    const toggleDelivery = (m: string) => setDelivery((prev) => {
        const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next;
    });

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-7 pb-4 text-center">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">Create AI Alert</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal">
                        Set custom investment conditions and let AI monitor<br />the market for you.
                    </p>
                </div>

                <div className="px-7 pb-4 space-y-4">
                    <SelectField label="Alert Type">
                        {ALERT_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </SelectField>
                    <SelectField label="District">
                        {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                    </SelectField>
                    <div>
                        <FieldLabel>Target Condition</FieldLabel>
                        <Input placeholder="Notify me when ROI exceeds 8%" className={inputCls} />
                    </div>
                    <div>
                        <FieldLabel>Delivery Method</FieldLabel>
                        <div className="flex flex-wrap gap-x-5 gap-y-3 mt-1">
                            {["Email", "Push Notification", "SMS"].map((m) => (
                                <label key={m} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={delivery.has(m)}
                                        onChange={() => toggleDelivery(m)}
                                        className="w-4 h-4 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>
                    </div>
                    <SelectField label="Alert Frequency">
                        <option>Immediate</option>
                        <option>Hourly Digest</option>
                        <option>Daily Summary</option>
                        <option>Weekly Summary</option>
                    </SelectField>
                </div>

                <div className="px-7 pb-7 pt-3">
                    <ModalButton>
                        ACTIVATE SMART ALERT
                    </ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Edit Alert Modal ──────────────────────────────────────────────────────

export function EditAlertModal({ alert, onClose }: { alert: AlertFeedItem; onClose: () => void }) {
    useModalEsc(onClose);
    const [delivery, setDelivery] = useState<Set<string>>(new Set(["Email"]));
    const toggleDelivery = (m: string) => setDelivery((prev) => {
        const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next;
    });

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-7 pb-4 text-center">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">Edit AI Alert</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal">
                        Set custom investment conditions and let AI monitor<br />the market for you.
                    </p>
                </div>

                <div className="px-7 pb-4 space-y-4">
                    <SelectField label="Alert Type" defaultValue={alert.type}>
                        {ALERT_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </SelectField>
                    <SelectField label="District" defaultValue={alert.district}>
                        {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                    </SelectField>
                    <div>
                        <FieldLabel>Target Condition</FieldLabel>
                        <Input placeholder="Notify me when ROI exceeds 8%" className={inputCls} />
                    </div>
                    <div>
                        <FieldLabel>Delivery Method</FieldLabel>
                        <div className="flex flex-wrap gap-x-5 gap-y-3 mt-1">
                            {["Email", "Push Notification", "SMS"].map((m) => (
                                <label key={m} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={delivery.has(m)}
                                        onChange={() => toggleDelivery(m)}
                                        className="w-4 h-4 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>
                    </div>
                    <SelectField label="Alert Frequency">
                        <option>Immediate</option>
                        <option>Hourly Digest</option>
                        <option>Daily Summary</option>
                        <option>Weekly Summary</option>
                    </SelectField>
                </div>

                <div className="px-7 pb-7 pt-3">
                    <ModalButton>SAVE CHANGES</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Delete Alert Modal ────────────────────────────────────────────────────

export function DeleteAlertModal({ alert, onClose }: { alert: AlertFeedItem; onClose: () => void }) {
    useModalEsc(onClose);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 px-7  shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="pt-8 pb-8 md:py-15.5 text-center max-w-97.5 mx-auto">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <g clipPath="url(#clip0_1218_4969)">
                                <path d="M24 0C10.7664 0 0 10.7664 0 24C0 37.2336 10.7664 48 24 48C37.2336 48 48 37.2336 48 24C48 10.7664 37.2336 0 24 0ZM24 45.4054C18.1204 45.4054 12.7875 43.0222 8.91498 39.1718C7.36859 37.6341 6.05587 35.862 5.03374 33.9144C3.47713 30.9486 2.59463 27.5756 2.59463 24C2.59463 12.197 12.197 2.59463 24 2.59463C29.5984 2.59463 34.7007 4.75596 38.5191 8.28692C40.4988 10.1174 42.1335 12.3157 43.3123 14.7728C44.6534 17.5684 45.4054 20.698 45.4054 24C45.4054 35.803 35.803 45.4054 24 45.4054Z" fill="#D28A44" />
                                <path d="M26.5359 30.4232C29.3825 31.0185 31.9395 32.6189 33.736 34.9295L35.7843 33.3371C33.611 30.5414 30.5149 28.6045 27.067 27.8833C21.5218 26.7245 15.6918 28.8648 12.2148 33.3371L14.2635 34.9295C17.1364 31.234 21.9538 29.4648 26.5359 30.4232Z" fill="#D28A44" />
                                <path d="M15.9999 21.2432C17.4329 21.2432 18.5945 20.0816 18.5945 18.6486C18.5945 17.2156 17.4329 16.054 15.9999 16.054C14.5669 16.054 13.4053 17.2156 13.4053 18.6486C13.4053 20.0816 14.5669 21.2432 15.9999 21.2432Z" fill="#D28A44" />
                                <path d="M32.0546 21.2432C33.4876 21.2432 34.6492 20.0816 34.6492 18.6486C34.6492 17.2156 33.4876 16.054 32.0546 16.054C30.6216 16.054 29.46 17.2156 29.46 18.6486C29.46 20.0816 30.6216 21.2432 32.0546 21.2432Z" fill="#D28A44" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1218_4969">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">Delete Smart Alert?</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-2">
                        This alert will be permanently removed from your active monitoring list and AI tracking system.

                        You will stop receiving notifications for this investment signal.
                    </p>
                    <div className="px-7 mt-7 flex gap-3">
                        <button
                            onClick={onClose}
                            className="w-full bg-[#CF2D48] text-white text-sm font-semibold py-3.5 rounded-md tracking-widest hover:bg-[#b8253e] transition-colors"
                        >
                            DELETE
                        </button>
                        <ModalButton onClick={onClose}> CANCEL</ModalButton>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
