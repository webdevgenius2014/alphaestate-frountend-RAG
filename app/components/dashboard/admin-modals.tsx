"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron, SecurityEyeIcon, SecurityEyeOffIcon } from "@/app/(user dashboard)/constants";
import { DELETE_USER_LOSE_ITEMS } from "@/app/(admin dashboard)/constants";

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

function useModalEsc(onClose: () => void) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);
}



// ── Delete User Modal ─────────────────────────────────────────────────────────

export function DeleteUserModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm?: () => void }) {
    useModalEsc(onClose);
    if (!isOpen) return null;

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

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">Delete User Account?</h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-5 max-w-97.75 mx-auto">
                        You are about to permanently delete this user account from Alpha Estate. This action cannot be undone.
                    </p>

                    <div className="bg-[#D28A442E] rounded-[7px] p-4 text-left mb-1">
                        <p className="text-[15px] font-medium text-(--db-text-primary) mb-2">⚠️ What Will Be Removed</p>
                        <ul className="space-y-1.5">
                            {DELETE_USER_LOSE_ITEMS.map((item) => (
                                <li key={item} className="text-[13px] text-(--db-text-primary) flex items-start gap-1.5">
                                    <span className="mt-px">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="px-7 pb-7 pt-3 flex gap-3 max-w-79.75 mx-auto">
                    <button
                        onClick={onConfirm ?? onClose}
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

// ── Delete Property Modal ─────────────────────────────────────────────────────

export function DeletePropertyModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm?: () => void }) {
    useModalEsc(onClose);
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-10 pb-10 flex flex-col items-center text-center">
                    <div className="w-21.75 h-21.75 rounded-[10px] bg-[#D28A441F] flex items-center justify-center mb-5">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="26" cy="26" r="22" stroke="#D28A44" strokeWidth="2.5" />
                            <circle cx="18.5" cy="21" r="2.5" fill="#D28A44" />
                            <circle cx="33.5" cy="21" r="2.5" fill="#D28A44" />
                            <path d="M17 34c2.5-5 15.5-5 18 0" stroke="#D28A44" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">Delete Property?</h2>
                    <p className="text-[17px] text-(--db-text-primary) font-normal leading-normal mb-7 max-w-106.25">
                        This property will be removed from Alpha Estate and will no longer appear in user dashboards, saved properties, or investment comparisons. This action cannot be undone.
                    </p>

                    <div className="flex gap-3 w-full max-w-79.75">
                        <button
                            onClick={onConfirm ?? onClose}
                            className="flex-1 bg-[#CF2D48] text-white text-sm font-semibold py-3 rounded-sm tracking-widest hover:bg-[#b8253e] transition-colors uppercase"
                        >
                            DELETE
                        </button>
                        <ModalButton onClick={onClose} className="flex-1 py-3! rounded-sm!">CANCEL</ModalButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Change Password Modal ─────────────────────────────────────────────────────

export function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    useModalEsc(onClose);
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const [vals, setVals] = useState({ current: "", next: "", confirm: "" });

    const toggle = (k: keyof typeof show) => setShow((p) => ({ ...p, [k]: !p[k] }));
    const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setVals((p) => ({ ...p, [k]: e.target.value }));

    const fieldCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 text-sm outline-none focus:border-[#D28A44]/60 transition placeholder-(--db-text-muted)";

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-100.75 shadow-2xl relative px-7 pt-8 pb-7"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <h2 className="text-[25px] font-medium text-(--db-text-primary) text-center mb-6">Password Security</h2>

                <div className="space-y-4 mb-6">
                    {([
                        { key: "current", label: "Current Password" },
                        { key: "next",    label: "New Password" },
                        { key: "confirm", label: "Confirm New Password" },
                    ] as { key: keyof typeof vals; label: string }[]).map(({ key, label }) => (
                        <div key={key}>
                            <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{label}</label>
                            <div className="relative">
                                <input
                                    type={show[key] ? "text" : "password"}
                                    value={vals[key]}
                                    onChange={set(key)}
                                    placeholder="••••••••••••••••"
                                    className={fieldCls}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggle(key)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--db-text-muted) hover:text-(--db-text-primary) transition-colors"
                                >
                                    {show[key] ? <SecurityEyeOffIcon /> : <SecurityEyeIcon />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <ModalButton className="max-w-fit px-4 py-3!">UPDATE PASSWORD</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── Suspend User Modal ────────────────────────────────────────────────────────

export function SuspendUserModal({ isOpen, onClose, onConfirm, userName, userEmail, userStatus }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    userName: string;
    userEmail: string;
    userStatus: "active" | "suspended";
}) {
    useModalEsc(onClose);
    if (!isOpen) return null;

    const initials = userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 px-7 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="pt-8 pb-8 md:py-10 text-center w-full">
                    {/* Sad-face icon */}
                    <div className="w-21.75 h-21.75 rounded-[7px] bg-[#D28A441F] flex items-center justify-center mx-auto mb-5">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="21.5" stroke="#D28A44" strokeWidth="2.5" />
                            <circle cx="17" cy="19" r="2.5" fill="#D28A44" />
                            <circle cx="31" cy="19" r="2.5" fill="#D28A44" />
                            <path d="M16 33 Q24 27 32 33" stroke="#D28A44" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                        </svg>
                    </div>

                    <div className="max-w-95.5 mx-auto">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-3">Suspend User Account?</h2>
                        <p className="text-sm text-(--db-text-primary) font-normal mb-5 leading-relaxed">
                            This user will temporarily lose access to Alpha Estate and will not be able to log in or use any platform features until the account is reactivated.
                        </p>
                    </div>
                    {/* User card */}
                    <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                        <div className="flex  gap-4 bg-(--db-drawer-header-bg) p-4 mb-5">
                            <div className="w-21.5 h-21.5 rounded-full flex items-center justify-center shrink-0">
                                <img src="/favicon.ico" alt="" />
                            </div>
                            <div className="min-w-0 my-auto">
                                <p className="font-medium text-(--db-text-primary) text-lg leading-tight">{userName}</p>
                                <p className="text-sm text-(--db-text-primary) mt-0.5">{userEmail}</p>
                            </div>
                            <span className="ml-auto mt-0 mb-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#5E9F622E] text-[#5E9F62]">
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {userStatus === "active" ? "Active" : "Suspended"}
                            </span>
                        </div>

                        {/* Reason dropdown */}
                        <div className="text-left mb-7">
                            <FieldLabel>Select Reason</FieldLabel>
                            <div className="relative">
                                <select className={selectCls}>
                                    <option>Violation of Terms</option>
                                    <option>Suspicious Activity</option>
                                    <option>Payment Issue</option>
                                    <option>User Request</option>
                                    <option>Other</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-3 max-w-95.5 mx-auto">
                        <button
                            onClick={onConfirm ?? onClose}
                            className="w-full bg-[#CF2D48] text-white text-sm font-semibold py-3.5 rounded-md tracking-widest hover:bg-[#b8253e] transition-colors"
                        >
                            SUSPEND ACCOUNT
                        </button>
                        <ModalButton onClick={onClose} className="py-3!">CANCEL</ModalButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
