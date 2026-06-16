"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { SUB_PLANS } from "@/app/(user dashboard)/constants";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";

const CURRENT_PLAN = "essential";
const EXPIRY_DATE = "02 Jan 2026";
const DAYS_LEFT = 20;

export default function SubscriptionPage() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    return (
        <div className="w-full">
            <div className="flex items-start flex-wrap justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Subscription Plans</h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-155">
                        Choose the right intelligence plan for your investment strategy and unlock AI-powered market analysis backed by verified ADREC transaction data.
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-sm text-(--db-text-primary)">
                        Your Current Plan{" "}
                        <span className="text-[#D28A44] font-semibold">{CURRENT_PLAN.toUpperCase()}</span>
                    </p>
                    <p className="text-sm text-(--db-text-primary) mt-1 font-normal">
                        Expires on{" "}
                        <span>{EXPIRY_DATE} ({DAYS_LEFT} days remaining)</span>
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
                    {SUB_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-[10px] p-6.25 hover:p-6 flex flex-col overflow-hidden border transition-all ease-linear ${plan.popular ? "bg-(--db-sub-popular-bg) border-[#D28A4466] hover:shadow-[0px_16px_36px_0px_#E8B3821A,0px_66px_66px_0px_#E8B38217,0px_148px_89px_0px_#E8B3820D,0px_262px_105px_0px_#E8B38203,0px_410px_115px_0px_#E8B38200]" : "bg-(--db-main-bg) border-[#D28A4466] hover:shadow-[0px_16px_36px_0px_#A1A1A11A,0px_65px_65px_0px_#A1A1A117,0px_147px_88px_0px_#A1A1A10D,0px_261px_105px_0px_#A1A1A103,0px_408px_114px_0px_#A1A1A100]"}`}
                        >
                            {plan.popular && (
                                <div className="absolute py-15 rounded-[10px] px-9.5 pb-3.75 -top-11.25 -right-14 bg-[#D28A44] text-white text-base font-medium text-center leading-tight rotate-45">
                                    Most <br /> Popular
                                </div>
                            )}

                            <h3 className="text-[23px] font-medium text-(--db-text-primary) mb-3.75">{plan.name}</h3>

                            <p className="mb-3.25" style={{ fontFamily: "var(--font-archivo)" }}>
                                <AnimatedNumber
                                    value={`AED ${billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}`}
                                    className="text-[30px] font-medium leading-[100%] text-[#D28A44]"
                                />
                                <span className="text-[20px] text-[#D28A44] ml-1 leading-[100%]">/ month</span>
                            </p>

                            <p className="text-[13px] text-(--db-text-primary) mb-5">{plan.description}</p>

                            {plan.popular
                                ? <Button variant="navy" className="max-w-full! py-3.5! mb-6">{plan.cta}</Button>
                                : <ModalButton className="mb-6 py-3.5!">{plan.cta}</ModalButton>
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
                    ))}
                </div>
            </div>
        </div>
    );
}
