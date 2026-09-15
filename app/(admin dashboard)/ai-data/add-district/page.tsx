"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
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
import appService from "@/app/services/appService";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{children}</label>;
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

function InputField({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <Input placeholder={placeholder} className={inputClsMain} value={value} onChange={(e) => onChange?.(e.target.value)} />
        </div>
    );
}

function pick(obj: any, keys: string[]): unknown {
    for (const k of keys) {
        if (obj?.[k] != null) return obj[k];
    }
    return undefined;
}

function toOption(value: unknown, options: string[], fallback: string): string {
    if (value == null) return fallback;
    const match = options.find((o) => o.toLowerCase() === String(value).toLowerCase());
    return match ?? fallback;
}

export default function AddDistrictPage() {
    return (
        <Suspense fallback={null}>
            <DistrictForm />
        </Suspense>
    );
}

function DistrictForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const isEdit = Boolean(id);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [status, setStatus] = useState(DISTRICT_STATUS_OPTIONS[0]);
    const [description, setDescription] = useState("");
    const [avgPriceSqm, setAvgPriceSqm] = useState("");
    const [avgRentalYield, setAvgRentalYield] = useState("");
    const [avgRoi, setAvgRoi] = useState("");
    const [appreciation, setAppreciation] = useState(DISTRICT_APPRECIATION_OPTIONS[0]);
    const [trend, setTrend] = useState(DISTRICT_TREND_OPTIONS[0]);
    const [signal, setSignal] = useState(DISTRICT_SIGNAL_OPTIONS[0]);
    const [apartmentsPct, setApartmentsPct] = useState("");
    const [villasPct, setVillasPct] = useState("");
    const [townhousesPct, setTownhousesPct] = useState("");
    const [settings, setSettings] = useState<Record<string, boolean>>(
        Object.fromEntries(DISTRICT_SETTINGS_OPTIONS.map((o) => [o, false]))
    );

    const handleFile = (file: File) => {
        setCoverFile(file);
        setFileName(file.name);
    };

    useEffect(() => {
        if (!id) return;
        appService.getAdminDistrictById(id).then((res) => {
            const d = res?.data?.data;
            if (!d) {
                toast.error(res?.data?.message || "Failed to load district details.");
                return;
            }

            setName((pick(d, ["name", "district"]) as string) ?? "");
            setDescription((pick(d, ["description", "summary"]) as string) ?? "");
            setStatus(toOption(d.status, DISTRICT_STATUS_OPTIONS, DISTRICT_STATUS_OPTIONS[0]));

            const priceSqm = pick(d, ["avg_price_sqm", "avgPriceSqm"]);
            if (priceSqm != null) setAvgPriceSqm(String(priceSqm));

            const rentalYield = pick(d, ["avg_rental_yield", "avgRentalYield", "rentalYield"]);
            if (rentalYield != null) setAvgRentalYield(String(rentalYield));

            const roi = pick(d, ["avg_roi", "avgRoi", "roi"]);
            if (roi != null) setAvgRoi(String(roi));

            setAppreciation(toOption(pick(d, ["appreciation_potential", "appreciationPotential"]), DISTRICT_APPRECIATION_OPTIONS, DISTRICT_APPRECIATION_OPTIONS[0]));
            setTrend(toOption(pick(d, ["trend_direction", "trendDirection"]), DISTRICT_TREND_OPTIONS, DISTRICT_TREND_OPTIONS[0]));
            setSignal(toOption(pick(d, ["market_signal", "marketSignal"]), DISTRICT_SIGNAL_OPTIONS, DISTRICT_SIGNAL_OPTIONS[0]));

            const apartments = pick(d, ["apartment_pct", "apartmentsPct"]);
            if (apartments != null) setApartmentsPct(String(apartments));

            const villas = pick(d, ["villa_pct", "villasPct"]);
            if (villas != null) setVillasPct(String(villas));

            const townhouses = pick(d, ["townhouse_pct", "townhousesPct"]);
            if (townhouses != null) setTownhousesPct(String(townhouses));

            setSettings({
                "Show in User Dashboard": Boolean(pick(d, ["showInDashboard", "show_in_dashboard"])),
                "Include in Market Analytics": Boolean(pick(d, ["includeInAnalytics", "include_in_analytics"])),
                "Include in District Comparison": Boolean(pick(d, ["includeInComparison", "include_in_comparison"])),
            });

            const existingCoverUrl = pick(d, ["cover_image_url", "coverImageUrl"]) as string | undefined;
            if (existingCoverUrl) setFileName(existingCoverUrl.split("/").pop() ?? existingCoverUrl);
        });
    }, [id]);

    const handleSubmit = async () => {
        setSaving(true);
        const payload = {
            name,
            description,
            status: status.toLowerCase(),
            avgPriceSqm: avgPriceSqm ? parseFloat(avgPriceSqm) : undefined,
            avgRentalYield: avgRentalYield ? parseFloat(avgRentalYield) : undefined,
            avgRoi: avgRoi ? parseFloat(avgRoi) : undefined,
            appreciationPotential: appreciation.toLowerCase(),
            trendDirection: trend.toLowerCase(),
            marketSignal: signal.toLowerCase(),
            apartmentsPct: apartmentsPct ? parseFloat(apartmentsPct) : undefined,
            villasPct: villasPct ? parseFloat(villasPct) : undefined,
            townhousesPct: townhousesPct ? parseFloat(townhousesPct) : undefined,
            showInDashboard: settings["Show in User Dashboard"],
            includeInAnalytics: settings["Include in Market Analytics"],
            includeInComparison: settings["Include in District Comparison"],
        };

        const res = isEdit
            ? await appService.updateAdminDistrictById(id as string, payload)
            : await appService.createAdminDistrict(payload);

        if (!(res?.data?.success || res?.status === 200 || res?.status === 201)) {
            setSaving(false);
            toast.error(res?.data?.message || `Failed to ${isEdit ? "update" : "create"} district.`);
            return;
        }

        const districtId = isEdit ? (id as string) : res?.data?.data?.id;
        if (coverFile && districtId) {
            const formData = new FormData();
            formData.append("file", coverFile);
            const imgRes = await appService.uploadAdminDistrictCoverImage(districtId, formData);
            if (!(imgRes?.data?.success || imgRes?.status === 200 || imgRes?.status === 201)) {
                toast.error(imgRes?.data?.message || "District saved, but cover image upload failed.");
            }
        }

        setSaving(false);
        toast.success(isEdit ? "District updated." : "District created.");
        router.back();
    };

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                    {isEdit ? "Edit District Data" : "Add District Data"}
                </h1>
                <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                    {isEdit
                        ? "Update the district profile and its market intelligence data."
                        : "Create a new district profile and configure its market intelligence data."}
                </p>
            </div>

            {/* Form card */}
            <div className="bg-(--db-sidebar-bg) rounded-md p-6 flex flex-col gap-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="District Name" placeholder="Yas Island" value={name} onChange={setName} />
                    <SelectField label="District Status" options={DISTRICT_STATUS_OPTIONS} value={status} onChange={setStatus} />
                    <InputField label="District Description" placeholder="Enter a brief overview of the district......" value={description} onChange={setDescription} />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Average Price per SQM (AED)" placeholder="17,800" value={avgPriceSqm} onChange={setAvgPriceSqm} />
                    <InputField label="Average Rental Yield (%)" placeholder="7.4" value={avgRentalYield} onChange={setAvgRentalYield} />
                    <InputField label="Average ROI (%)" placeholder="8.2" value={avgRoi} onChange={setAvgRoi} />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Appreciation Potential" options={DISTRICT_APPRECIATION_OPTIONS} value={appreciation} onChange={setAppreciation} />
                    <SelectField label="Trend Direction" options={DISTRICT_TREND_OPTIONS} value={trend} onChange={setTrend} />
                    <SelectField label="Market Signal" options={DISTRICT_SIGNAL_OPTIONS} value={signal} onChange={setSignal} />
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="Apartments (%)" placeholder="65" value={apartmentsPct} onChange={setApartmentsPct} />
                    <InputField label="Villas (%)" placeholder="25" value={villasPct} onChange={setVillasPct} />
                    <InputField label="Townhouses (%)" placeholder="10" value={townhousesPct} onChange={setTownhousesPct} />
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
                                <input type="checkbox" checked={settings[opt]} onChange={() => setSettings((prev) => ({ ...prev, [opt]: !prev[opt] }))} className="hidden" />
                                <span className={`shrink-0 w-4.75 h-4.75 rounded-[3px] border flex items-center justify-center transition-colors ease-linear ${settings[opt] ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-sidebar-bg) border-[#D28A4466]"}`}>
                                    {settings[opt] && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="navy" className="w-auto! py-2.5!" onClick={handleSubmit} disabled={saving}>
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </Button>
                    <ModalButton className="max-w-fit px-9 py-2.5!" onClick={() => router.back()}>CANCEL</ModalButton>
                </div>

            </div>

        </div>
    );
}
