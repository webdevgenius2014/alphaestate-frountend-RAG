"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import { BILLING_PLANS, type BillingPlan } from "@/app/(admin dashboard)/constants";

const selectCls = "w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 h-[45.6px] text-sm outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";
const inputCls = "h-auto! bg-(--db-modal-field-bg)! border-(--db-modal-field-border)! text-(--db-text-primary)! rounded-md! placeholder-(--db-text-primary)! focus:border-[#D28A44]/60!";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[17px] font-medium text-(--db-text-primary) mb-2.25">{children}</label>;
}

// ── Edit Plan Modal ───────────────────────────────────────────────────────────

export function EditPlanModal({ plan, onClose }: { plan: BillingPlan; onClose: () => void }) {
    const [status, setStatus] = useState({ active: true, hidden: false, archived: false });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div
                className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-197.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 md:px-9.5 md:pt-9.5 pt-7 pb-4 ">
                    <div className="text-center space-y-4 mb-10">
                        <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">Edit Subscription Plan</h2>
                        <p className="text-sm text-(--db-text-primary) font-normal">
                            Update pricing, features, and plan availability.
                        </p>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        <div>
                            <FieldLabel>Plan Name</FieldLabel>
                            <div className="relative">
                                <select className={selectCls}>
                                    {BILLING_PLANS.map((p) => <option key={p.name}>{p.name}</option>)}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <SelectChevron />
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel>Yearly Price</FieldLabel>
                                <Input
                                    placeholder={`AED ${parseInt(plan.price.replace(/\D/g, "")) * 10}`}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <FieldLabel>Monthly Price</FieldLabel>
                                <Input placeholder={plan.price} className={inputCls} />
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Plan Status</FieldLabel>
                            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1">
                                {(["active", "hidden", "archived"] as const).map((key) => (
                                    <label key={key} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary) cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={status[key]}
                                            onChange={() => setStatus((prev) => ({ ...prev, [key]: !prev[key] }))}
                                            className="w-4 h-4 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                        />
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <FieldLabel>Plan Features</FieldLabel>
                            <textarea
                                rows={4}
                                placeholder="Weekly Summary"
                                className="w-full bg-(--db-modal-field-bg) border border-(--db-modal-field-border) text-(--db-text-primary) rounded-md px-4 py-3 text-sm outline-none focus:border-[#D28A44]/60 transition resize-none placeholder-(--db-text-primary)"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-7 pb-7 md:px-9.5 max-w-86.5 mx-auto pt-3">
                    <ModalButton onClick={onClose}>SAVE CHANGES</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
