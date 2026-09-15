"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import type { PropertyDetail } from "@/app/(admin dashboard)/constants";
import {
    PROPERTY_STATUS_CONFIG,
    LocationPinIcon,
    PropertyTypeIcon,
    BedroomIcon,
    AreaIcon,
    AmenityCheckIcon,
} from "@/app/(admin dashboard)/constants";

interface Props {
    record: PropertyDetail;
    onClose: () => void;
}

function formatAed(v: number | null): string {
    if (v == null) return "-";
    return `AED ${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPct(v: number | null): string {
    if (v == null) return "-";
    return `${Number(v).toFixed(1)}%`;
}

function titleCase(s: string | null | undefined): string {
    if (!s) return "-";
    return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(v: string | null): string {
    if (!v) return "-";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
}

export function PropertyDetailViewDrawer({ record, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const st = PROPERTY_STATUS_CONFIG[record.status];
    const images = record.images.length > 0 ? record.images : ["/property-1.png"];

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        setMounted(true);
        const id = setTimeout(() => setVisible(true), 16);
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setVisible(false); setTimeout(onClose, 300); }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            clearTimeout(id);
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-80" : "opacity-0"}`}
                onClick={handleClose}
            />

            {/* Drawer panel */}
            <div className={`absolute right-0 top-0 bottom-0 w-full max-w-121.25 bg-(--db-modal-bg) flex flex-col shadow-2xl transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}>

                <div className="flex items-center px-5 pt-6 pb-4.5">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary)">Property Detail</h2>
                    <button onClick={handleClose} className="absolute top-4 right-4 z-20">
                        <img src="/close.svg" alt="" />
                    </button>
                </div>

                <div className="overflow-y-auto thin-scroll">

                    {/* Image slider */}
                    <div className="w-full h-63.25 bg-(--db-sidebar-bg) px-5 rounded-md shrink-0 overflow-hidden relative">
                        <Swiper
                            onSwiper={setSwiper}
                            loop={images.length > 1}
                            className="w-full h-full"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img src={img} alt={record.name} className="w-full h-full object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => swiper?.slidePrev()}
                                    className="absolute left-8 top-1/2 -translate-y-1/2 w-5.25 h-5.25 rounded-sm border-2 border-(--db-border) bg-(--db-main-bg) flex items-center justify-center transition-colors z-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                        <path d="M8.12042 9.99066C8.22951 9.99306 8.33665 9.96143 8.42692 9.90013C8.5172 9.83882 8.58613 9.75087 8.62414 9.64858C8.66215 9.54629 8.66734 9.43472 8.63899 9.32934C8.61064 9.22396 8.55017 9.13008 8.46597 9.06066L5.25342 6.30852L8.46597 3.55734C8.52422 3.51453 8.57299 3.46019 8.60925 3.39766C8.64551 3.33513 8.66846 3.26576 8.67668 3.19395C8.68489 3.12214 8.67819 3.04942 8.65699 2.98032C8.6358 2.91121 8.60056 2.84721 8.55349 2.79235C8.50642 2.7375 8.44854 2.693 8.38345 2.66156C8.31837 2.63011 8.2475 2.61245 8.17527 2.60966C8.10304 2.60687 8.03102 2.61899 7.96371 2.64533C7.89639 2.67167 7.83524 2.71162 7.78409 2.76268L4.10601 5.90964C4.04825 5.95893 4.00187 6.02011 3.97007 6.08907C3.93826 6.15802 3.92179 6.23307 3.92179 6.309C3.92179 6.38493 3.93826 6.45998 3.97007 6.52893C4.00187 6.59789 4.04825 6.65913 4.10601 6.70842L7.78409 9.85841C7.877 9.94093 7.99618 9.98773 8.12042 9.99066Z" fill="#D28A44" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => swiper?.slideNext()}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 w-5.25 h-5.25 rounded-sm border-2 border-(--db-border) bg-(--db-main-bg) flex items-center justify-center transition-colors z-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" className="rotate-180" viewBox="0 0 13 13" fill="none">
                                        <path d="M8.12042 9.99066C8.22951 9.99306 8.33665 9.96143 8.42692 9.90013C8.5172 9.83882 8.58613 9.75087 8.62414 9.64858C8.66215 9.54629 8.66734 9.43472 8.63899 9.32934C8.61064 9.22396 8.55017 9.13008 8.46597 9.06066L5.25342 6.30852L8.46597 3.55734C8.52422 3.51453 8.57299 3.46019 8.60925 3.39766C8.64551 3.33513 8.66846 3.26576 8.67668 3.19395C8.68489 3.12214 8.67819 3.04942 8.65699 2.98032C8.6358 2.91121 8.60056 2.84721 8.55349 2.79235C8.50642 2.7375 8.44854 2.693 8.38345 2.66156C8.31837 2.63011 8.2475 2.61245 8.17527 2.60966C8.10304 2.60687 8.03102 2.61899 7.96371 2.64533C7.89639 2.67167 7.83524 2.71162 7.78409 2.76268L4.10601 5.90964C4.04825 5.95893 4.00187 6.02011 3.97007 6.08907C3.93826 6.15802 3.92179 6.23307 3.92179 6.309C3.92179 6.38493 3.93826 6.45998 3.97007 6.52893C4.00187 6.59789 4.04825 6.65913 4.10601 6.70842L7.78409 9.85841C7.877 9.94093 7.99618 9.98773 8.12042 9.99066Z" fill="#D28A44" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-3.25 px-5 py-5">

                        {/* Name + status */}
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[19px] font-medium text-(--db-text-primary)">{record.name}</h3>
                            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${st.bg} ${st.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                {record.status}{record.isFeatured && record.status !== "Featured" ? " · Featured" : ""}
                            </span>
                        </div>

                        {/* Developer + community */}
                        <p className="text-[13px] font-normal text-(--db-text-primary) -mt-2">
                            {record.developer}{record.community ? ` · ${record.community}` : ""}
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-4 justify-between gap-y-2 text-sm text-(--db-text-primary)">
                            <span className="flex items-center gap-1.5"><LocationPinIcon />{record.district}</span>
                            <span className="flex items-center gap-1.5"><PropertyTypeIcon />{record.type}</span>
                            <span className="flex items-center gap-1.5"><BedroomIcon />{record.beds} Bed</span>
                            <span className="flex items-center gap-1.5"><AreaIcon />{record.sqft} sqft</span>
                        </div>

                        {/* Price */}
                        <p className="text-base font-medium text-[#D28A44]">{record.price}</p>

                        {/* Stats card */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Sale Type</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.saleType}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Asset Class</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{titleCase(record.assetClass)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">ROI</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.roi}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Rental Yield</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.rentalYield}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Cap Rate</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.capRate)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">YoY Growth</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.yoyGrowth)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">AI Score</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.aiScore ?? "-"}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Bathrooms</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.bathrooms}</p>
                            </div>
                        </div>

                        {/* Transaction summary */}
                        <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Latest Transaction Price</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{formatAed(record.latestTransactionPrice)}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Transaction Count</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.transactionCount.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-(--db-text-primary) leading-6 font-normal">{record.description}</p>

                        {/* Amenities / Features */}
                        {record.amenities.length > 0 && (
                            <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4">
                                <p className="text-lg font-medium text-(--db-text-primary) mb-3">Amenities</p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                                    {record.amenities.map((a) => (
                                        <span key={a} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary)">
                                            <AmenityCheckIcon />{a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Brochure */}
                        {record.brochurePdfUrl && (
                            <a
                                href={record.brochurePdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-[#D28A44] underline"
                            >
                                Download Brochure
                            </a>
                        )}

                        {/* District snapshot */}
                        {record.districtRef && (
                            <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4">
                                <p className="text-lg font-medium text-(--db-text-primary) mb-3">District Snapshot: {record.districtRef.name}</p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Avg Price / SQM</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{formatAed(record.districtRef.avgPriceSqm)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Avg ROI</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.districtRef.avgRoi)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Avg Rental Yield</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{formatPct(record.districtRef.avgRentalYield)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Total Transactions</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{record.districtRef.totalTransactions.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Trend</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{titleCase(record.districtRef.trendDirection)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Market Signal</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{titleCase(record.districtRef.marketSignal)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Appreciation Potential</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{titleCase(record.districtRef.appreciationPotential)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent transactions */}
                        {record.recentTransactions.length > 0 && (
                            <div className="bg-(--db-warm-card-bg) rounded-[10px] p-4">
                                <p className="text-lg font-medium text-(--db-text-primary) mb-3">Recent Transactions</p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="text-left text-(--db-text-primary)">
                                                <th className="font-medium pb-2 pr-3">Date</th>
                                                <th className="font-medium pb-2 pr-3">Area</th>
                                                <th className="font-medium pb-2 pr-3">Price</th>
                                                <th className="font-medium pb-2">Rate / SQM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {record.recentTransactions.map((t) => (
                                                <tr key={t.id} className="text-(--db-text-primary) border-t border-(--db-border)">
                                                    <td className="py-1.5 pr-3">{formatDate(t.saleDate)}</td>
                                                    <td className="py-1.5 pr-3">{t.areaSqm != null ? `${t.areaSqm} sqm` : "-"}</td>
                                                    <td className="py-1.5 pr-3">{formatAed(t.salePriceAed)}</td>
                                                    <td className="py-1.5">{formatAed(t.ratePerSqm)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
