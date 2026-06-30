"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import {
    DISTRICT_STATUS_OPTIONS,
    DISTRICT_APPRECIATION_OPTIONS,
    DISTRICT_TREND_OPTIONS,
    DISTRICT_SIGNAL_OPTIONS,
    DISTRICT_SETTINGS_OPTIONS,
    selectCls,
    inputClsMain,
} from "@/app/(admin dashboard)/constants";
import ModalButton from "@/app/components/ui/modal-button";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{children}</label>;
}

function SelectField({ label, options }: { label: string; options: string[] }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select className={selectCls}>
                    {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SelectChevron />
                </span>
            </div>
        </div>
    );
}

function InputField({ label, placeholder }: { label: string; placeholder?: string }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <Input placeholder={placeholder} className={inputClsMain} />
        </div>
    );
}

export default function AddDistrictPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [settings, setSettings] = useState<Record<string, boolean>>(
        Object.fromEntries(DISTRICT_SETTINGS_OPTIONS.map((o) => [o, false]))
    );

    const handleFile = (file: File) => setFileName(file.name);

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                    Add District Data
                </h1>
                <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                    Create a new district profile and configure its market intelligence data.
                </p>
            </div>

            {/* Form card */}
            <div className="bg-(--db-sidebar-bg) rounded-md p-6 flex flex-col gap-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="District Name" placeholder="Yas Island" />
                    <SelectField label="District Status" options={DISTRICT_STATUS_OPTIONS} />
                    <InputField label="District Description" placeholder="Enter a brief overview of the district......" />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Average Price per SQM (AED)" placeholder="17,800" />
                    <InputField label="Average Rental Yield (%)" placeholder="7.4" />
                    <InputField label="Average ROI (%)" placeholder="8.2" />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Appreciation Potential" options={DISTRICT_APPRECIATION_OPTIONS} />
                    <SelectField label="Trend Direction" options={DISTRICT_TREND_OPTIONS} />
                    <SelectField label="Market Signal" options={DISTRICT_SIGNAL_OPTIONS} />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Apartments (%)" placeholder="65" />
                    <InputField label="Villas (%)" placeholder="25" />
                    <InputField label="Townhouses (%)" placeholder="10" />
                </div>

                {/* File upload */}
                <div>
                    <FieldLabel>District Cover Image</FieldLabel>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                        className={`border bg-(--db-modal-field-bg) rounded-md p-10 flex items-center justify-center gap-3 cursor-pointer transition-colors ${dragOver ? "border-[#D28A44] bg-[#D28A441A]" : "border-(--db-modal-field-border) hover:border-[#D28A44]/60"
                            }`}
                    >
                        <div className="w-14 h-14 rounded-full bg-[#D28A441F] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <g clipPath="url(#clip0_1728_13279)">
                                    <path d="M25.6008 28C25.6008 28 32.2504 28 32.8792 28C36.3712 28 39.2008 25.1704 39.2008 21.6792C39.2008 18.188 36.3712 15.3576 32.8792 15.3576C32.8632 15.3576 32.8488 15.36 32.8328 15.36C32.8816 14.9648 32.9152 14.5648 32.9152 14.1568C32.9152 8.78883 28.564 4.43683 23.1952 4.43683C19.012 4.43683 15.4576 7.08403 14.0864 10.7896C13.2168 9.91843 12.0136 9.37843 10.6856 9.37843C8.03038 9.37843 5.87838 11.5304 5.87838 14.1848C5.87838 14.2528 5.88638 14.3184 5.88878 14.3856C2.95678 15.196 0.800781 17.8752 0.800781 21.0648C0.800781 24.8952 3.90558 28 7.73678 28C8.39838 28 14.4008 28 14.4008 28" stroke="#D28A44" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 22.4L20 18.4L24 22.4" stroke="#D28A44" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
                                    <path d="M20 34.4V18.6664" stroke="#D28A44" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1728_13279">
                                        <rect width="40" height="40" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        {fileName ? (
                            <p className="text-sm text-(--db-text-primary) font-medium">{fileName}</p>
                        ) : (
                            <div>
                                <p className="text-sm text-(--db-text-primary)">
                                    <span className="text-[#D28A44] font-semibold cursor-pointer">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm text-(--db-text-primary)">JPG and PNG</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    </div>
                </div>

                {/* District Settings */}
                <div>
                    <FieldLabel>District Settings</FieldLabel>
                    <div className="flex flex-wrap gap-x-7 gap-y-3 mt-1">
                        {DISTRICT_SETTINGS_OPTIONS.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm text-(--db-text-primary) cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={settings[opt]}
                                    onChange={() => setSettings((prev) => ({ ...prev, [opt]: !prev[opt] }))}
                                    className="w-4 h-4 rounded-sm accent-[#cd8239] cursor-pointer shrink-0"
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="navy" className="w-auto! py-2.5!">SAVE CHANGES</Button>
                    <ModalButton className="max-w-fit px-9 py-2.5!" onClick={() => router.back()}>CANCEL</ModalButton>
                </div>

            </div>

        </div>
    );
}
