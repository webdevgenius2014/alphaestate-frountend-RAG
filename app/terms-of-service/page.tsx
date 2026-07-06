"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/homeComponents/Header";
import { Footer } from "@/app/components/homeComponents/Footer";
import { TOS_TOC, TOS_PLATFORM_FEATURES, TOS_SUBSCRIPTION_ITEMS, TOS_ACCEPTABLE_USE, TOS_DISCLAIMERS } from "@/app/constant";
import { SmoothScroll } from "../components/homeComponents/SmoothScroll";


function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-32">
            <div className="flex items-start gap-5 mb-5">
                <span className="shrink-0 text-[#D28A44] text-[13px] font-semibold tracking-wider mt-1.5">{num}</span>
                <h2 className="text-white text-[22px] md:text-[26px] font-semibold leading-tight">{title}</h2>
            </div>
            <div className="xl:pl-9 pl-4 flex flex-col gap-4 text-[#FFFFFFB3] text-[14px] leading-7 font-light">
                {children}
            </div>
        </section>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-col gap-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-[#D28A44]" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function DraftNote({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 border items-center border-[#D28A4440] bg-[#D28A4408] rounded-xl px-4 py-3.5">
            <span className="shrink-0 text-[#D28A44] text-[15px] mt-0.5">⚠</span>
            <p className="text-[#D28A44] text-[13px] leading-6">{children}</p>
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-[#10294E]" />;
}

export default function TermsOfServicePage() {
    const [activeId, setActiveId] = useState("section-1");
    const [orb, setOrb] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setOrb(true), 100);
        const interval = setInterval(() => setOrb((v) => !v), 2200);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, []);

    useEffect(() => {
        const ids = TOS_TOC.map((t) => `section-${t.num}`);
        const observers: IntersectionObserver[] = [];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
                { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    return (
        <SmoothScroll>
        <div className="bg-[#010C1B] xl:p-7.5 pt-4 pb-0 relative min-h-screen">
            <Header />

            {/* ── Hero ── */}
            <section className="relative">
                <div className="max-w-345 px-4 mx-auto mb-15">
                    <div className="relative rounded-3xl md:rounded-[30px] border border-[#1A2E47] overflow-hidden pt-44 pb-8 px-8 md:px-14">
                        {/* Animated blue orbs */}
                        <div className={`absolute w-130 h-130 rounded-full bg-[#3671c9cf] blur-[180px] opacity-25 transition-all duration-1200 ease-linear pointer-events-none ${orb ? "-top-24 -right-12" : "-bottom-24 -right-12"}`} />
                        <div className={`absolute w-100 h-100 rounded-full bg-[#3671c9cf] blur-[160px] opacity-20 transition-all duration-1500 ease-linear pointer-events-none ${orb ? "-bottom-20 -left-12" : "-top-20 -left-12"}`} />
                        {/* Amber accent glow */}
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#D28A44] blur-[150px] opacity-[0.08] pointer-events-none" />
                        {/* Dot grid overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        {/* Bottom border glow */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#D28A4430] to-transparent" />
                        {/* Content */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D28A4440] bg-[#D28A4410] mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D28A44]" />
                                <span className="text-[#D28A44] text-[12px] font-medium tracking-wide">Draft — For Legal Review</span>
                            </div>
                            <h1 className="text-white text-[52px] md:text-[72px] font-semibold leading-none mb-4">Terms of Service</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5">
                                <span className="text-[#FFFFFF50] text-[14px] font-light">Last Updated: 06/07/2026</span>
                                <span className="hidden md:block w-px h-4 bg-[#FFFFFF20]" />
                                <span className="text-[#FFFFFF50] text-[14px] font-light">Version 1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Body ── */}
            <div className="max-w-345 px-4 mx-auto flex gap-14 pb-28">

                {/* Sticky TOC */}
                <aside className="hidden xl:block w-58 shrink-0">
                    <div className="sticky top-32">
                        <p className="text-[#FFFFFF30] text-[10px] uppercase tracking-[0.18em] font-medium mb-5">
                            Table of Contents
                        </p>
                        <nav className="flex flex-col">
                            {TOS_TOC.map((item) => {
                                const isActive = activeId === `section-${item.num}`;
                                return (
                                    <a
                                        key={item.num}
                                        href={`#section-${item.num}`}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-light transition-all duration-200 group ${isActive ? "text-[#D28A44] bg-[#D28A4412]" : "text-[#FFFFFF45] hover:text-[#D28A44] hover:bg-[#D28A4408]"}`}
                                    >
                                        <span className={`text-[11px] w-5 shrink-0 transition-colors duration-200 ${isActive ? "text-[#D28A44]" : "text-[#D28A4455] group-hover:text-[#D28A44]"}`}>
                                            {item.num}
                                        </span>
                                        {item.label}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0 flex flex-col gap-10">

                    {/* Top draft warning */}
                    <div className="border border-[#D28A4450] bg-[#D28A440A] rounded-2xl p-6 flex gap-4">
                        <span className="shrink-0 text-[#D28A44] text-[20px] mt-0.5">⚠</span>
                        <div>
                            <p className="text-[#D28A44] font-semibold text-[14px] mb-1.5">DRAFT FOR LEGAL REVIEW</p>
                            <p className="text-[#FFFFFFA0] text-[13px] leading-6.5">
                                This document must be reviewed by a UAE-licensed lawyer before publication, particularly Sections 6 (Disclaimers), 7 (Limitation of Liability), and 11 (Governing Law) below.
                            </p>
                        </div>
                    </div>

                    <Divider />

                    {/* 1 */}
                    <Section id="section-1" num="01" title="Introduction and Acceptance">
                        <p>
                            These Terms of Service ("Terms") govern your access to and use of the Estate Alpha platform, website, and AI-powered services (collectively, the "Platform"), operated by Estate Alpha ("we," "us," or "our"), a business based in Abu Dhabi, United Arab Emirates.
                        </p>
                        <p>
                            By creating an account, accessing, or using the Platform, you ("you," "your," or "User") agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not access or use the Platform.
                        </p>
                        <p>
                            These Terms apply to all Users, including individual investors, licensed real estate brokers, property developers, and any other person or entity accessing the Platform.
                        </p>
                    </Section>

                    <Divider />

                    {/* 2 */}
                    <Section id="section-2" num="02" title="Description of Service">
                        <p>
                            Estate Alpha is a real estate market intelligence platform for the Abu Dhabi property market. The Platform provides:
                        </p>
                        <BulletList items={TOS_PLATFORM_FEATURES} />
                        <p>
                            The Platform is an informational and analytical tool. It is not a real estate brokerage, and we are not a licensed real estate broker, financial advisor, or legal advisor.
                        </p>
                    </Section>

                    <Divider />

                    {/* 3 */}
                    <Section id="section-3" num="03" title="Eligibility and Account Registration">
                        <p>
                            To use the Platform, you must be at least 18 years of age and capable of forming a legally binding contract under UAE law.
                        </p>
                        <p>
                            You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials and for all activity occurring under your account.
                        </p>
                        <p>
                            You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </Section>

                    <Divider />

                    {/* 4 */}
                    <Section id="section-4" num="04" title="Subscription Plans and Payment">
                        <BulletList items={TOS_SUBSCRIPTION_ITEMS} />
                    </Section>

                    <Divider />

                    {/* 5 */}
                    <Section id="section-5" num="05" title="Acceptable Use">
                        <p>You agree not to:</p>
                        <BulletList items={TOS_ACCEPTABLE_USE} />
                    </Section>

                    <Divider />

                    {/* 6 */}
                    <Section id="section-6" num="06" title="Disclaimers Regarding Data and AI Output">
                        <DraftNote>
                            This section is critical to your legal protection and must be reviewed carefully by counsel.
                        </DraftNote>
                        {TOS_DISCLAIMERS.map((item, i) => (
                            <p key={i}>
                                <span className="text-white font-medium">{item.bold} </span>
                                {item.text}
                            </p>
                        ))}
                    </Section>

                    <Divider />

                    {/* 7 */}
                    <Section id="section-7" num="07" title="Limitation of Liability">
                        <DraftNote>
                            The enforceability and appropriate scope of this section under UAE law must be confirmed by a licensed lawyer.
                        </DraftNote>
                        <p>
                            To the maximum extent permitted by applicable law, Estate Alpha, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, data, or business opportunity, arising from or related to your use of, or inability to use, the Platform, even if advised of the possibility of such damages.
                        </p>
                        <p>
                            To the maximum extent permitted by applicable law, our total aggregate liability arising out of or relating to these Terms or your use of the Platform shall not exceed the total subscription fees paid by you to Estate Alpha in the twelve (12) months preceding the event giving rise to the claim.
                        </p>
                        <p>
                            Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable UAE law.
                        </p>
                    </Section>

                    <Divider />

                    {/* 8 */}
                    <Section id="section-8" num="08" title="Intellectual Property">
                        <p>
                            The Platform, including its software, design, AI models, proprietary data-cleansing methodology, trademarks, and all other content (excluding raw government transaction data and User-submitted content), is owned by or licensed to Estate Alpha and is protected by UAE and international intellectual property laws.
                        </p>
                        <p>
                            You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal or internal business purposes, subject to these Terms. No other rights are granted.
                        </p>
                        <p>
                            You may not reproduce, distribute, modify, or create derivative works from any part of the Platform without our prior written consent.
                        </p>
                    </Section>

                    <Divider />

                    {/* 9 */}
                    <Section id="section-9" num="09" title="Reports and Exported Content">
                        <p>
                            Reports, PDFs, and other content generated through the Platform ("Generated Reports") are provided for your own use, including sharing with your clients in the ordinary course of business (e.g., a broker sharing a market report with a customer).
                        </p>
                        <p>
                            You may not resell, sublicense, or redistribute Generated Reports as a standalone data product or in competition with Estate Alpha.
                        </p>
                    </Section>

                    <Divider />

                    {/* 10 */}
                    <Section id="section-10" num="10" title="Termination">
                        <p>
                            We may suspend or terminate your access to the Platform, with or without notice, if you breach these Terms, engage in fraudulent or unlawful activity, or for any other reason at our reasonable discretion, including discontinuation of the Platform.
                        </p>
                        <p>
                            You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of the then-current billing cycle, and except as otherwise stated, no refund will be issued for the unused portion of that cycle.
                        </p>
                        <p>
                            Sections of these Terms that by their nature should survive termination (including Sections 6, 7, 8, 11, and 12) shall survive.
                        </p>
                    </Section>

                    <Divider />

                    {/* 11 */}
                    <Section id="section-11" num="11" title="Governing Law and Dispute Resolution">
                        <DraftNote>
                            To be finalized with counsel — confirm whether onshore UAE courts, DIFC Courts, or arbitration is preferred, and the appropriate Emirate/jurisdiction.
                        </DraftNote>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, specifically applicable in the Emirate of Abu Dhabi, without regard to conflict of law principles.
                        </p>
                        <p>
                            Any dispute arising out of or in connection with these Terms shall first be addressed through good-faith negotiation between the parties. If unresolved within thirty (30) days, the dispute shall be referred to [INSERT: the competent courts of Abu Dhabi / arbitration under [Centre] rules — TO BE CONFIRMED WITH COUNSEL].
                        </p>
                    </Section>

                    <Divider />

                    {/* 12 */}
                    <Section id="section-12" num="12" title="Changes to These Terms">
                        <p>
                            We may update these Terms from time to time. We will notify Users of material changes via the Platform or by email at least [INSERT NUMBER] days before the changes take effect. Continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.
                        </p>
                    </Section>

                    <Divider />

                    {/* 13 */}
                    <Section id="section-13" num="13" title="Contact">
                        <p>
                            For questions about these Terms, please contact us at: <a href="mailto:support@alphaestate.ai" className="hover:underline">support@alphaestate.ai</a> or through the contact details published on the Platform.
                        </p>
                        <div className="bg-[#031532] border border-[#10294E] rounded-2xl p-6 flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                                <span className="text-[#FFFFFF40] text-[12px] uppercase tracking-wider font-medium w-20 shrink-0">Email</span>
                                <span className="text-[#D28A44] text-[14px] font-medium"><a href="mailto:support@alphaestate.ai" className="hover:underline">support@alphaestate.ai</a></span>
                            </div>
                            <div className="h-px bg-[#10294E]" />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                                <span className="text-[#FFFFFF40] text-[12px] uppercase tracking-wider font-medium w-20 shrink-0">Address</span>
                                <span className="text-[#FFFFFFB3] text-[14px]">Abu Dhabi, United Arab Emirates</span>
                            </div>
                        </div>
                    </Section>

                </main>
            </div>

            <Footer />
        </div>
        </SmoothScroll>
    );
}
