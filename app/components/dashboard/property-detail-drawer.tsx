"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { DrawerRecord } from "@/app/(admin dashboard)/constants";
import {
    LocationPinIcon,
    PropertyTypeIcon,
    BedroomIcon,
    AreaIcon,
    AmenityCheckIcon,
} from "@/app/(admin dashboard)/constants";

interface Props {
    record: DrawerRecord;
    onClose: () => void;
}

export function PropertyDetailDrawer({ record, onClose }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex">
            <div className="flex-1 bg-black/80" onClick={onClose} />

            <div className="w-full max-w-121.25 bg-(--db-modal-bg) flex flex-col shadow-2xl">

                <div className="flex items-center justify-between px-5 pt-6 pb-4.5">
                    <h2 className="text-[25px] font-medium text-(--db-text-primary)">Property Detail</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 z-20">
                        <img src="/close.svg" alt="" />
                    </button>
                </div>
                <div className="overflow-y-auto thin-scroll">

                    <div className="w-full h-63.25 bg-(--db-sidebar-bg) px-5 rounded-md shrink-0 overflow-hidden">
                        <img src={record.image} alt={record.property} className="w-full h-full rounded-md object-cover" />
                    </div>

                    <div className="flex flex-col gap-3.25 px-5 py-5">

                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-[19px] font-medium text-(--db-text-primary)">{record.property}</h3>
                            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-[#5E9F622E] text-[#5E9F62]">
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                Active
                            </span>
                        </div>

                        <p className="text-[13px] font-normal text-(--db-text-primary) -mt-2">{record.developer}</p>

                        <div className="flex flex-wrap items-center gap-x-4 justify-between gap-y-2 text-sm text-(--db-text-primary)">
                            <span className="flex items-center gap-1.5"><LocationPinIcon />{record.district}</span>
                            <span className="flex items-center gap-1.5"><PropertyTypeIcon />{record.type}</span>
                            <span className="flex items-center gap-1.5"><BedroomIcon />{record.beds} Bed</span>
                            <span className="flex items-center gap-1.5"><AreaIcon />{record.sqft} sqft</span>
                        </div>

                        {/* Price */}
                        <p className="text-base font-medium text-[#D28A44]">{record.price}</p>

                        {/* Stats card */}
                        <div className="bg-[#FFECDA] rounded-[10px] p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Sale Type</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.saleType}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">ROI</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.roi}</p>
                            </div>
                            <div>
                                <p className="text-[15px] text-(--db-text-primary) font-normal mb-0.5">Rental Yield</p>
                                <p className="text-[13px] font-medium text-(--db-text-primary)">{record.rentalYield}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-(--db-text-primary) leading-6 font-normal">{record.description}</p>

                        {/* Amenities */}
                        <div className="bg-[#FFECDA] rounded-[10px] p-4">
                            <p className="text-lg font-medium text-(--db-text-primary) mb-3">Amenities</p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                                {record.amenities.map((a) => (
                                    <span key={a} className="flex items-center gap-2 text-sm font-normal text-(--db-text-primary)">
                                        <AmenityCheckIcon />{a}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
