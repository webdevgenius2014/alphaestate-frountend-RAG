"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { DealScoreGauge } from "@/app/components/dashboard/deal-analyzer-charts";
import { PropertyPerformanceChart } from "@/app/components/dashboard/property-detail-chart";
import { PROPERTY_DETAILS, SAVED_PROPERTIES } from "@/app/(user dashboard)/constants";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function BackIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function WishlistIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 13S2 9.25 2 5.5A3.5 3.5 0 0 1 8.5 3.3 3.5 3.5 0 0 1 13 5.5C13 9.25 7.5 13 7.5 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AskAIIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 11.5L2 3.5C2 2.948 2.448 2.5 3 2.5H12C12.552 2.5 13 2.948 13 3.5V9.5C13 10.052 12.552 10.5 12 10.5H4.5L2 13V11.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.5 6.5H9.5M7.5 4.5V8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1C4.791 1 3 2.791 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.791 9.209 1 7 1Z" stroke="#D28A44" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="5" r="1.5" stroke="#D28A44" strokeWidth="1.2" />
        </svg>
    );
}

const overviewLabelCls = "text-[13px] font-normal text-(--db-text-muted) py-3 pr-4 border-b border-(--db-border) last:border-0 align-top";
const overviewValueCls = "text-[13px] font-medium text-(--db-text-primary) py-3 border-b border-(--db-border) last:border-0 align-top";

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const detail = PROPERTY_DETAILS.find((p) => p.slug === id);
    const saved = SAVED_PROPERTIES.find((p) => p.slug === id);

    if (!detail || !saved) notFound();

    const router = useRouter();
    const [activeImg, setActiveImg] = useState(0);

    const overviewRows = [
        { label: "Property Type", value: saved.type },
        { label: "District", value: saved.district },
        { label: "Size", value: `${saved.sqft} sqft` },
        { label: "Price", value: saved.price },
        { label: "Sale Type", value: detail.saleType },
        { label: "Developer", value: detail.developer },
        { label: "Furnishing", value: detail.furnishing },
    ];

    const similarProps = SAVED_PROPERTIES.filter((p) => p.slug !== id).slice(0, 3);

    return (
        <div className="flex flex-col min-h-full space-y-6">

            {/* ── Back nav ── */}
            <div className="flex items-center gap-2">
                <Link
                    href="/saved"
                    className="flex items-center gap-1.5 text-sm text-(--db-text-primary) hover:text-[#D28A44] transition-colors"
                >
                    <BackIcon />
                    Back to Saved Properties
                </Link>
            </div>

            {/* ── Hero: images + AI Assessment ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

                {/* Images */}
                <div className="flex flex-col gap-2.5">
                    <div className="relative rounded-md overflow-hidden bg-(--db-border) aspect-video">
                        <img
                            src={detail.images[activeImg] ?? detail.images[0]}
                            alt={saved.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                        {detail.images.slice(1, 4).map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImg(i + 1)}
                                className={`relative rounded-md overflow-hidden aspect-video bg-(--db-border) ring-2 transition-all ${activeImg === i + 1 ? "ring-[#D28A44]" : "ring-transparent hover:ring-[#D28A44]/40"}`}
                            >
                                <img
                                    src={src}
                                    alt={`${saved.name} view ${i + 2}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Assessment */}
                <Card className="rounded-none! flex flex-col">
                    <h2 className="text-base font-semibold text-(--db-text-primary) mb-4">AI Investment Assessment</h2>

                    <div className="flex flex-col items-center mb-4">
                        <DealScoreGauge score={detail.dealScore} />
                    </div>

                    <p className="text-[13px] text-(--db-text-primary) font-normal leading-5 mb-5">
                        {detail.aiDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                        {[
                            { label: "ROI", value: saved.roi },
                            { label: "Rental Yield", value: saved.rentalYield },
                            { label: "Appreciation", value: saved.appreciation },
                            { label: "AI Score", value: saved.aiScore },
                        ].map((s) => (
                            <div key={s.label} className="bg-(--db-icon-btn-bg) rounded-xs px-3 py-2.5 text-[12px] font-medium text-(--db-text-primary)">
                                <span className="text-(--db-text-muted) font-normal">{s.label}</span>
                                <p className="text-sm font-semibold text-(--db-text-primary) mt-0.5">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2.5 mt-auto">
                        <Button variant="navy" className="w-full p-[11px_18px]! text-xs! flex items-center justify-center gap-2">
                            <WishlistIcon /> SAVE TO WISHLIST
                        </Button>
                        <ModalButton className="py-3! flex items-center justify-center gap-2">
                            <AskAIIcon /> ASK AI A QUESTION
                        </ModalButton>
                    </div>
                </Card>
            </div>

            {/* ── Investment Performance ── */}
            <Card className="rounded-none!">
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Investment Performance</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-5">12-month price trend for this property and district.</p>
                <PropertyPerformanceChart data={detail.perfData} />
            </Card>

            {/* ── District Market Intelligence ── */}
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">District Market Intelligence</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-4">Real-time market data for the {saved.district} district.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {detail.marketStats.map((stat) => (
                        <Card key={stat.label} className="rounded-none! flex items-center gap-4">
                            <div className="w-11 h-11 rounded-sm bg-[#D28A441F] flex items-center justify-center shrink-0">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[12px] text-(--db-text-muted) font-normal mb-0.5">{stat.label}</p>
                                <p className="text-sm font-semibold text-(--db-text-primary)">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* ── Feature cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {detail.features.map((feat) => (
                    <Card key={feat.title} className="rounded-none!">
                        <div className="w-13 h-13 rounded-md bg-[#D28A441F] flex items-center justify-center mb-4">
                            {feat.icon}
                        </div>
                        <h3 className="text-base font-semibold text-(--db-text-primary) mb-2">{feat.title}</h3>
                        <p className="text-[13px] text-(--db-text-primary) font-normal leading-5">{feat.description}</p>
                    </Card>
                ))}
            </div>

            {/* ── Overview + Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Property Overview */}
                <Card className="rounded-none!">
                    <h2 className="text-base font-semibold text-(--db-text-primary) mb-4">Property Overview</h2>
                    <table className="w-full">
                        <tbody>
                            {overviewRows.map((row) => (
                                <tr key={row.label}>
                                    <td className={overviewLabelCls}>{row.label}</td>
                                    <td className={overviewValueCls}>{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                {/* Location & Lifestyle */}
                <Card className="rounded-none! flex flex-col">
                    <h2 className="text-base font-semibold text-(--db-text-primary) mb-4">Location &amp; Lifestyle</h2>
                    <div className="flex-1 min-h-52 rounded-md bg-(--db-border) flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-[#D28A44]/5 to-[#0B1F3A]/10" />
                        <div className="relative flex flex-col items-center gap-2 text-(--db-text-muted)">
                            <MapPinIcon />
                            <span className="text-xs">{saved.district}, Abu Dhabi</span>
                        </div>
                    </div>
                    <p className="text-[12px] text-(--db-text-muted) mt-2">
                        Proximity to key lifestyle and business hubs across {saved.district}.
                    </p>
                </Card>
            </div>

            {/* ── Similar Investment Opportunities ── */}
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Similar Investment Opportunities</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-4">Other properties you may find interesting based on your profile.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {similarProps.map((prop) => (
                        <div key={prop.slug} className="bg-(--db-sidebar-bg) rounded-md overflow-hidden border border-[#D28A444D] p-2.5 flex flex-col">
                            <div className="relative aspect-video bg-(--db-border) overflow-hidden rounded-sm mb-2.5">
                                <img
                                    src={prop.image}
                                    alt={prop.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </div>
                            <div className="px-1 flex flex-col flex-1">
                                <h3 className="text-sm font-medium text-(--db-text-primary) mb-0.5">{prop.name}</h3>
                                <p className="text-[12px] text-[#D28A44] flex items-center gap-1 mb-2">
                                    <MapPinIcon /> {prop.district}
                                </p>
                                <div className="grid grid-cols-2 gap-1.5 mb-3">
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        ROI <b>{prop.roi}</b>
                                    </div>
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        AI <b>{prop.aiScore}</b>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-(--db-text-primary) mb-3">{prop.price}</p>
                                <div className="mt-auto">
                                    <ModalButton className="py-2.5!" onClick={() => router.push(`/saved/${prop.slug}`)}>VIEW PROPERTY</ModalButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
