"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/homeComponents/Header";
import { Footer } from "@/app/components/homeComponents/Footer";
import {
    PP_TOC,
    PP_DIRECT_INFO,
    PP_AUTO_INFO,
    PP_PURPOSES,
    PP_SHARING,
    PP_CROSS_BORDER,
    PP_RIGHTS,
} from "@/app/constant";
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-white text-[15px] font-medium">{title}</h3>
            {children}
        </div>
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

export default function PrivacyPolicyPage() {
    const [activeId, setActiveId] = useState("section-1");
    const [orb, setOrb] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setOrb(true), 100);
        const interval = setInterval(() => setOrb((v) => !v), 2200);
        return () => { clearTimeout(t); clearInterval(interval); };
    }, []);

    useEffect(() => {
        const ids = PP_TOC.map((t) => `section-${t.num}`);
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
                                <h1 className="text-white text-[52px] md:text-[72px] font-semibold leading-none mb-4">Privacy Policy</h1>
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
                            <p className="text-[#FFFFFF30] text-[10px] uppercase tracking-[0.18em] font-medium mb-5">Table of Contents</p>
                            <nav className="flex flex-col">
                                {PP_TOC.map((item) => {
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
                                    This document is drafted to align with UAE Federal Decree-Law No. 45 of 2021 (PDPL) but must be reviewed by a UAE-licensed lawyer or qualified Data Protection Officer before publication, particularly Sections 6 (Cross-Border Transfers), 9 (Data Subject Rights procedures), and the appointment of a Data Protection Officer if required under Section 10.
                                </p>
                            </div>
                        </div>

                        <Divider />

                        {/* 1 */}
                        <Section id="section-1" num="01" title="Introduction">
                            <p>Estate Alpha ("we," "us," or "our") is committed to protecting the privacy of individuals who use our platform (the "Platform"). This Privacy Policy explains how we collect, use, store, share, and protect personal data, in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data ("PDPL") and other applicable laws.</p>
                            <p>This Policy applies to all Users of the Platform, including individual investors, brokers, and any visitor to our website.</p>
                        </Section>

                        <Divider />

                        {/* 2 */}
                        <Section id="section-2" num="02" title="Who We Are">
                            <p>Estate Alpha acts as the Data Controller for personal data collected through the Platform. Our contact details are provided in Section 12 below.</p>
                        </Section>

                        <Divider />

                        {/* 3 */}
                        <Section id="section-3" num="03" title="What Personal Data We Collect">
                            <p>We collect the following categories of personal data:</p>
                            <SubSection title="3.1 Information You Provide Directly">
                                <BulletList items={PP_DIRECT_INFO} />
                            </SubSection>
                            <SubSection title="3.2 Information Collected Automatically">
                                <BulletList items={PP_AUTO_INFO} />
                            </SubSection>
                            <SubSection title="3.3 Information We Do Not Collect">
                                <p>We do not collect or require sensitive personal data (such as health data, biometric data, or religious beliefs) as defined under the PDPL, except where strictly necessary and with your explicit consent (which is not currently a feature of this Platform).</p>
                            </SubSection>
                        </Section>

                        <Divider />

                        {/* 4 */}
                        <Section id="section-4" num="04" title="How We Use Your Personal Data">
                            <p>We process personal data for the following purposes and legal bases under the PDPL:</p>
                            <div className="overflow-x-auto rounded-xl border border-[#10294E]">
                                <table className="w-full text-[13px]">
                                    <thead>
                                        <tr className="bg-[#D28A4412] border-b border-[#10294E]">
                                            <th className="text-left px-5 py-3.5 text-[#D28A44] font-semibold">Purpose</th>
                                            <th className="text-left px-5 py-3.5 text-[#D28A44] font-semibold whitespace-nowrap">Legal Basis</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PP_PURPOSES.map(([purpose, basis], i) => (
                                            <tr key={i} className={`border-b border-[#10294E] last:border-0 transition-colors duration-150 hover:bg-[#D28A4408] ${i % 2 === 0 ? "bg-[#031532]" : "bg-[#040f22]"}`}>
                                                <td className="px-5 py-3.5 text-[#FFFFFFB3] leading-6 min-w-60">{purpose}</td>
                                                <td className="px-5 py-3.5 text-[#D28A44] font-medium whitespace-nowrap">{basis}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Divider />

                        {/* 5 */}
                        <Section id="section-5" num="05" title="How We Share Your Personal Data">
                            <p>We do not sell your personal data. We may share personal data with:</p>
                            <BulletList items={PP_SHARING} />
                        </Section>

                        <Divider />

                        {/* 6 */}
                        <Section id="section-6" num="06" title="Cross-Border Data Transfers">
                            <DraftNote>Confirm with counsel: identify the actual hosting/server locations and AI provider locations before finalizing this section.</DraftNote>
                            <p>Where personal data is transferred outside the UAE — for example, to cloud hosting infrastructure or third-party AI service providers located outside the UAE — we ensure such transfers comply with the PDPL&apos;s cross-border transfer requirements. This may include relying on:</p>
                            <BulletList items={PP_CROSS_BORDER} />
                        </Section>

                        <Divider />

                        {/* 7 */}
                        <Section id="section-7" num="07" title="AI Processing of Your Data">
                            <p>When you use the AI Assistant, your query and relevant account or property data may be processed by an AI/large language model service in order to generate a response. We take reasonable steps to ensure that such processing is limited to what is necessary to deliver the service, and we do not use your personal queries to train third-party AI models beyond what is necessary to operate the Platform.</p>
                            <p>Financial inputs you provide (such as purchase price or rental income for ROI calculations) are processed to generate your requested calculation and are not shared with other Users.</p>
                        </Section>

                        <Divider />

                        {/* 8 */}
                        <Section id="section-8" num="08" title="Cookies and Tracking Technologies">
                            <p>We use cookies and similar technologies to operate the Platform, remember your preferences (e.g., dark mode, language), and understand how the Platform is used. You can control cookie preferences through your browser settings. Disabling certain cookies may affect Platform functionality.</p>
                        </Section>

                        <Divider />

                        {/* 9 */}
                        <Section id="section-9" num="09" title="Your Rights as a Data Subject">
                            <p>Under the PDPL, you have the following rights regarding your personal data:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PP_RIGHTS.map((right, i) => (
                                    <div key={i} className="bg-[#031532] border border-[#10294E] rounded-xl p-4 flex gap-3 hover:border-[#D28A4430] transition-colors duration-200">
                                        <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#D28A44]" />
                                        <p className="text-[#FFFFFFB3] text-[13px] leading-6">{right}</p>
                                    </div>
                                ))}
                            </div>
                            <p>To exercise any of these rights, please contact us using the details in Section 12. We will respond within a reasonable timeframe in accordance with PDPL requirements.</p>
                        </Section>

                        <Divider />

                        {/* 10 */}
                        <Section id="section-10" num="10" title="Data Security">
                            <p>We implement technical and organizational measures designed to protect personal data against unauthorized access, loss, misuse, or alteration, including encryption of data in transit, access controls, and secure hosting infrastructure.</p>
                            <p>In the event of a data breach affecting your personal data, we will notify the UAE Data Office and affected individuals as required under the PDPL.</p>
                            <DraftNote>Confirm whether a Data Protection Officer (DPO) is required based on the scale and sensitivity of data processing, and appoint one if necessary under PDPL Article 10.</DraftNote>
                        </Section>

                        <Divider />

                        {/* 11 */}
                        <Section id="section-11" num="11" title="Data Retention">
                            <p>We retain personal data for as long as necessary to provide the Platform&apos;s services, comply with our legal obligations, resolve disputes, and enforce our agreements. Account data is generally retained for the duration of your active subscription plus [INSERT RETENTION PERIOD] thereafter, unless a longer retention period is required by law.</p>
                            <p>Upon account deletion, we will delete or anonymize your personal data within [INSERT TIMEFRAME], except where retention is required for legal, regulatory, or legitimate business purposes (e.g., financial records for tax compliance).</p>
                        </Section>

                        <Divider />

                        {/* 12 */}
                        <Section id="section-12" num="12" title="Contact Us">
                            <p>If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:</p>
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
                            <p>You may also contact the UAE Data Office directly regarding any concerns about how your personal data is processed.</p>
                        </Section>

                        <Divider />

                        {/* 13 */}
                        <Section id="section-13" num="13" title="Changes to This Policy">
                            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes via the Platform or by email prior to the changes taking effect.</p>
                        </Section>

                    </main>
                </div>

                <Footer />
            </div>
        </SmoothScroll>
    );
}
