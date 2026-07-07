"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import ModalButton from "@/app/components/ui/modal-button";
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

function formatDate(value: string) {
    try { return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return value; }
}

// ── Upgrade / Downgrade Plan Modal ─────────────────────────────────────────

export type PlanSwitchTarget = {
    planId: string;
    planName: string;
    price: number;
    isUpgrade: boolean;
};

export function UpgradePlanModal({ target, onClose, onSuccess }: {
    target: PlanSwitchTarget;
    onClose: () => void;
    onSuccess: (planId: string) => void;
}) {
    useModalEsc(onClose);
    const [preview, setPreview] = useState<any>(null);
    const [loadingPreview, setLoadingPreview] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;
        appService.getUpgradePreview(target.planId).then((res) => {
            if (!active) return;
            setLoadingPreview(false);
            if (res?.data?.success) {
                setPreview(res.data.data ?? null);
            } else {
                toast.error(res?.data?.message ?? "Unable to load plan change preview.");
            }
        });
        return () => { active = false; };
    }, [target.planId]);

    async function handleConfirm() {
        if (submitting) return;
        setSubmitting(true);
        const res = await appService.upgradeSubscriptionPlan(target.planId);
        setSubmitting(false);

        if (res?.data?.success) {
            toast.success(`Plan ${target.isUpgrade ? "upgraded" : "downgraded"} successfully!`);
            onSuccess(target.planId);
            onClose();
        } else {
            toast.error(res?.data?.message ?? "Unable to change your plan. Please try again.");
        }
    }

    const dueNow = preview?.amountDue ?? preview?.dueToday ?? preview?.immediateAmount ?? preview?.prorationAmount;
    const creditApplied = preview?.creditApplied ?? preview?.proratedCredit;
    const nextBillingDate = preview?.nextBillingDate ?? preview?.effectiveDate ?? preview?.nextInvoiceDate;
    const nextBillingAmount = preview?.nextBillingAmount ?? preview?.nextInvoiceAmount;

    const rows: { label: string; value: string }[] = [
        { label: "New Plan", value: preview?.planName ?? preview?.plan?.name ?? target.planName },
        dueNow != null ? { label: "Due Today", value: `AED ${dueNow}` } : null,
        creditApplied != null ? { label: "Credit Applied", value: `AED ${creditApplied}` } : null,
        nextBillingDate ? { label: "Next Billing Date", value: formatDate(nextBillingDate) } : null,
        nextBillingAmount != null ? { label: "Next Billing Amount", value: `AED ${nextBillingAmount}` } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center bg-black/80 justify-center p-4" onClick={onClose}>
            <div className="bg-(--db-modal-bg) rounded-[10px] w-full max-w-128.5 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-20">
                    <img src="/close.svg" alt="" />
                </button>

                <div className="px-7 pt-8 pb-4 text-center">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary) mb-2">
                        {target.isUpgrade ? "Upgrade" : "Downgrade"} to {target.planName}?
                    </h2>
                    <p className="text-sm text-(--db-text-primary) font-normal mb-5 max-w-97.75 mx-auto">
                        Review the billing changes below before confirming your plan {target.isUpgrade ? "upgrade" : "downgrade"}.
                    </p>

                    {loadingPreview ? (
                        <p className="text-sm text-(--db-text-primary) opacity-60 py-6">Loading preview...</p>
                    ) : (
                        <div className="bg-[#D28A442E] rounded-[7px] p-4 text-left divide-y divide-(--db-border)">
                            {rows.map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                                    <span className="text-sm text-(--db-text-primary) opacity-60 shrink-0">{label}</span>
                                    <span className="text-sm font-medium text-(--db-text-primary) text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-7 pb-7 pt-3 flex gap-3 max-w-89.25 mx-auto">
                    <button
                        onClick={handleConfirm}
                        disabled={submitting || loadingPreview}
                        className="w-full bg-[#D28A44] text-white text-sm font-semibold py-3.5 rounded-md tracking-widest hover:bg-[#b8732e] transition-colors disabled:opacity-60"
                    >
                        {submitting ? "PROCESSING..." : "CONFIRM"}
                    </button>
                    <ModalButton onClick={onClose} disabled={submitting} className="py-3.5!">CANCEL</ModalButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
