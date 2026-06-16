"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { DealScoreGauge } from "@/app/components/dashboard/deal-analyzer-charts";
import { PropertyPerformanceChart } from "@/app/components/dashboard/property-detail-chart";
import PropertyMap from "@/app/components/dashboard/property-map";
import { PROPERTY_DETAILS, SAVED_PROPERTIES, SavedBedIcon, SavedBedIcondel, SavedLocIcon, SavedLocIcondel, SavedSqftIcon, SavedSqftIcondel, SavedTypeIcon, SavedTypeIcondel, SortIcon } from "@/app/(user dashboard)/constants";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}


const overviewLabelCls = "px-5 py-3.5 font-medium text-(--db-text-primary) whitespace-nowrap";
const overviewValueCls = "px-5 py-3.5 font-medium text-(--db-text-primary)";

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
            <div className="w-full text-(--db-text-primary)">
                <Link
                    href="/saved"
                    className="font-semibold text-sm text-[#D28A44] uppercase transition-colors"
                >
                    Back to Saved Properties
                </Link>
                <h2 className="text-[25px] font-medium mt-4.5 mb-0.5">Yas Golf Collection</h2>
                <p className="text-[23px] font-semibold">AED 2.4M</p>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

                {/* Images */}
                <div className="flex flex-col gap-4">
                    <div className="relative overflow-hidden bg-(--db-border) aspect-video">
                        <img
                            src={detail.images[activeImg] ?? detail.images[0]}
                            alt={saved.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                        {detail.images.slice(1, 5).map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImg(i + 1)}
                                className={`relative overflow-hidden aspect-video bg-(--db-border) ring-2 transition-all ${activeImg === i + 1 ? "ring-[#D28A44]" : "ring-transparent hover:ring-[#D28A44]/40"}`}
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
                    <div className="flex flex-wrap justify-between gap-3 p-5 text-lg text-(--db-text-primary) bg-(--db-sidebar-bg)">
                        <span className="flex items-center gap-4.25"><SavedLocIcondel />{saved.district}</span>
                        <span className="flex items-center gap-4.25"><SavedTypeIcondel />{saved.type}</span>
                        <span className="flex items-center gap-4.25"><SavedBedIcondel />{saved.beds}</span>
                        <span className="flex items-center gap-4.25"><SavedSqftIcondel />{saved.sqft} sqft</span>
                    </div>
                </div>

                {/* AI Assessment */}
                <Card className="rounded-none! bg-[#D28A4424]! flex flex-col">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-5">AI Investment Assessment</h2>

                    <div className="flex flex-col items-center mb-4">
                        <DealScoreGauge score={detail.dealScore} />
                    </div>

                    <span className={`text-[11px] mb-3.75 rounded-[3px] text-[#5E9F62] bg-[#5E9F622E] font-semibold px-2.5 max-w-fit inline-flex gap-1 items-center`}>
                        <span className={`w-2 h-2 rounded-full block bg-[#5E9F62]`}></span>
                        HIGH INVESTMENT POTENTIAL
                    </span>

                    <p className="text-sm text-(--db-text-primary) font-normal mb-4">
                        {detail.aiDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                        {[
                            { label: "ROI", value: saved.roi },
                            { label: "Rental Yield", value: saved.rentalYield },
                            { label: "Appreciation", value: saved.appreciation },
                            { label: "AI Score", value: saved.aiScore },
                        ].map((s) => (
                            <div key={s.label} className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                <span>{s.label}: <b>{s.value}</b></span>
                            </div>
                        ))}
                    </div>

                    <span className={`text-[10px] mb-3.75 text-(--db-text-primary) font-normal flex gap-1 items-center`}>
                        <span className={`w-2 h-2 rounded-full block bg-[#5E9F62]`}></span>
                        Strong Investment Opportunity
                    </span>

                    <div className="flex flex-col gap-2.5 mt-auto">
                        <ModalButton className="py-3! rounded-sm! uppercase"> Analyze Deal</ModalButton>
                        <ModalButton className="py-3! rounded-sm! uppercase"> ASK AI A QUESTION</ModalButton>
                    </div>
                </Card>
            </div>

            {/* ── Investment Performance ── */}
            <Card className="rounded-none!">
                <div className="flex items-end flex-wrap justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Investment Performance</h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">12-month price trend for this property and district.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <select className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none">
                            <option>Last Year</option>
                            <option>6 months</option>
                            <option>All time</option>
                        </select>
                        <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                            <SortIcon />
                        </button>
                    </div>
                </div>
                <PropertyPerformanceChart data={detail.perfData} />
            </Card>

            {/* ── District Market Intelligence ── */}
            <Card className="rounded-none!">
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">District Market Intelligence</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-4">Real-time market data for the {saved.district} district.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.25">
                    {detail.marketStats.map((stat) => (
                        <div key={stat.label} className="bg-(--db-main-bg) p-5">
                            <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">{stat.label}</p>
                            <p className="text-[19px] font-semibold text-(--db-text-primary)">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Why This Property Stands Out</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-4 max-w-225.25">Yas Golf Collection demonstrates stronger-than-average rental demand and stable appreciation momentum compared to nearby comparable developments.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {detail.features.map((feat) => (
                        <Card key={feat.title}>
                            <div className="w-12 h-12 rounded-sm bg-[#D28A441F] flex items-center justify-center mb-3.5">
                                {feat.icon}
                            </div>
                            <h3 className="text-lg font-medium text-(--db-text-primary) mb-1">{feat.title}</h3>
                            <p className="text-[13px] text-(--db-text-primary) font-normal">{feat.description}</p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* ── Overview + Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Property Overview */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-4">Property Overview</h2>
                    <div className="overflow-hidden border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-[17px] font-medium text-(--db-text-primary)">
                                    <th className="px-5.5 py-3 whitespace-nowrap font-medium">Detail</th>
                                    <th className="px-5.5 py-3 font-medium">Information</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overviewRows.map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-b border-(--db-border) divide-x divide-(--db-border) hover:bg-(--db-sidebar-bg) odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className={overviewLabelCls}>{row.label}</td>
                                        <td className={overviewValueCls}>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Location & Lifestyle */}
                <Card className="rounded-none! flex flex-col">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-4">Location &amp; Lifestyle</h2>
                    <div className="flex-1 min-h-72 rounded-md overflow-hidden">
                        <PropertyMap
                            district={saved.district}
                            label={`${saved.district} - Abu Dhabi - United Arab Emirates`}
                        />
                    </div>
                </Card>
            </div>

            {/* ── Similar Investment Opportunities ── */}
            <Card className="rounded-none!">
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Similar Investment Opportunities</h2>
                <p className="text-[13px] text-(--db-text-primary) mb-4">Other properties you may find interesting based on your profile.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {similarProps.map((prop) => (
                        <div key={prop.slug} className="bg-(--db-main-bg) rounded-md overflow-hidden border border-[#D28A444D] p-2.5 flex flex-col">
                            <div className="relative aspect-313/174 bg-(--db-border) overflow-hidden">
                                <button className="absolute right-3 top-3 w-6.5 h-6.5 flex justify-center items-center bg-[#D28A44] rounded-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                        <g clipPath="url(#clip0_1034_6404)">
                                            <path d="M10.2921 0H2.74939C2.13509 0 1.5957 0.50536 1.5957 1.10354V12.2615C1.5957 12.4618 1.65143 12.6287 1.74125 12.7576C1.84866 12.9117 2.02161 13.0001 2.20706 13C2.3824 13 2.56909 12.922 2.74148 12.7747L6.11611 9.90948C6.22033 9.82046 6.37004 9.76945 6.5257 9.76945C6.6813 9.76945 6.83071 9.82046 6.93524 9.90972L10.2986 12.7743C10.4716 12.922 10.6454 13.0001 10.8204 13.0001C11.1164 13.0001 11.4049 12.7718 11.4049 12.2616V1.10354C11.4049 0.50536 10.9064 0 10.2921 0Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1034_6404">
                                                <rect width="13" height="13" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <img
                                    src={prop.image}
                                    alt={prop.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </div>
                            <div className="px-1.5 py-1.5 flex flex-col flex-1">
                                <h3 className="text-base font-medium text-(--db-text-primary) mb-1">{prop.name}</h3>
                                <p className="text-[13px] text-[#D28A44] font-normal flex gap-1 mb-2 items-center"><SavedLocIcon /> {prop.district}</p>
                                <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-[12px] text-(--db-text-primary) mb-3">
                                    <span className="flex items-center gap-1"><SavedTypeIcon />{prop.type}</span>
                                    <span className="flex items-center gap-1"><SavedBedIcon />{prop.beds}</span>
                                    <span className="flex items-center gap-1"><SavedSqftIcon />{prop.sqft} sqft</span>
                                </div>
                                <p className="text-base font-semibold text-(--db-text-primary) mb-2.5">{prop.price}</p>
                                <span className={`text-[10px] mb-3.75 text-(--db-text-primary) font-normal flex gap-1 items-center`}>
                                    <span className={`w-2 h-2 rounded-full block bg-[#5E9F62]`}></span>
                                    Strong Investment Opportunity
                                </span>
                                <div className="grid grid-cols-2 gap-1.75 mb-1.75">
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <span>ROI <b>{prop.roi}</b></span>
                                    </div>
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <span>Rental Yield <b>{prop.rentalYield}</b></span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1.75 mb-3.5">
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <span>Appreciation <b>{prop.appreciation}</b></span>
                                    </div>
                                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <span>AI <b>{prop.aiScore}</b></span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <ModalButton className="py-3!" onClick={() => router.push(`/saved/${prop.slug}`)}>VIEW PROPERTY</ModalButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
}
