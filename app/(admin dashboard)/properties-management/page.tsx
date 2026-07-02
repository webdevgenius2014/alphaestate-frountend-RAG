"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
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
   type PropertyViewRecord,
} from "../constants";
import { SelectChevron, SortIcon, SearchIcon } from "@/app/(user dashboard)/constants";
import { DeletePropertyModal } from "@/app/components/dashboard/admin-modals";
import { PropertyDetailViewDrawer } from "@/app/components/dashboard/property-detail-view-drawer";

export default function PropertiesManagementPage() {
   const router = useRouter();
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [search, setSearch] = useState("");
   const [district, setDistrict] = useState("District");
   const [status, setStatus] = useState("Status");
   const [saleType, setSaleType] = useState("Sale Type");
   const [propType, setPropType] = useState("Property Type");
   const [period, setPeriod] = useState("Last Year");
   const [drawerRecord, setDrawerRecord] = useState<PropertyViewRecord | null>(null);

   const openDrawer = (name: string) => {
      const record = ALL_PROPERTY_VIEWS.find((v) => v.name === name);
      if (record) setDrawerRecord(record);
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
            <Button variant="primary" className="py-2.5! px-6 shrink-0" onClick={() => router.push("/properties-management/add-property")}>ADD PROPERTY</Button>
         </div>

         {/* Stat cards */}
         <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {PROPERTY_STATS.map((s) => (
               <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                  <div className="flex items-center justify-start gap-2 mb-4">
                     <div className="shrink-0 bg-[#D28A441F] p-1.75 rounded-sm">
                        {s.icon}
                     </div>
                     <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                  </div>
                  <AnimatedNumber value={s.value} className="text-2xl mb-2 mt-1 md:text-[42px] font-semibold text-(--db-text-primary) leading-none" />
               </div>
            ))}
         </div>

         {/* Search + filters */}
         <div className="flex flex-wrap justify-between bg-(--db-sidebar-bg) rounded-md p-4 items-center gap-3">
            <div className="flex flex-1 pr-1.5 max-w-99.75 items-center border border-(--db-border) rounded-sm overflow-hidden bg-(--db-main-bg)">
               <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Property Name, District,  Developer"
                  className="flex-1 text-[11px] text-(--db-text-primary) placeholder-(--db-text-muted) bg-transparent outline-none px-3 py-2.5"
               />
               <button className="flex items-center justify-center w-6.75 h-6.75 bg-[#D28A44] hover:bg-[#0B1F3A] rounded-[3px] text-white shrink-0">
                  <SearchIcon />
               </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
               {([
                  { value: district, set: setDistrict, opts: ["District", "Yas Island", "Saadiyat Island", "Al Reem Island", "Downtown Dubai"] },
                  { value: status, set: setStatus, opts: ["Status", "Active", "Featured", "Draft"] },
                  { value: saleType, set: setSaleType, opts: ["Sale Type", "For Sale", "For Rent", "Off-Plan"] },
                  { value: propType, set: setPropType, opts: ["Property Type", "Apartment", "Villa", "Townhouse", "Penthouse"] },
               ] as const).map(({ value, set, opts }) => (
                  <div key={opts[0]} className="relative shrink-0">
                     <select value={value} onChange={(e) => (set as (v: string) => void)(e.target.value)} className={compactSelect}>
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
                     <select value={period} onChange={(e) => setPeriod(e.target.value)} className={compactSelect}>
                        <option>Last Year</option>
                        <option>Last Month</option>
                        <option>Last Week</option>
                        <option>All Time</option>
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
                        {ALL_PROPERTIES.map((row, i) => {
                           const st = PROPERTY_STATUS_CONFIG[row.status];
                           return (
                              <tr key={i} className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors">
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
                                       <button className={actionBtnCls} title="View" onClick={() => openDrawer(row.name)}><EyeIcon /></button>
                                       <button className={actionBtnCls} onClick={() => router.push("/properties-management/edit-property")} title="Edit"><EditIcon /></button>
                                       <button className={actionBtnCls} title="Delete" onClick={() => setDeleteOpen(true)}><TrashIcon /></button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>

         <DeletePropertyModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} />
         {drawerRecord && <PropertyDetailViewDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />}
      </div>
   );
}
