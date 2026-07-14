"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import {
  SAVED_COMPARE_ROWS,
  SAVED_RECOMMENDATIONS,
  SavedTypeIcon,
  SavedBedIcon,
  SavedSqftIcon,
  SelectChevron,
  type SavedProperty,
  SortIcon,
  SavedLocIcon,
} from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
      {children}
    </div>
  );
}

const filterSelectCls =
  "text-sm min-w-[98px] border border-(--db-border) rounded-md px-3 py-2 bg-(--db-main-bg) text-(--db-text-primary) outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer pr-8";

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

function PropertyCard({ prop, isSaved = false }: { prop: SavedProperty; isSaved?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    const res = saved
      ? await appService.unsaveProperty(prop.slug)
      : await appService.saveProperty(prop.slug);
    if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
      setSaved((prev) => !prev);
    }
    setSaving(false);
  }

  return (
    <div className="bg-(--db-main-bg) rounded-md overflow-hidden border border-[#D28A444D] p-2.5 flex flex-col">
      <div className="relative aspect-313/174 bg-(--db-border) overflow-hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`absolute right-3 top-3 w-6.5 h-6.5 flex justify-center items-center rounded-sm transition-colors ${saved ? "bg-[#D28A44]" : "bg-white"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <g clipPath="url(#clip0_1034_6404)">
              <path
                d="M10.2921 0H2.74939C2.13509 0 1.5957 0.50536 1.5957 1.10354V12.2615C1.5957 12.4618 1.65143 12.6287 1.74125 12.7576C1.84866 12.9117 2.02161 13.0001 2.20706 13C2.3824 13 2.56909 12.922 2.74148 12.7747L6.11611 9.90948C6.22033 9.82046 6.37004 9.76945 6.5257 9.76945C6.6813 9.76945 6.83071 9.82046 6.93524 9.90972L10.2986 12.7743C10.4716 12.922 10.6454 13.0001 10.8204 13.0001C11.1164 13.0001 11.4049 12.7718 11.4049 12.2616V1.10354C11.4049 0.50536 10.9064 0 10.2921 0Z"
                fill={saved ? "white" : "#D28A44"}
              />
            </g>
            <defs>
              <clipPath id="clip0_1034_6404">
                <rect width="13" height="13" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        {prop.image && (
          <img
            src={prop.image}
            alt={prop.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div className="px-1.5 py-1.5 flex flex-col flex-1">
        <h3 className="text-base font-medium text-(--db-text-primary) mb-1">
          {prop.name}
        </h3>
        <p className="text-[13px] text-[#D28A44] font-normal flex gap-1 mb-2 items-center">
          <SavedLocIcon /> {prop.district}
        </p>
        <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-[12px] text-(--db-text-primary) mb-3">
          <span className="flex items-center gap-1">
            <SavedTypeIcon />
            {prop.type}
          </span>
          <span className="flex items-center gap-1">
            <SavedBedIcon />
            {prop.beds}
          </span>
          <span className="flex items-center gap-1">
            <SavedSqftIcon />
            {prop.sqft} sqft
          </span>
        </div>
        <p className="text-base font-semibold text-(--db-text-primary) mb-2.5">
          {prop.price}
        </p>
        <span
          className={`text-[10px] mb-3.75 text-(--db-text-primary) font-normal flex gap-1 items-center`}
        >
          <span className={`w-2 h-2 rounded-full block bg-[#5E9F62]`}></span>
          Strong Investment Opportunity
        </span>
        <div className="grid grid-cols-2 gap-1.75 mb-1.75">
          <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
            <span>
              ROI <b>{prop.roi}</b>
            </span>
          </div>
          <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
            <span>
              Rental Yield <b>{prop.rentalYield}</b>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.75 mb-3.5">
          <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
            <span>
              Appreciation <b>{prop.appreciation}</b>
            </span>
          </div>
          <div className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
            <span>
              AI <b>{prop.aiScore}</b>
            </span>
          </div>
        </div>
        <div className="mt-auto">
          <ModalButton
            className="py-3!"
            onClick={() => router.push(`/listing/${prop.slug}`)}
          >
            VIEW PROPERTY
          </ModalButton>
        </div>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appService.getListingProperties().then((res) => {
      if (res?.status === 200 || res?.status === 201) {
        const items = res.data?.data?.items ?? [];
        setProperties(
          items.map(
            (item: any): SavedProperty => ({
              slug: item.id,
              name: item.projectName,
              district: item.districtName,
              image: item.coverImageUrl || "/property-1.png",
              type: item.propertyType,
              beds: item.layout,
              sqft: String(Math.round((item.landAreaSqm ?? 0) * 10.764)),
              price: `AED ${(item.displayPrice ?? 0).toLocaleString()}`,
              roi: `${((item.roi ?? 0) * 100).toFixed(1)}%`,
              rentalYield: `${((item.rentalYield ?? 0) * 100).toFixed(1)}%`,
              appreciation: `${((item.yoyGrowth ?? 0) * 100).toFixed(1)}%`,
              appreciationCls:
                item.districtTrendDirection === "rising"
                  ? "text-green-500"
                  : "text-yellow-500",
              aiScore: `${((item.capRate ?? 0) * 100).toFixed(1)}%`,
              signal: item.districtMarketSignal,
              signalCls:
                item.districtMarketSignal === "bullish"
                  ? "text-green-500"
                  : "text-yellow-500",
              isSaved: item.isSaved ?? false,
            } as SavedProperty & { isSaved: boolean }),
          ),
        );
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-end flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">
              Listing Properties
            </h1>
            <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
              Review, compare, and manage your investment opportunities powered
              by AI-driven market insights.
            </p>
          </div>
          {/* <div className="flex items-center gap-3 shrink-0">
                        <Button
                            variant="navy"
                            className="max-w-fit p-[11px_18px]! text-xs!"
                        >
                            Compare Properties
                        </Button>
                        <ModalButton className="max-w-fit p-[11px_18px]! text-xs! uppercase">Generate PDF</ModalButton>
                    </div> */}
        </div>

        {/* ── Filters ── */}
        <Card className="rounded-none! p-3.75!">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 items-center">
              <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                <SortIcon />
              </button>
              <span className="text-sm font-medium text-(--db-text-primary) shrink-0">
                Filter By
              </span>
            </div>
            <div className="flex gap-1 items-center">
              {(
                [
                  "District",
                  "Property Type",
                  "Investment Signal",
                  "Market Type",
                ] as const
              ).map((lbl) => (
                <div key={lbl} className="relative">
                  <select className={filterSelectCls} aria-label={lbl}>
                    <option>{lbl}</option>
                    <option>All</option>
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
          <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">
            Investment Opportunities
          </h2>
          <p className="text-[13px] text-(--db-text-primary) mb-5">
            Properties ranked by AI investment performance in real time.
          </p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {properties.map((prop) => (
                <PropertyCard key={prop.name} prop={prop} isSaved={(prop as any).isSaved} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-(--db-text-primary)">
              No data found
            </div>
          )}
        </Card>

        {/* ── Compare Saved Properties ── */}
        {/* <Card className="rounded-none!">
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
                                    {SAVED_PROPERTIES.map((p) => (
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
                </Card> */}

        {/* ── AI Investment Recommendation ── */}
        {/* <div className="rounded-none!">
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
                </div> */}
      </div>
    </div>
  );
}
