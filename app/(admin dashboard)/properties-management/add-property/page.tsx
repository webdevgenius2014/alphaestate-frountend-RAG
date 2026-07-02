"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import {
    PROP_DISTRICT_OPTIONS,
    PROP_TYPE_OPTIONS,
    PROP_SALE_TYPE_OPTIONS,
    PROP_BEDROOM_OPTIONS,
    PROP_BATHROOM_OPTIONS,
    PROP_STATUS_OPTIONS,
    PROP_FEATURES,
    selectCls,
    inputClsMain,
    UploadIcon,
} from "@/app/(admin dashboard)/constants";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{children}</label>;
}

function InputField({ label, placeholder }: { label: string; placeholder?: string }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <Input placeholder={placeholder} className={inputClsMain} />
        </div>
    );
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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative w-13.75 h-6 rounded-full border transition-colors ease-linear shrink-0 ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-main-bg) border-(--db-toggle-border)"}`}
        >
            <div className={`absolute top-px w-5 h-5 rounded-full shadow transition-all ease-linear ${checked ? "right-0.5 bg-(--db-main-bg)" : "left-0.5 bg-[#D28A44]"}`} />
        </button>
    );
}

function UploadZone({
    label, accept, hint, multiple, small,
}: {
    label?: string; accept: string; hint: string; multiple?: boolean; small?: boolean;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState<string[]>([]);

    const handleFiles = (fl: FileList | null) => {
        if (!fl) return;
        setFiles(Array.from(fl).map((f) => f.name));
    };

    return (
        <div className="flex flex-col gap-2">
            {label && <FieldLabel>{label}</FieldLabel>}
            <div
                onClick={() => ref.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={`border bg-(--db-modal-field-bg) rounded-md flex  items-center justify-center gap-4 cursor-pointer transition-colors ${small ? "p-6" : "p-10"} ${dragOver ? "border-[#D28A44] bg-[#D28A441A]" : "border-(--db-modal-field-border) hover:border-[#D28A44]/60"}`}
            >
                <div className={`rounded-full bg-[#D28A441F] flex items-center justify-center ${small ? "w-16.25 h-16.25" : "w-16.25 h-16.25"}`}>
                    <UploadIcon />
                </div>
                {files.length > 0 ? (
                    <p className="text-sm text-(--db-text-primary) font-medium text-center">{files.join(", ")}</p>
                ) : (
                    <div className="text-left">
                        <p className="text-sm text-(--db-text-primary)">
                            <span className="text-[#D28A44] font-semibold">Click to upload</span> or drag and drop {multiple ? "Multiple" : ""}
                        </p>
                        <p className="text-sm font-normal text-(--db-text-muted)">{hint}</p>
                    </div>
                )}
                <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
            </div>
        </div>
    );
}

export default function AddPropertyPage() {
    const router = useRouter();
    const [features, setFeatures] = useState<Record<string, boolean>>(
        Object.fromEntries(PROP_FEATURES.map((f) => [f, false]))
    );
    const [featured, setFeatured] = useState(false);

    const toggleFeature = (f: string) => setFeatures((prev) => ({ ...prev, [f]: !prev[f] }));

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                    Add New Property
                </h1>
                <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                    Create and publish a new investment property for investors across the Alpha Estate platform.
                </p>
            </div>

            {/* Form card */}
            <div className="bg-(--db-sidebar-bg) rounded-md p-6 flex flex-col gap-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Property Name"        placeholder="Yas Golf Collection" />
                    <InputField label="Property Description" placeholder="Provide a brief overview of the property..." />
                    <InputField label="Developer Name"       placeholder="Aldar Properties" />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="District"      options={PROP_DISTRICT_OPTIONS} />
                    <SelectField label="Property Type" options={PROP_TYPE_OPTIONS} />
                    <SelectField label="Sale Type"     options={PROP_SALE_TYPE_OPTIONS} />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Bedrooms"            options={PROP_BEDROOM_OPTIONS} />
                    <SelectField label="Bathrooms"           options={PROP_BATHROOM_OPTIONS} />
                    <InputField label="Property Size (SQM)"  placeholder="165 SQM" />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Asking Price (AED)" placeholder="AED 2,400,000" />
                    <InputField label="ROI %"              placeholder="8.4" />
                    <InputField label="Rental Yield %"     placeholder="7.1" />
                </div>

                {/* Cover Image */}
                <UploadZone label="Cover Image" accept=".jpg,.jpeg,.png" hint="JPG and PNG" />

                {/* Gallery + Brochure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <UploadZone label="Gallery Images"      accept=".jpg,.jpeg,.png" hint="JPG and PNG" multiple small />
                    <UploadZone label="Property Brochure PDF" accept=".pdf"          hint="PDF Format" small />
                </div>

                {/* Property Features */}
                <div>
                    <FieldLabel>Property Features</FieldLabel>
                    <div className="flex flex-wrap gap-x-7 gap-y-3 mt-1">
                        {PROP_FEATURES.map((f) => (
                            <label key={f} className="flex items-center gap-2 text-sm text-(--db-text-primary) cursor-pointer select-none">
                                <input type="checkbox" checked={features[f]} onChange={() => toggleFeature(f)} className="hidden" />
                                <span className={`shrink-0 w-4.75 h-4.75 rounded-[3px] border flex items-center justify-center transition-colors ease-linear ${features[f] ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-sidebar-bg) border-[#D28A4466]"}`}>
                                    {features[f] && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                {f}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Property Status */}
                <SelectField label="Property Status" options={PROP_STATUS_OPTIONS} />

                {/* Featured Property toggle */}
                <div>
                    <FieldLabel>Featured Property</FieldLabel>
                    <Toggle checked={featured} onChange={() => setFeatured((v) => !v)} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="primary" className="w-auto! py-2.5! px-8">PUBLISH PROPERTY</Button>
                    <ModalButton className="max-w-fit px-9 py-2.5!" onClick={() => router.back()}>SAVE DRAFT</ModalButton>
                </div>

            </div>
        </div>
    );
}
