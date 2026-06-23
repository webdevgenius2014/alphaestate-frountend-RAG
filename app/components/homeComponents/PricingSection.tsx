"use client";

import { useState } from "react";
import Button from "../ui/button";
import { CheckIcon, plans } from "@/app/constant";

export const PricingSection = () => {
    const [yearly, setYearly] = useState(false);

    return (
        <div className="bg-[linear-gradient(180deg,#010C1B_0%,#021126F5_100%)] -mx-7.5">
            <section className="w-full max-w-345 mx-auto px-4 py-24 relative z-1">
                {/* Badge */}
                <div className="flex justify-center mb-6.75">
                    <div className="inline-flex items-center gap-2 border border-[#0E2445] rounded-full px-9.25 py-3 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                        <span className="text-white text-base uppercase font-normal leading-6">Pricing</span>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-center text-white text-[32px] md:text-[36px] font-semibold leading-[100%] mb-3">
                    Choose the Plan That Fits Your Investment Journey
                </h2>

                {/* Subtitle */}
                <p className="text-center text-[#FFFFFF99] text-[15px] leading-7 font-light mb-7.25 max-w-152.75 mx-auto">
                    Flexible plans designed to give investors access to AI-powered market intelligence, deal analysis, and professional reporting tools.
                </p>

                <div className="flex justify-center mb-11">
                    <div className="inline-flex items-center gap-3.5 border border-[#0E2445] rounded-full px-3 py-3 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                        {/* Monthly */}
                        <button
                            type="button"
                            onClick={() => setYearly(false)}
                            className="flex items-center gap-2 rounded-full transition-colors duration-200"
                        >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0 ${!yearly ? "border-[#D28A44] " : "border-[#FFFFFF44] bg-transparent"}`}>
                                {!yearly && <span className="w-2 h-2 rounded-full bg-[#D28A44]" />}
                            </span>
                            <span className={`text-[15px] font-medium transition-colors duration-200 ${!yearly ? "text-white" : "text-white"}`}>Monthly</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setYearly(true)}
                            className="flex items-center gap-2 rounded-full transition-colors duration-200"
                        >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0 ${yearly ? "border-[#D28A44]" : "border-[#FFFFFF44] bg-transparent"}`}>
                                {yearly && <span className="w-2 h-2 rounded-full bg-[#D28A44]" />}
                            </span>
                            <span className={`text-[15px] font-medium transition-colors duration-200 ${yearly ? "text-white" : "text-white"}`}>Yearly</span>
                            <span className="text-[11px] mt-1 text-[#D28A44]">(Save 20%)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col relative rounded-[30px] overflow-hidden p-6.25 pb-8.25 border transition-all duration-300 ${plan.highlight
                                ? "bg-[#05132733] border-[#272727]"
                                : "bg-[#05132733] border-[#272727]"
                                }`}
                        >

                            <div className={`absolute top-0 z-1 left-14 w-73.5 h-75.75 rounded-full bg-[#12458D99] blur-[144px] ${plan.highlight ? "pricing-blob-2" : "pricing-blob"}`} />
                            
                            <p className="text-white relative z-1 text-[23px] font-medium mb-3.75">{plan.name}</p>
                            <div className="flex relative z-1 items-baseline gap-1 text-[30px] text-white leading-none mb-3.5 font-medium ">
                                <span>AED</span>
                                <span className="leading-none">
                                    {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-[20px]">/ month</span>
                            </div>
                            <p className="text-[#FFFFFFCC] relative z-1 text-[13px] font-light leading-6.25 mb-7.25">{plan.tagline}</p>


                            <div className="w-full relative z-4 mb-5.5">
                                {plan.highlight ? (
                                    <button
                                        type="button"
                                        className="px-3.75 w-full py-4 text-white text-base font-bold uppercase rounded-[64px] border border-solid border-[#ffffff66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:bg-[#D28A44] hover:border-[#D28A44] hover:text-white ease-linear transition-colors duration-200"
                                    >
                                        {plan.cta}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="px-3.75 w-full py-4 text-white text-base font-bold uppercase rounded-[64px] border border-solid border-[#ffffff66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:bg-[#D28A44] hover:border-[#D28A44] hover:text-white ease-linear transition-colors duration-200"
                                    >
                                        {plan.cta}
                                    </button>
                                )}
                            </div>

                            <p className="text-[#FFFFFF] text-[17px] leading-[100%] font-medium mb-3">Features</p>
                            <ul className="flex flex-col">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5">
                                        <CheckIcon />
                                        <span className="text-[#FFFFFF80] text-base font-light leading-9.75">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                @keyframes triangleOrbit {
                    0%, 100% { transform: translate(0px,   0px);   }
                    33%      { transform: translate(160px, 220px);  }
                    66%      { transform: translate(-130px, 220px); }
                }
                .pricing-blob {
                    animation: triangleOrbit 9s ease-in-out infinite;
                }

                @keyframes figure8Orbit {
                    0%, 100% { transform: translate(0px,    0px);   }
                    25%      { transform: translate(160px,  130px);  }
                    50%      { transform: translate(0px,    0px);    }
                    75%      { transform: translate(-160px, 130px);  }
                }
                .pricing-blob-2 {
                    animation: figure8Orbit 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
