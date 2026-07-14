"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import {
    SAVED_COMPARE_ROWS, SAVED_RECOMMENDATIONS,
    SavedTypeIcon, SavedBedIcon, SavedSqftIcon,
    SelectChevron,
    type SavedProperty,
    SortIcon,
    SavedLocIcon,
} from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";
import { FILTER_LABELS, FILTER_OPTIONS, LABEL_TO_KEY, type FilterState } from "@/app/constant";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

const filterSelectCls = "text-sm min-w-[98px] border border-(--db-border) rounded-md px-3 py-2 bg-(--db-main-bg) text-(--db-text-primary) outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer pr-8";

function PropertyCardSkeleton() {
    return (
        <div className="bg-(--db-main-bg) rounded-md overflow-hidden border border-[#D28A444D] p-2.5 flex flex-col animate-pulse">
            <div className="relative aspect-313/174 bg-(--db-border) overflow-hidden rounded-sm" />
            <div className="px-1.5 py-1.5 flex flex-col flex-1">
                <div className="h-4 bg-(--db-border) rounded mb-2 w-3/4" />
                <div className="h-3.5 bg-(--db-border) rounded mb-3 w-1/2" />
                <div className="flex gap-4 mb-3">
                    <div className="h-3 bg-(--db-border) rounded w-16" />
                    <div className="h-3 bg-(--db-border) rounded w-12" />
                    <div className="h-3 bg-(--db-border) rounded w-14" />
                </div>
                <div className="h-4 bg-(--db-border) rounded mb-2.5 w-2/5" />
                <div className="h-3 bg-(--db-border) rounded mb-3.75 w-1/2" />
                <div className="grid grid-cols-2 gap-1.75 mb-1.75">
                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 h-7" />
                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 h-7" />
                </div>
                <div className="grid grid-cols-2 gap-1.75 mb-3.5">
                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 h-7" />
                    <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 py-1.5 h-7" />
                </div>
                <div className="mt-auto h-10 bg-(--db-border) rounded-md" />
            </div>
        </div>
    );
}

