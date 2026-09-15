"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import {
   PROPERTY_STATS,
   ALL_PROPERTIES,
   ALL_PROPERTY_VIEWS,
   PROPERTY_STATUS_CONFIG,
   thCls,
   tdCls,
   actionBtnCls,
   compactSelect,
   EyeIcon,
   EditIcon,
   TrashIcon,
   type PropertyStatus,
   type PropertyDetail,
   type PropertyViewRecord,
} from "../constants";
import { SelectChevron, SortIcon, SearchIcon } from "@/app/(user dashboard)/constants";
import { DeletePropertyModal } from "@/app/components/dashboard/admin-modals";
import { PropertyDetailViewDrawer } from "@/app/components/dashboard/property-detail-view-drawer";
import { CsvImportLogsModal } from "@/app/components/dashboard/csv-import-logs-modal";

type DisplayRow = {
   id?: string;
   name: string;
   district: string;
   type: string;
   price: string;
   status: PropertyStatus;
   raw?: any;
};

const PAGE_LIMIT = 10;

function mapStatus(status: any): PropertyStatus {
   const v = String(status ?? "").toLowerCase();
   if (v === "featured") return "Featured";
   if (v === "draft") return "Draft";
   return "Active";
}

function formatPrice(n: any): string {
   if (n == null || n === "") return "-";
   const num = typeof n === "number" ? n : Number(n);
   if (Number.isNaN(num)) return String(n);
   return `AED ${num.toLocaleString()}`;
}

function formatPercent(overrideVal: any, fractionVal: any): string {
   if (overrideVal != null && overrideVal !== "") {
      const n = Number(overrideVal);
      return Number.isNaN(n) ? String(overrideVal) : `${n}%`;
   }
   if (fractionVal != null && fractionVal !== "") {
      const n = Number(fractionVal);
      return Number.isNaN(n) ? String(fractionVal) : `${(n * 100).toFixed(2)}%`;
   }
   return "-";
}

