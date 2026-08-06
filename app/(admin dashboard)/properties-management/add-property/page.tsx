"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import ModalButton from "@/app/components/ui/modal-button";
import appService from "@/app/services/appService";
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

function InputField({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <Input placeholder={placeholder} className={inputClsMain} value={value} onChange={(e) => onChange?.(e.target.value)} />
        </div>
    );
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <div className="relative">
                <select value={value} onChange={(e) => onChange?.(e.target.value)} className={selectCls}>
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
    label, accept, hint, multiple, small, onSelect,
}: {
    label?: string; accept: string; hint: string; multiple?: boolean; small?: boolean;
    onSelect?: (files: FileList) => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState<string[]>([]);

    const handleFiles = (fl: FileList | null) => {
        if (!fl || fl.length === 0) return;
        setFiles(Array.from(fl).map((f) => f.name));
        onSelect?.(fl);
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

    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [developer, setDeveloper] = useState("");
    const [district, setDistrict] = useState(PROP_DISTRICT_OPTIONS[0]);
    const [propertyType, setPropertyType] = useState(PROP_TYPE_OPTIONS[0]);
    const [saleType, setSaleType] = useState(PROP_SALE_TYPE_OPTIONS[0]);
    const [bedrooms, setBedrooms] = useState(PROP_BEDROOM_OPTIONS[0]);
    const [bathrooms, setBathrooms] = useState(PROP_BATHROOM_OPTIONS[0]);
    const [sizeSqm, setSizeSqm] = useState("");
    const [askingPrice, setAskingPrice] = useState("");
    const [roi, setRoi] = useState("");
    const [rentalYield, setRentalYield] = useState("");
    const [status, setStatus] = useState(PROP_STATUS_OPTIONS[0]);
    const [features, setFeatures] = useState<Record<string, boolean>>(
        Object.fromEntries(PROP_FEATURES.map((f) => [f, false]))
    );
    const [featured, setFeatured] = useState(false);

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [brochureFile, setBrochureFile] = useState<File | null>(null);

    const toggleFeature = (f: string) => setFeatures((prev) => ({ ...prev, [f]: !prev[f] }));

    const uploadMedia = async (propertyId: string) => {
        if (coverFile) {
            const fd = new FormData();
            fd.append("file", coverFile);
            await appService.uploadAdminPropertyCoverImage(propertyId, fd);
        }
        if (galleryFiles.length > 0) {
            const fd = new FormData();
            galleryFiles.forEach((f) => fd.append("files", f));
            await appService.uploadAdminPropertyGallery(propertyId, fd);
        }
        if (brochureFile) {
            const fd = new FormData();
            fd.append("file", brochureFile);
            await appService.uploadAdminPropertyBrochure(propertyId, fd);
        }
    };

    const handleSubmit = async (publish: boolean) => {
        setSaving(true);
        const payload = {
            projectName: name,
            description,
            developerName: developer,
            district,
            propertyType,
            saleType,
            bedrooms: bedrooms === "Studio" ? 0 : parseInt(bedrooms) || 0,
            bathrooms: parseInt(bathrooms) || 0,
            landAreaSqm: parseFloat(sizeSqm) || undefined,
            askingPriceAed: parseFloat(askingPrice.replace(/[^0-9.]/g, "")) || undefined,
            roiOverride: parseFloat(roi) || undefined,
            rentalYieldOverride: parseFloat(rentalYield) || undefined,
            features: Object.keys(features).filter((f) => features[f]),
            status: publish ? status.toLowerCase() : "draft",
            isFeatured: featured,
        };

        const res = await appService.createAdminProperty(payload);
        const newId = res?.data?.data?.id;

        if (res?.data?.success && newId) {
            await uploadMedia(newId);
            toast.success(publish ? "Property published." : "Property saved as draft.");
            setSaving(false);
            router.push("/properties-management");
        } else {
            setSaving(false);
            toast.error(res?.data?.message || "Failed to create property.");
        }
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="flex items-center justify-center w-9 h-9 mt-0.5 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0 hover:bg-(--db-sidebar-bg) transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M11.25 3.75L6 9L11.25 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                        Add New Property
                    </h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Create and publish a new investment property for investors across the Alpha Estate platform.
                    </p>
                </div>
            </div>

            {/* Form card */}
            <div className="bg-(--db-sidebar-bg) rounded-md p-6 flex flex-col gap-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Property Name"        placeholder="Yas Golf Collection" value={name} onChange={setName} />
                    <InputField label="Property Description" placeholder="Provide a brief overview of the property..." value={description} onChange={setDescription} />
                    <InputField label="Developer Name"       placeholder="Aldar Properties" value={developer} onChange={setDeveloper} />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="District"      options={PROP_DISTRICT_OPTIONS} value={district} onChange={setDistrict} />
                    <SelectField label="Property Type" options={PROP_TYPE_OPTIONS} value={propertyType} onChange={setPropertyType} />
                    <SelectField label="Sale Type"     options={PROP_SALE_TYPE_OPTIONS} value={saleType} onChange={setSaleType} />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Bedrooms"            options={PROP_BEDROOM_OPTIONS} value={bedrooms} onChange={setBedrooms} />
                    <SelectField label="Bathrooms"           options={PROP_BATHROOM_OPTIONS} value={bathrooms} onChange={setBathrooms} />
                    <InputField label="Property Size (SQM)"  placeholder="165 SQM" value={sizeSqm} onChange={setSizeSqm} />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Asking Price (AED)" placeholder="AED 2,400,000" value={askingPrice} onChange={setAskingPrice} />
                    <InputField label="ROI %"              placeholder="8.4" value={roi} onChange={setRoi} />
                    <InputField label="Rental Yield %"     placeholder="7.1" value={rentalYield} onChange={setRentalYield} />
                </div>

                {/* Cover Image */}
                <UploadZone label="Cover Image" accept=".jpg,.jpeg,.png" hint="JPG and PNG" onSelect={(files) => setCoverFile(files[0] ?? null)} />

                {/* Gallery + Brochure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <UploadZone label="Gallery Images"      accept=".jpg,.jpeg,.png" hint="JPG and PNG" multiple small onSelect={(files) => setGalleryFiles(Array.from(files))} />
                    <UploadZone label="Property Brochure PDF" accept=".pdf"          hint="PDF Format" small onSelect={(files) => setBrochureFile(files[0] ?? null)} />
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
                <SelectField label="Property Status" options={PROP_STATUS_OPTIONS} value={status} onChange={setStatus} />

                {/* Featured Property toggle */}
                <div>
                    <FieldLabel>Featured Property</FieldLabel>
                    <Toggle checked={featured} onChange={() => setFeatured((v) => !v)} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="primary" className="w-auto! py-2.5! px-8" onClick={() => handleSubmit(true)} disabled={saving}>
                        {saving ? "SAVING..." : "PUBLISH PROPERTY"}
                    </Button>
                    <ModalButton className="max-w-fit px-9 py-2.5!" onClick={() => handleSubmit(false)} disabled={saving}>SAVE DRAFT</ModalButton>
                </div>

            </div>
        </div>
    );
}