function PropertyCard({ prop }: { prop: SavedProperty }) {
    const router = useRouter();
    return (
        <div className="bg-(--db-main-bg) rounded-md overflow-hidden border border-[#D28A444D] p-2.5 flex flex-col">
            <div className="relative aspect-313/174 bg-(--db-border) overflow-hidden">
                {prop.image && (
                    <img
                        src={prop.image}
                        alt={prop.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                )}
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
    );
}

export default function SavedPage() {
    const [properties, setProperties] = useState<SavedProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [districts, setDistricts] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterState>({
        district: "",
        propertyType: "",
        investmentSignal: "",
        marketType: "",
    });

    useEffect(() => {
        appService.getAllDistricts().then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const items = res.data?.data ?? [];
                setDistricts(
                    items.map((item: any) => typeof item === "string" ? item : item.name ?? item.district ?? "").filter(Boolean)
                );
            }
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        appService.getListingSavedProperties(1, 20, filters).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const items = res.data?.data?.items ?? [];
                setProperties(
                    items.map((item: any): SavedProperty => {
                        const p = item.property ?? {};
                        const m = p.metrics ?? {};
                        return {
                            slug: p.id,
                            name: p.projectName,
                            district: p.district,
                            image: p.coverImageUrl ?? "",
                            type: p.propertyType,
                            beds: p.layout,
                            sqft: String(p.areaSqft ?? Math.round((p.landAreaSqm ?? 0) * 10.764)),
                            price: p.priceFormatted ?? `AED ${(p.priceAed ?? 0).toLocaleString()}`,
                            roi: `${(m.roi ?? 0).toFixed(1)}%`,
                            rentalYield: `${(m.rentalYield ?? 0).toFixed(1)}%`,
                            appreciation: m.appreciationLevel ?? "N/A",
                            appreciationCls: m.appreciationLevel === "High" ? "text-green-500" : "text-yellow-500",
                            aiScore: String(m.aiScore ?? "N/A"),
                            signal: m.investmentSignal ?? "",
                            signalCls: "text-green-500",
                        };
                    })
                );
            }
            setLoading(false);
        });
    }, [filters]);

    return (
        <div className="flex flex-col min-h-full">
            <div className="flex-1 space-y-6">

                {/* ── Header ── */}
                <div className="flex items-end flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Saved Properties</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
                            Review, compare, and manage your shortlisted investment opportunities powered by AI-driven market insights.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Button
                            variant="navy"
                            className="max-w-fit p-[11px_18px]! text-xs!"
                        >
                            Compare Properties
                        </Button>
                        <ModalButton className="max-w-fit p-[11px_18px]! text-xs! uppercase">Generate PDF</ModalButton>
                    </div>
                </div>

                {/* ── Filters ── */}
                <Card className="rounded-none! p-3.75!">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex gap-2 items-center">
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                            <span className="text-sm font-medium text-(--db-text-primary) shrink-0">Filter By</span>
                        </div>
                        <div className="flex gap-1 overflow-x-auto items-center">
                            {FILTER_LABELS.map((lbl) => (
                                <div key={lbl} className="relative">
                                    <select
                                        className={filterSelectCls}
                                        aria-label={lbl}
                                        value={filters[LABEL_TO_KEY[lbl]]}
                                        onChange={(e) =>
                                            setFilters((prev) => ({ ...prev, [LABEL_TO_KEY[lbl]]: e.target.value }))
                                        }
                                    >
                                        <option value="">{lbl}</option>
                                        <option value="">All</option>
                                        {(lbl === "District" ? districts : FILTER_OPTIONS[lbl]).map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <SelectChevron />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* ── Saved Investment Opportunities ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Saved Investment Opportunities</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Your shortlisted properties ranked by AI investment performance in real time.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                            : properties.map((prop) => <PropertyCard key={prop.name} prop={prop} />)
                        }
                    </div>
                </Card>

                {/* ── Compare Saved Properties ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Compare Saved Properties</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Side-by-side comparison of appreciation potential, AI investment scores across your shortlisted properties.
                    </p>
                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full min-w-150 text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-sm font-semibold text-(--db-text-primary)">
                                    <th className="px-5.5 py-3 whitespace-nowrap w-45">
                                        Investment Metrics
                                    </th>
                                    {properties.map((p) => (
                                        <th key={p.name} className="px-5.5 py-3">
                                            {p.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {SAVED_COMPARE_ROWS.map((row) => (
                                    <tr
                                        key={row.metric}
                                        className="border-b divide-x divide-(--db-border) text-(--db-text-primary) border-(--db-border) last:border-0 hover:bg-(--db-sidebar-bg) odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium text-(--db-text-primary) whitespace-nowrap">
                                            {row.metric}
                                        </td>
                                        {row.values.map((val, j) => (
                                            <td key={j} className="px-5 py-3.5 font-medium">
                                                {val}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* ── AI Investment Recommendation ── */}
                <div className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">AI Investment Recommendation</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        AI-powered insights comparing your saved properties for the best investment outcome.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.75">
                        {SAVED_RECOMMENDATIONS.map((rec) => (
                            <Card key={rec.property} className="bg-(--db-sidebar-bg) rounded-md p-5 flex flex-col">
                                <div className="w-12.5 h-12.5 rounded-md bg-[#D28A441F] flex items-center justify-center mb-4.75">{rec.icon}</div>
                                <span className={`text-sm font-normal text-(--db-text-primary)`}>{rec.tag}</span>
                                <p className="text-sm md:text-lg font-medium text-(--db-text-primary) leading-snug mb-2 mt-1.75">{rec.property}</p>
                                <p className="text-sm font-normal text-(--db-text-primary)">{rec.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