function titleCase(s: string): string {
   return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalize(s: string): string {
   return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function toDisplayRow(item: any): DisplayRow {
   return {
      id: item.id,
      name: item.projectName ?? item.name ?? "",
      district: item.district ?? item.districtName ?? "",
      type: capitalize(item.propertyType ?? item.type ?? ""),
      price: formatPrice(item.displayPrice ?? item.askingPriceAed ?? item.price),
      status: mapStatus(item.status),
      raw: item,
   };
}

function toNumber(v: unknown): number | null {
   if (v == null || v === "") return null;
   const n = Number(v);
   return Number.isNaN(n) ? null : n;
}

function toViewRecord(item: any): PropertyDetail {
   const saleType = item.saleType ?? item.recentTransactions?.[0]?.saleType ?? "";
   const districtRefRaw = item.districtRef;

   return {
      name: item.projectName ?? item.name ?? "",
      district: item.district ?? item.districtName ?? "",
      type: titleCase(item.propertyType ?? item.type ?? ""),
      price: formatPrice(item.displayPrice ?? item.askingPriceAed ?? item.price),
      status: mapStatus(item.status),
      developer: item.developerName ?? item.developer ?? "-",
      beds: item.bedrooms ?? 0,
      sqft: item.landAreaSqm != null ? String(item.landAreaSqm) : (item.sqft ?? ""),
      saleType: saleType ? titleCase(saleType) : "-",
      roi: formatPercent(item.roiOverride, item.roi),
      rentalYield: formatPercent(item.rentalYieldOverride, item.rentalYield),
      description: item.description || "No description provided.",
      amenities: item.features ?? item.amenities ?? [],
      images: [item.coverImageUrl, ...(item.galleryImageUrls ?? item.images ?? [])].filter(Boolean),
      assetClass: item.assetClass ?? "-",
      community: item.community ?? "",
      layout: item.layout ?? "-",
      landAreaSqm: toNumber(item.landAreaSqm),
      bathrooms: item.bathrooms ?? 0,
      bedrooms: item.bedrooms ?? 0,
      askingPriceAed: toNumber(item.askingPriceAed),
      latestTransactionPrice: toNumber(item.latestTransactionPrice),
      transactionCount: toNumber(item.transactionCount) ?? 0,
      capRate: toNumber(item.capRate),
      yoyGrowth: toNumber(item.yoyGrowth),
      aiScore: toNumber(item.aiScore),
      isFeatured: Boolean(item.isFeatured),
      brochurePdfUrl: item.brochurePdfUrl ?? null,
      recentTransactions: Array.isArray(item.recentTransactions)
         ? item.recentTransactions.map((t: any) => ({
            id: t.id,
            saleDate: t.saleDate ?? null,
            areaSqm: toNumber(t.areaSqm),
            salePriceAed: toNumber(t.salePriceAed),
            ratePerSqm: toNumber(t.ratePerSqm),
            saleType: t.saleType ? titleCase(t.saleType) : "-",
            saleSequence: t.saleSequence ? titleCase(t.saleSequence) : "-",
         }))
         : [],
      districtRef: districtRefRaw
         ? {
            name: districtRefRaw.name ?? item.districtName ?? "-",
            status: districtRefRaw.status ?? "-",
            avgPriceSqm: toNumber(districtRefRaw.avgPriceSqmOverride ?? districtRefRaw.avgPriceSqm),
            avgRentalYield: toNumber(districtRefRaw.avgRentalYieldOverride ?? districtRefRaw.avgRentalYield),
            avgRoi: toNumber(districtRefRaw.avgRoiOverride ?? districtRefRaw.avgRoi),
            trendDirection: districtRefRaw.trendDirectionOverride ?? districtRefRaw.trendDirection ?? item.districtTrendDirection ?? "-",
            marketSignal: districtRefRaw.marketSignalOverride ?? districtRefRaw.marketSignal ?? item.districtMarketSignal ?? "-",
            appreciationPotential: districtRefRaw.appreciationPotential ?? "-",
            totalTransactions: toNumber(districtRefRaw.totalTransactions) ?? 0,
         }
         : null,
   };
}

function staticToViewRecord(v: PropertyViewRecord): PropertyDetail {
   return {
      ...v,
      assetClass: "-",
      community: "",
      layout: "-",
      landAreaSqm: null,
      bathrooms: 0,
      bedrooms: v.beds,
      askingPriceAed: null,
      latestTransactionPrice: null,
      transactionCount: 0,
      capRate: null,
      yoyGrowth: null,
      aiScore: null,
      isFeatured: v.status === "Featured",
      brochurePdfUrl: null,
      recentTransactions: [],
      districtRef: null,
   };
}

export default function PropertiesManagementPage() {
   const router = useRouter();

   const [properties, setProperties] = useState<any[]>([]);
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [stats, setStats] = useState<any>(null);
   const [refreshKey, setRefreshKey] = useState(0);
   const refresh = () => setRefreshKey((k) => k + 1);

   const [searchInput, setSearchInput] = useState("");
   const [activeSearch, setActiveSearch] = useState("");
   const [district, setDistrict] = useState("District");
   const [status, setStatus] = useState("Status");
   const [saleType, setSaleType] = useState("Sale Type");
   const [propType, setPropType] = useState("Property Type");
   const [period, setPeriod] = useState("last_year");

   const [deleteTarget, setDeleteTarget] = useState<DisplayRow | null>(null);
   const [drawerRecord, setDrawerRecord] = useState<PropertyDetail | null>(null);
   const [csvModalOpen, setCsvModalOpen] = useState(false);

   useEffect(() => {
      const t = setTimeout(() => {
         setPage(1);
         setActiveSearch(searchInput);
      }, 500);
      return () => clearTimeout(t);
   }, [searchInput]);

   useEffect(() => {
      appService.getAdminPropertiesStats().then((res) => {
         if (res?.data?.data) setStats(res.data.data);
      });
   }, [refreshKey]);

   useEffect(() => {
      appService
         .getAdminProperties(page, PAGE_LIMIT, {
            search: activeSearch || undefined,
            district: district !== "District" ? district : undefined,
            propertyType: propType !== "Property Type" ? propType : undefined,
            saleType: saleType !== "Sale Type" ? saleType.toLowerCase().replace(/\s+/g, "-") : undefined,
            status: status !== "Status" ? status.toLowerCase() : undefined,
            period: period || undefined,
         })
         .then((res) => {
            if (res?.data?.data) {
               const d = res.data.data;
               const items = Array.isArray(d) ? d : Array.isArray(d.items) ? d.items : [];
               setProperties(items);
               setTotalPages(Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? PAGE_LIMIT))));
            }
         });
   }, [page, refreshKey, activeSearch, district, status, saleType, propType, period]);

   const rows: DisplayRow[] = properties.length > 0
      ? properties.map(toDisplayRow)
      : ALL_PROPERTIES.map((p) => ({ ...p }));

   const openDrawer = (row: DisplayRow) => {
      if (row.raw) {
         if (row.id) {
            appService.getAdminPropertyById(row.id).then((res) => {
               setDrawerRecord(toViewRecord(res?.data?.data ?? row.raw));
            });
         } else {
            setDrawerRecord(toViewRecord(row.raw));
         }
         return;
      }
      const record = ALL_PROPERTY_VIEWS.find((v) => v.name === row.name);
      if (record) setDrawerRecord(staticToViewRecord(record));
   };

   const handleConfirmDelete = () => {
      if (deleteTarget?.id) {
         appService.deleteAdminPropertyById(deleteTarget.id).then((res) => {
            setDeleteTarget(null);
            if (res?.data?.success || res?.status === 200 || res?.status === 204) {
               toast.success("Property deleted, status updated to draft.");
               refresh();
            } else {
               toast.error(res?.data?.message || "Failed to delete property.");
            }
         });
      } else {
         setDeleteTarget(null);
      }
   };

   return (
      <div className="flex flex-col gap-6">

         <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
               <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                  Properties Management
               </h1>
               <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                  Manage property listings, market opportunities, and investment inventory across the platform.
               </p>
            </div>
            <div className="flex flex-wrap items-end gap-4 sm:ml-auto">
            <Button variant="primary" className="py-2.5! px-6 shrink-0" onClick={() => router.push("/properties-management/add-property")}>ADD PROPERTY</Button>
            <Button variant="secondary" onClick={() => setCsvModalOpen(true)}>IMPORT CSV</Button>
            </div>
         </div>

         {/* Stat cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PROPERTY_STATS.map((s, i) => {
               const apiValues = [
                  stats?.total != null ? String(stats.total) : null,
                  stats?.active != null ? String(stats.active) : null,
                  stats?.featured != null ? String(stats.featured) : null,
                  stats?.draft != null ? String(stats.draft) : null,
               ];
               const val = apiValues[i] ?? s.value;
               return (
                  <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                     <div className="flex items-center justify-start gap-2 mb-4">
                        <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">
                           {s.icon}
                        </div>
                        <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                     </div>
                     <AnimatedNumber value={val} className="text-2xl mb-2 mt-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-none" />
                  </div>
               );
            })}
         </div>

         {/* Search + filters */}
         <div className="md:flex grid flex-wrap justify-between bg-(--db-sidebar-bg) rounded-md p-4 items-center gap-3">
            <div className="flex flex-1 pr-1.5 max-w-99.75 items-center border border-(--db-border) rounded-sm overflow-hidden bg-(--db-main-bg)">
               <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by Property Name, District,  Developer"
                  className="flex-1 text-[11px] text-(--db-text-primary) placeholder-(--db-text-muted) bg-transparent outline-none px-3 py-2.5"
               />
               <button className="flex items-center justify-center w-6.75 h-6.75 bg-[#D28A44] hover:bg-[#0B1F3A] rounded-[3px] text-white shrink-0">
                  <SearchIcon />
               </button>
            </div>
            <div className="flex items-center overflow-x-auto gap-2 shrink-0">
               {([
                  { value: district, set: setDistrict, opts: ["District", "Yas Island", "Saadiyat Island", "Al Reem Island", "Downtown Dubai"] },
                  { value: status, set: setStatus, opts: ["Status", "Active", "Featured", "Draft"] },
                  { value: saleType, set: setSaleType, opts: ["Sale Type", "For Sale", "For Rent", "Off-Plan"] },
                  { value: propType, set: setPropType, opts: ["Property Type", "Apartment", "Villa", "Townhouse", "Penthouse"] },
               ] as const).map(({ value, set, opts }) => (
                  <div key={opts[0]} className="relative shrink-0">
                     <select
                        value={value}
                        onChange={(e) => { (set as (v: string) => void)(e.target.value); setPage(1); }}
                        className={compactSelect}
                     >
                        {opts.map((o) => <option key={o}>{o}</option>)}
                     </select>
                     <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                  </div>
               ))}
            </div>
         </div>

         {/* Property Inventory table */}
         <div className="bg-(--db-sidebar-bg) rounded-md p-5 flex flex-col gap-4">

            <div className="flex flex-wrap items-start justify-between gap-3">
               <div>
                  <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Property Inventory</h2>
                  <p className="text-[13px] text-(--db-text-primary) mt-0.5">Manage all available properties across the platform.</p>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                     <select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }} className={compactSelect}>
                        <option value="last_year">Last Year</option>
                        <option value="last_month">Last Month</option>
                        <option value="last_week">Last Week</option>
                        <option value="">All Time</option>
                     </select>
                     <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                  </div>
                  <button className="flex items-center justify-center w-9 h-9 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                     <SortIcon />
                  </button>
               </div>
            </div>

            <div className="overflow-hidden border border-(--db-border) rounded-md">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                        <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                           <th className={thCls}>Property</th>
                           <th className={thCls}>District</th>
                           <th className={thCls}>Type</th>
                           <th className={thCls}>Price</th>
                           <th className={thCls}>Status</th>
                           <th className={thCls}>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {rows.map((row, i) => {
                           const st = PROPERTY_STATUS_CONFIG[row.status];
                           return (
                              <tr key={row.id ?? i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
                                 <td className={`${tdCls} font-medium`}>{row.name}</td>
                                 <td className={tdCls}>{row.district}</td>
                                 <td className={tdCls}>{row.type}</td>
                                 <td className={tdCls}>{row.price}</td>
                                 <td className={tdCls}>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${st.bg} ${st.color}`}>
                                       <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                       {row.status}
                                    </span>
                                 </td>
                                 <td className={tdCls}>
                                    <div className="flex items-center gap-1.5">
                                       <button className={actionBtnCls} title="View" onClick={() => openDrawer(row)}><EyeIcon /></button>
                                       <button className={actionBtnCls} onClick={() => router.push(row.id ? `/properties-management/edit-property?id=${row.id}` : "/properties-management/edit-property")} title="Edit"><EditIcon /></button>
                                       <button className={actionBtnCls} title="Delete" onClick={() => setDeleteTarget(row)}><TrashIcon /></button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>

            {properties.length > 0 && (
               <div className="flex items-center justify-center gap-2">
                  <button
                     onClick={() => setPage(1)}
                     disabled={page === 1}
                     title="First page"
                     className="w-8 h-8 rounded-sm text-[15px] font-medium transition-colors text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-(--db-text-primary)"
                  >
                     «
                  </button>
                  {Array.from(
                     {
                        length: Math.min(
                           5,
                           totalPages - Math.max(1, Math.min(page - 2, totalPages - 4)) + 1
                        ),
                     },
                     (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  ).map((p) => (
                     <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-sm text-[15px] font-medium transition-colors ${page === p
                              ? "bg-[#D28A44] text-white"
                              : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                           }`}
                     >
                        {p}
                     </button>
                  ))}
                  <button
                     onClick={() => setPage(totalPages)}
                     disabled={page === totalPages}
                     title="Last page"
                     className="w-8 h-8 rounded-sm text-[15px] font-medium transition-colors text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-(--db-text-primary)"
                  >
                     »
                  </button>
               </div>
            )}

         </div>

         <DeletePropertyModal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} />
         {drawerRecord && <PropertyDetailViewDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />}
         {csvModalOpen && <CsvImportLogsModal onClose={() => { setCsvModalOpen(false); refresh(); }} />}
      </div>
   );
}
