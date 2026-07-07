"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import appService from "@/app/services/appService";
import { UpgradePlanModal, type PlanSwitchTarget } from "@/app/components/dashboard/subscription-modals";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysRemaining(iso: string) {
    return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

const PLAN_META: Record<string, { description: string; cta: string; popular: boolean }> = {
    essential: {
        description: "Designed for individual investors exploring AI-powered market intelligence and basic deal validation tools.",
        cta: "GET STARTED",
        popular: false,
    },
    professional: {
        description: "Unlock deeper market analytics, AI-powered deal scoring, district comparison tools, and unlimited reporting.",
        cta: "UPGRADE NOW",
        popular: true,
    },
    enterprise: {
        description: "Built for agencies, investment firms, and professional teams requiring scalable market intelligence tools.",
        cta: "GET ENTERPRISE",
        popular: false,
    },
};

type Plan = {
    id: string;
    monthlyId: string;
    yearlyId: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    cta: string;
    popular: boolean;
    features: string[];
};

function transformPlans(data: any[]): Plan[] {
    const grouped: Record<string, Partial<Plan>> = {};

    for (const item of data) {
        const baseName = item.name.replace(/ (Monthly|Annual)$/i, "").toLowerCase();
        if (!grouped[baseName]) {
            grouped[baseName] = {
                id: baseName,
                name: item.name.replace(/ (Monthly|Annual)$/i, ""),
                features: item.featuresJson ?? [],
                monthlyId: "",
                yearlyId: "",
                ...PLAN_META[baseName],
            };
        }
        if (item.billingInterval === "monthly") {
            grouped[baseName].monthlyPrice = parseFloat(item.priceAed);
            grouped[baseName].monthlyId = item.id;
        } else if (item.billingInterval === "annual") {
            grouped[baseName].yearlyPrice = parseFloat(item.priceAed);
            grouped[baseName].yearlyId = item.id;
        }
    }

    return Object.values(grouped) as Plan[];
}

function SubscriptionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const [plans, setPlans] = useState<Plan[]>([]);
    const [mySub, setMySub] = useState<any>(null);
    const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(null);
    const [switchTarget, setSwitchTarget] = useState<PlanSwitchTarget | null>(null);

    function refreshMySubscription() {
        appService.getMySubscription().then((res) => {
            if (res?.data?.success && res.data.data) {
                setMySub(res.data.data);
            }
        });
    }

    function subscriptionPlanId(sub: any): string | null {
        return sub?.planId ?? sub?.plan?.id ?? sub?.subscriptionPlanId ?? null;
    }

    async function handlePlanSwitched(planId: string) {
        setMySub((prev: any) => (prev ? { ...prev, planId, subscriptionPlanId: planId, plan: prev.plan ? { ...prev.plan, id: planId } : prev.plan } : prev));

        for (let attempt = 0; attempt < 6; attempt++) {
            const res = await appService.getMySubscription();
            if (res?.data?.success && res.data.data && subscriptionPlanId(res.data.data) === planId) {
                setMySub(res.data.data);
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    useEffect(() => {
        appService.getSubscriptionPlans().then((res) => {
            if (res?.data?.success && Array.isArray(res.data.data)) {
                setPlans(transformPlans(res.data.data));
            }
        });
        refreshMySubscription();
    }, []);

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            toast.success("Subscription upgraded successfully!");
            router.replace("/subscription");
        }
    }, [searchParams, router]);

    const currentPlanId = mySub?.planId ?? mySub?.plan?.id ?? mySub?.subscriptionPlanId ?? null;
    const currentPlanEntry = plans.find((p) => p.monthlyId === currentPlanId || p.yearlyId === currentPlanId) ?? null;
    const currentPlanPrice = currentPlanEntry
        ? (currentPlanEntry.monthlyId === currentPlanId ? currentPlanEntry.monthlyPrice : currentPlanEntry.yearlyPrice)
        : null;

    async function handleCheckout(planId: string) {
        setCheckoutLoadingId(planId);
        const res = await appService.createCheckoutSession(planId);
        setCheckoutLoadingId(null);

        const url = typeof res?.data?.data === "string" ? res.data.data : res?.data?.data?.url;
        if (res?.data?.success && url) {
            window.location.href = url;
        } else {
            toast.error(res?.data?.message ?? "Unable to start checkout. Please try again.");
        }
    }

    function handlePlanSelect(plan: Plan, planId: string) {
        if (!planId || checkoutLoadingId) return;

        if (!currentPlanId) {
            handleCheckout(planId);
            return;
        }
        if (planId === currentPlanId) return;

        const targetPrice = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
        setSwitchTarget({
            planId,
            planName: plan.name,
            price: targetPrice,
            isUpgrade: currentPlanPrice == null || targetPrice >= currentPlanPrice,
        });
    }

    return (
        <div className="w-full">
            <div className="flex items-start flex-wrap justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Subscription Plans</h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-155">
                        Choose the right intelligence plan for your investment strategy and unlock AI-powered market analysis backed by verified ADREC transaction data.
                    </p>
                </div>
               
               
            </div>

            <div className="bg-(--db-sidebar-bg) p-5">
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1.5">Choose the Right Intelligence Plan</h2>
                <p className="text-sm text-(--db-text-primary) font-normal mb-7 max-w-150">
                    Unlock AI-powered market insights, deal validation tools, and professional investment intelligence designed for serious Abu Dhabi real estate investors.
                </p>

                <div className="inline-flex bg-(--db-main-bg) items-center rounded-[5px] p-1 border border-[#D28A44] overflow-hidden mb-6.5">
                    <button
                        onClick={() => setBilling("monthly")}
                        className={`px-5 py-1.5 text-base rounded-[5px] transition-colors ease-linear ${billing === "monthly" ? "bg-[#D28A44] text-white font-semibold" : "text-[#D28A44] font-normal"}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling("yearly")}
                        className={`px-5 py-1.5 text-base rounded-[5px] transition-colors ease-linear ${billing === "yearly" ? "bg-[#D28A44] text-white font-semibold" : "text-[#D28A44] font-normal"}`}
                    >
                        Yearly <span className="text-[11px]">(Save 20%)</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.75">
                    {plans.map((plan) => {
                        const selectedPriceId = billing === "monthly" ? plan.monthlyId : plan.yearlyId;
                        const isCurrentPlan = !!currentPlanId && currentPlanId === selectedPriceId;
                        const isLoading = checkoutLoadingId === selectedPriceId;

                        return (
                        <div
                            key={plan.id}
                            className={`relative rounded-[10px] p-6.25 hover:p-6 flex flex-col overflow-hidden border transition-all ease-linear ${plan.popular ? "bg-(--db-sub-popular-bg) border-[#D28A4466] hover:shadow-[0px_16px_36px_0px_#E8B3821A,0px_66px_66px_0px_#E8B38217,0px_148px_89px_0px_#E8B3820D,0px_262px_105px_0px_#E8B38203,0px_410px_115px_0px_#E8B38200]" : "bg-(--db-main-bg) border-[#D28A4466] hover:shadow-[0px_16px_36px_0px_#A1A1A11A,0px_65px_65px_0px_#A1A1A117,0px_147px_88px_0px_#A1A1A10D,0px_261px_105px_0px_#A1A1A103,0px_408px_114px_0px_#A1A1A100]"} ${isCurrentPlan ? "ring-2 ring-[#D28A44]" : ""}`}
                        >
                            {plan.popular && !isCurrentPlan && (
                                <div className="absolute py-15 rounded-[10px] px-9.5 pb-3.75 -top-11.25 -right-14 bg-[#D28A44] text-white text-base font-medium text-center leading-tight rotate-45">
                                    Most <br /> Popular
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-3.75">
                                <h3 className="text-[23px] font-medium text-(--db-text-primary)">{plan.name}</h3>
                                {isCurrentPlan && (
                                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm bg-[#D28A442E] text-[#D28A44]">
                                        Current Plan
                                    </span>
                                )}
                            </div>

                            <p className="mb-3.25" style={{ fontFamily: "var(--font-archivo)" }}>
                                <AnimatedNumber
                                    value={`AED ${billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}`}
                                    className="text-[30px] font-medium leading-[100%] text-[#D28A44]"
                                />
                                <span className="text-[20px] text-[#D28A44] ml-1 leading-[100%]">/ month</span>
                            </p>

                            <p className="text-[13px] text-(--db-text-primary) mb-5">{plan.description}</p>

                            {plan.popular
                                ? (
                                    <Button
                                        variant="navy"
                                        className="max-w-full! py-3.5! mb-6"
                                        disabled={isCurrentPlan || isLoading}
                                        onClick={() => handlePlanSelect(plan, selectedPriceId)}
                                    >
                                        {isCurrentPlan ? "CURRENT PLAN" : isLoading ? "PROCESSING..." : plan.cta}
                                    </Button>
                                )
                                : (
                                    <ModalButton
                                        className="mb-6 py-3.5!"
                                        disabled={isCurrentPlan || isLoading}
                                        onClick={() => handlePlanSelect(plan, selectedPriceId)}
                                    >
                                        {isCurrentPlan ? "CURRENT PLAN" : isLoading ? "PROCESSING..." : plan.cta}
                                    </ModalButton>
                                )
                            }

                            <div>
                                <p className="text-[17px] font-medium text-(--db-text-primary) mb-2">Features</p>
                                <ul className="space-y-2.5">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2.5 text-base text-(--db-text-primary)">
                                            <span className="w-2 h-2 rounded-full bg-[#D28A44] shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {switchTarget && (
                <UpgradePlanModal
                    target={switchTarget}
                    onClose={() => setSwitchTarget(null)}
                    onSuccess={handlePlanSwitched}
                />
            )}
        </div>
    );
}

export default function SubscriptionPage() {
    return (
        <Suspense fallback={null}>
            <SubscriptionPageContent />
        </Suspense>
    );
}
