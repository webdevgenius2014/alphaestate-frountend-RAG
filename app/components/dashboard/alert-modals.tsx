"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron, type AlertFeedItem } from "@/app/(user dashboard)/constants";
import Button from "../ui/button";
import appService from "@/app/services/appService";

function clearAuthCookies() {
  ["access_token", "refresh_token", "user_role"].forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  });
}

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

// ── Logout Modal ─────────────────────────────────────────────────────────

export function LogoutModal({ onClose }: { onClose: () => void }) {
    useModalEsc(onClose);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await appService.logout();
        } finally {
            clearAuthCookies();
            window.location.href = "/login";
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-1000 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 px-7 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="pt-8 pb-8 md:py-12 text-center">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <g clipPath="url(#clip0_logout)">
                                <path d="M24 0C10.7664 0 0 10.7664 0 24C0 37.2336 10.7664 48 24 48C37.2336 48 48 37.2336 48 24C48 10.7664 37.2336 0 24 0ZM24 45.4054C18.1204 45.4054 12.7875 43.0222 8.91498 39.1718C7.36859 37.6341 6.05587 35.862 5.03374 33.9144C3.47713 30.9486 2.59463 27.5756 2.59463 24C2.59463 12.197 12.197 2.59463 24 2.59463C29.5984 2.59463 34.7007 4.75596 38.5191 8.28692C40.4988 10.1174 42.1335 12.3157 43.3123 14.7728C44.6534 17.5684 45.4054 20.698 45.4054 24C45.4054 35.803 35.803 45.4054 24 45.4054Z" fill="#D28A44" />
                                <path d="M26.5359 30.4232C29.3825 31.0185 31.9395 32.6189 33.736 34.9295L35.7843 33.3371C33.611 30.5414 30.5149 28.6045 27.067 27.8833C21.5218 26.7245 15.6918 28.8648 12.2148 33.3371L14.2635 34.9295C17.1364 31.234 21.9538 29.4648 26.5359 30.4232Z" fill="#D28A44" />
                                <path d="M15.9999 21.2432C17.4329 21.2432 18.5945 20.0816 18.5945 18.6486C18.5945 17.2156 17.4329 16.054 15.9999 16.054C14.5669 16.054 13.4053 17.2156 13.4053 18.6486C13.4053 20.0816 14.5669 21.2432 15.9999 21.2432Z" fill="#D28A44" />
                                <path d="M32.0546 21.2432C33.4876 21.2432 34.6492 20.0816 34.6492 18.6486C34.6492 17.2156 33.4876 16.054 32.0546 16.054C30.6216 16.054 29.46 17.2156 29.46 18.6486C29.46 20.0816 30.6216 21.2432 32.0546 21.2432Z" fill="#D28A44" />
                            </g>
                            <defs>
                                <clipPath id="clip0_logout">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2.5 leading-8">
                        Are You Sure You Want To<br />Log Out Of Your Alpha Estate<br />Account?
                    </h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-6 max-w-sm mx-auto">
                        You'll need to sign in again to access your AI analytics, saved properties, and investment tools.
                    </p>

                    <div className="flex gap-3 max-w-79.75 mx-auto">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full bg-[#D28A44] text-white text-base font-semibold py-3 rounded-md tracking-widest hover:bg-[#b8732e] transition-colors disabled:opacity-60"
                        >
                            {loading ? "Logging out..." : "LOGOUT"}
                        </button>
                        <ModalButton onClick={onClose} className="py-3! text-base!">CANCEL</ModalButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Delete Account Modal ──────────────────────────────────────────────────

const DELETE_ACCOUNT_LOSE_ITEMS = [
    "Saved Properties",
    "AI Reports",
    "Alert Configurations",
    "Investment History",
    "Account Preferences",
];

// ── Download Report Modal ─────────────────────────────────────────────────

export type ReportRow = { name: string; type: string; district: string; date: string; status: string };

export function DownloadReportModal({ report, onClose }: { report: ReportRow; onClose: () => void }) {
    useModalEsc(onClose);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-8 pb-5 text-center">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <g clipPath="url(#clip0_1222_5343)">
                                <path d="M0.887755 48H35.7338C36.1948 48 36.5209 47.5745 36.5209 47.113V29.0996L47.678 17.9417C48.0065 17.6189 48.0114 17.091 47.689 16.7621L43.2493 12.3167C42.9155 11.991 42.3827 11.9906 42.0485 12.3159L36.5209 17.8101V9.33383C36.5299 9.11535 36.45 8.90258 36.3 8.74321L27.8649 0.270245C27.7157 0.106386 27.5075 0.00896739 27.2861 0H0.887755C0.427157 0 0.103516 0.425543 0.103516 0.886549V47.1135C0.103516 47.5745 0.427157 48 0.887755 48ZM27.538 29.9075L30.11 32.4795L26.2463 33.7712L27.538 29.9075ZM31.6537 31.6618L28.3553 28.3639L38.9482 17.7946L42.2229 21.0693L31.6537 31.6618ZM42.6644 14.087L45.9306 17.3531L43.4018 19.8876L40.1303 16.6154L42.6644 14.087ZM28.1731 2.90177L33.7186 8.45217H28.1731V2.90177ZM1.77308 1.66957H26.5035V9.33383C26.4937 9.54497 26.5724 9.75041 26.7216 9.9C26.8704 10.05 27.075 10.1303 27.2861 10.1217H34.8513V19.476L26.5606 27.7716C26.4729 27.8572 26.4077 27.9628 26.3706 28.0793L25.1935 31.6174H7.16778C6.70678 31.6174 6.333 31.9912 6.333 32.4522C6.333 32.9132 6.70678 33.287 7.16778 33.287H24.6359L24.1329 34.8106C24.0326 35.1073 24.1109 35.4359 24.3342 35.6556C24.3929 35.7143 24.4594 35.7913 24.5299 35.7913H7.16778C6.70678 35.7913 6.333 36.1651 6.333 36.6261C6.333 37.0871 6.70678 37.4609 7.16778 37.4609H29.3943C29.8557 37.4609 30.2291 37.0871 30.2291 36.6261C30.2291 36.1651 29.8557 35.7913 29.3943 35.7913H25.3569L31.919 33.6159C32.0344 33.578 32.1387 33.5116 32.2219 33.4235L34.8513 30.7728V46.3304H1.77308V1.66957Z" fill="#D28A44" />
                                <path d="M29.3953 39.9652H7.16877C6.70776 39.9652 6.33398 40.339 6.33398 40.8C6.33398 41.261 6.70776 41.6348 7.16877 41.6348H29.3953C29.8567 41.6348 30.23 41.261 30.23 40.8C30.23 40.339 29.8567 39.9652 29.3953 39.9652Z" fill="#D28A44" />
                                <path d="M7.16877 29.113H18.9605C19.4219 29.113 19.7953 28.7393 19.7953 28.2783C19.7953 27.8173 19.4219 27.4435 18.9605 27.4435H7.16877C6.70776 27.4435 6.33398 27.8173 6.33398 28.2783C6.33398 28.7393 6.70776 29.113 7.16877 29.113Z" fill="#D28A44" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1222_5343">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">Download Report</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-5 max-w-97.75 mx-auto">
                        Your market intelligence report is ready for download in PDF format.
                    </p>

                    <div className="bg-[#D28A442E] rounded-[7px] p-4 text-left">
                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-3">{report.name}</p>
                        <ul className="space-y-2">
                            <li className="text-[13px] text-(--db-text-primary) flex items-center gap-2">📋 Report Type: {report.type}</li>
                            <li className="text-[13px] text-(--db-text-primary) flex items-center gap-2">📅 Generated: {report.date}</li>
                            <li className="text-[13px] text-(--db-text-primary) flex items-center gap-2">📊 Districts Included: {report.district}</li>
                            <li className="text-[13px] text-(--db-text-primary) flex items-center gap-2">📈 Data Source: Verified ADREC Transactions</li>
                            <li className="text-[13px] text-(--db-text-primary) flex items-center gap-2">🤖 AI Insights Included</li>
                        </ul>
                    </div>
                </div>

                <div className="px-7 pb-7 pt-3 flex gap-3 max-w-89.25 mx-auto">
                    <Button onClick={onClose} variant="primary" className="py-3! max-w-fit px-3">
                        DOWNLOAD PDF
                    </Button>
                    <ModalButton onClick={onClose} className="py-3!">SHARE REPORT</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Generate Report Modal ─────────────────────────────────────────────────

export function GenerateReportModal({ reportName, onClose }: { reportName: string; onClose: () => void }) {
    useModalEsc(onClose);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-8 pb-6 text-center">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <g clipPath="url(#clip0_1222_5343)">
                                <path d="M0.887755 48H35.7338C36.1948 48 36.5209 47.5745 36.5209 47.113V29.0996L47.678 17.9417C48.0065 17.6189 48.0114 17.091 47.689 16.7621L43.2493 12.3167C42.9155 11.991 42.3827 11.9906 42.0485 12.3159L36.5209 17.8101V9.33383C36.5299 9.11535 36.45 8.90258 36.3 8.74321L27.8649 0.270245C27.7157 0.106386 27.5075 0.00896739 27.2861 0H0.887755C0.427157 0 0.103516 0.425543 0.103516 0.886549V47.1135C0.103516 47.5745 0.427157 48 0.887755 48ZM27.538 29.9075L30.11 32.4795L26.2463 33.7712L27.538 29.9075ZM31.6537 31.6618L28.3553 28.3639L38.9482 17.7946L42.2229 21.0693L31.6537 31.6618ZM42.6644 14.087L45.9306 17.3531L43.4018 19.8876L40.1303 16.6154L42.6644 14.087ZM28.1731 2.90177L33.7186 8.45217H28.1731V2.90177ZM1.77308 1.66957H26.5035V9.33383C26.4937 9.54497 26.5724 9.75041 26.7216 9.9C26.8704 10.05 27.075 10.1303 27.2861 10.1217H34.8513V19.476L26.5606 27.7716C26.4729 27.8572 26.4077 27.9628 26.3706 28.0793L25.1935 31.6174H7.16778C6.70678 31.6174 6.333 31.9912 6.333 32.4522C6.333 32.9132 6.70678 33.287 7.16778 33.287H24.6359L24.1329 34.8106C24.0326 35.1073 24.1109 35.4359 24.3342 35.6556C24.3929 35.7143 24.4594 35.7913 24.5299 35.7913H7.16778C6.70678 35.7913 6.333 36.1651 6.333 36.6261C6.333 37.0871 6.70678 37.4609 7.16778 37.4609H29.3943C29.8557 37.4609 30.2291 37.0871 30.2291 36.6261C30.2291 36.1651 29.8557 35.7913 29.3943 35.7913H25.3569L31.919 33.6159C32.0344 33.578 32.1387 33.5116 32.2219 33.4235L34.8513 30.7728V46.3304H1.77308V1.66957Z" fill="#D28A44" />
                                <path d="M29.3953 39.9652H7.16877C6.70776 39.9652 6.33398 40.339 6.33398 40.8C6.33398 41.261 6.70776 41.6348 7.16877 41.6348H29.3953C29.8567 41.6348 30.23 41.261 30.23 40.8C30.23 40.339 29.8567 39.9652 29.3953 39.9652Z" fill="#D28A44" />
                                <path d="M7.16877 29.113H18.9605C19.4219 29.113 19.7953 28.7393 19.7953 28.2783C19.7953 27.8173 19.4219 27.4435 18.9605 27.4435H7.16877C6.70776 27.4435 6.33398 27.8173 6.33398 28.2783C6.33398 28.7393 6.70776 29.113 7.16877 29.113Z" fill="#D28A44" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1222_5343">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">AI Generating Report...</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-5 max-w-98 mx-auto">
                        Analyzing verified transaction records and compiling structured market intelligence.
                    </p>

                    <div className="bg-[#D28A442E] rounded-[7px] p-4 text-left mb-6">
                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-1">{reportName}</p>
                        <p className="text-[13px] text-[#D28A44] font-medium mb-3">Generated Successfully</p>
                        <ul className="space-y-2">
                            {["248 Transactions Analyzed", "AI Market Summary Included", "Investment Signals Processed"].map((item) => (
                                <li key={item} className="text-[13px] text-(--db-text-primary) flex items-center gap-2">
                                    <span >✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="px-7 pb-7 pt-3 flex gap-3 max-w-89.25 mx-auto">
                        <Button onClick={onClose} variant="primary" className="py-3! max-w-fit px-4">
                            DOWNLOAD PDF
                        </Button>
                        <ModalButton onClick={onClose} className="py-3!">SHARE REPORT</ModalButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Delete Report Modal ───────────────────────────────────────────────────

export function DeleteReportModal({ report, onClose, onConfirm }: { report: ReportRow; onClose: () => void; onConfirm: () => void }) {
    useModalEsc(onClose);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-8 pb-8 text-center">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <g clipPath="url(#clip0_1222_5343)">
                                <path d="M0.887755 48H35.7338C36.1948 48 36.5209 47.5745 36.5209 47.113V29.0996L47.678 17.9417C48.0065 17.6189 48.0114 17.091 47.689 16.7621L43.2493 12.3167C42.9155 11.991 42.3827 11.9906 42.0485 12.3159L36.5209 17.8101V9.33383C36.5299 9.11535 36.45 8.90258 36.3 8.74321L27.8649 0.270245C27.7157 0.106386 27.5075 0.00896739 27.2861 0H0.887755C0.427157 0 0.103516 0.425543 0.103516 0.886549V47.1135C0.103516 47.5745 0.427157 48 0.887755 48ZM27.538 29.9075L30.11 32.4795L26.2463 33.7712L27.538 29.9075ZM31.6537 31.6618L28.3553 28.3639L38.9482 17.7946L42.2229 21.0693L31.6537 31.6618ZM42.6644 14.087L45.9306 17.3531L43.4018 19.8876L40.1303 16.6154L42.6644 14.087ZM28.1731 2.90177L33.7186 8.45217H28.1731V2.90177ZM1.77308 1.66957H26.5035V9.33383C26.4937 9.54497 26.5724 9.75041 26.7216 9.9C26.8704 10.05 27.075 10.1303 27.2861 10.1217H34.8513V19.476L26.5606 27.7716C26.4729 27.8572 26.4077 27.9628 26.3706 28.0793L25.1935 31.6174H7.16778C6.70678 31.6174 6.333 31.9912 6.333 32.4522C6.333 32.9132 6.70678 33.287 7.16778 33.287H24.6359L24.1329 34.8106C24.0326 35.1073 24.1109 35.4359 24.3342 35.6556C24.3929 35.7143 24.4594 35.7913 24.5299 35.7913H7.16778C6.70678 35.7913 6.333 36.1651 6.333 36.6261C6.333 37.0871 6.70678 37.4609 7.16778 37.4609H29.3943C29.8557 37.4609 30.2291 37.0871 30.2291 36.6261C30.2291 36.1651 29.8557 35.7913 29.3943 35.7913H25.3569L31.919 33.6159C32.0344 33.578 32.1387 33.5116 32.2219 33.4235L34.8513 30.7728V46.3304H1.77308V1.66957Z" fill="#D28A44" />
                                <path d="M29.3953 39.9652H7.16877C6.70776 39.9652 6.33398 40.339 6.33398 40.8C6.33398 41.261 6.70776 41.6348 7.16877 41.6348H29.3953C29.8567 41.6348 30.23 41.261 30.23 40.8C30.23 40.339 29.8567 39.9652 29.3953 39.9652Z" fill="#D28A44" />
                                <path d="M7.16877 29.113H18.9605C19.4219 29.113 19.7953 28.7393 19.7953 28.2783C19.7953 27.8173 19.4219 27.4435 18.9605 27.4435H7.16877C6.70776 27.4435 6.33398 27.8173 6.33398 28.2783C6.33398 28.7393 6.70776 29.113 7.16877 29.113Z" fill="#D28A44" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1222_5343">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">Delete Report?</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-4 max-w-98 mx-auto">
                        This report will be permanently removed from your report history and document storage.
                    </p>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-6">
                        Downloaded copies will not be affected.
                    </p>

                    <div className="flex gap-3 max-w-89.25 mx-auto">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-[#CF2D48] text-white text-sm font-semibold py-3.5 rounded-md tracking-widest hover:bg-[#b8253e] transition-colors"
                        >
                            DELETE
                        </button>
                        <ModalButton onClick={onClose} className="py-3.5!">KEEP REPORT</ModalButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function DeleteAccountModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
    useModalEsc(onClose);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>


                <div className="px-7 pt-8 pb-5 text-center">
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="22" stroke="#D28A44" strokeWidth="2.5" />
                            <circle cx="18.5" cy="21" r="2.5" fill="#D28A44" />
                            <circle cx="33.5" cy="21" r="2.5" fill="#D28A44" />
                            <path d="M17 34c2.5-5 15.5-5 18 0" stroke="#D28A44" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">
                            Are You Sure You Want To<br />Permanently Delete Your<br />Alpha Estate Account?
                        </h2>
                        <p className="text-sm text-(--db-text-primary) font-normal mb-5 max-w-97.75 mx-auto">
                            This action cannot be undone. All saved properties, AI preferences, reports, alerts, and account activity will be permanently removed.
                        </p>

                        <div className="bg-[#D28A442E] rounded-[7px] p-4 text-left">
                            <p className="text-[15px] font-medium text-(--db-text-primary) mb-2">⚠️ This Action Is Irreversible.</p>
                            <p className="text-[13px] font-medium text-[#CF2D48] mb-2">You Will Lose:</p>
                            <ul className="space-y-1.5">
                                {DELETE_ACCOUNT_LOSE_ITEMS.map((item) => (
                                    <li key={item} className="text-[13px] text-(--db-text-primary) flex items-start gap-1.5">
                                        <span className="mt-px">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="px-7 pb-7 pt-3 flex gap-3 max-w-79.75 mx-auto">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-[#CF2D48] text-white text-sm font-semibold py-3 rounded-md tracking-widest hover:bg-[#b8253e] transition-colors"
                    >
                        DELETE
                    </button>
                    <ModalButton onClick={onClose} className="py-3!">CANCEL</ModalButton>
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
                        <ModalButton onClick={onClose} className="py-3!"> CANCEL</ModalButton>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
