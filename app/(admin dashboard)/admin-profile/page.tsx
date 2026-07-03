"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { ChangePasswordModal } from "@/app/components/dashboard/admin-modals";
import appService from "@/app/services/appService";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import {
    PROFILE_COUNTRIES,
    PROFILE_CITIES,
    SettingsPencilIcon,
    SettingsCameraIcon,
    SelectChevron,
    SavedLocIcon,
} from "@/app/(user dashboard)/constants";
import { inputCls, labelCls } from "../constants";

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

export default function AdminProfilePage() {
    const { updateUser } = useTheme();
    const [formOpen, setFormOpen] = useState(true);
    const [pwModalOpen, setPwModalOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [twoFaLoading, setTwoFaLoading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        bio: "",
    });

    const [prefs, setPrefs] = useState({
        emailNotifications: false,
        systemHealthAlerts: false,
        activitySummary: false,
    });

    const loadProfile = () => {
        appService.getAdminProfile().then((res) => {
            if (res?.data?.success && res.data.data) {
                const data = res.data.data;
                setProfile(data);
                const nameParts = (data.fullName ?? "").trim().split(/\s+/);
                setForm({
                    firstName: data.firstName ?? nameParts[0] ?? "",
                    lastName: data.lastName ?? nameParts.slice(1).join(" "),
                    email: data.email ?? "",
                    phone: data.phoneNumber ?? data.phone ?? "",
                    country: data.countryRegion ?? data.country ?? "",
                    city: data.cityState ?? data.city ?? "",
                    bio: data.bio ?? "",
                });
                setTwoFaEnabled(!!(data.isTwoFactorEnabled ?? data.twoFactorEnabled ?? data.is2FAEnabled));
                if (data.avatarUrl ?? data.avatar) {
                    updateUser({ avatarUrl: data.avatarUrl ?? data.avatar });
                }
            }
        });
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }));

    const togglePref = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

    const handleSaveProfile = async () => {
        setSaving(true);
        const res = await appService.updateAdminProfile({
            firstName: form.firstName,
            lastName: form.lastName,
            fullName: [form.firstName, form.lastName].filter(Boolean).join(" "),
            email: form.email,
            phoneNumber: form.phone,
            countryRegion: form.country,
            cityState: form.city,
            bio: form.bio,
        });
        setSaving(false);

        if (res?.data?.success) {
            toast.success("Profile updated successfully.");
            setFormOpen(false);
            loadProfile();
        } else {
            toast.error(res?.data?.message || "Failed to update profile.");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setAvatarUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await appService.uploadAdminProfileAvatar(formData);
        setAvatarUploading(false);

        if (res?.data?.success) {
            const newAvatarUrl = res.data.data?.avatarUrl ?? res.data.data?.avatar;
            if (newAvatarUrl) updateUser({ avatarUrl: newAvatarUrl });
            toast.success("Profile photo updated successfully.");
            loadProfile();
        } else {
            toast.error(res?.data?.message || "Failed to upload photo.");
        }
    };

    const handleToggle2Fa = async () => {
        setTwoFaLoading(true);
        const res = await appService.toggleAdminProfile2Fa({ enabled: !twoFaEnabled });
        setTwoFaLoading(false);

        if (res?.data?.success) {
            setTwoFaEnabled((prev) => !prev);
            toast.success(!twoFaEnabled ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
        } else {
            toast.error(res?.data?.message || "Failed to update two-factor authentication.");
        }
    };

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                    Admin Profile
                </h1>
                <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                    Manage your administrator account details, security preferences, and platform access settings.
                </p>
            </div>

            <div className="bg-(--db-sidebar-bg) rounded-md p-5">

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_40%] gap-5">

                    <div className="bg-(--db-main-bg) h-fit md:sticky md:top-0 rounded-md p-5 flex flex-col">
                        <div className=" flex items-start justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-(--db-sidebar-bg)">
                                        <img src={profile?.avatarUrl ?? profile?.avatar ?? "/favicon.ico"} alt="Admin avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={avatarUploading}
                                        className="absolute bottom-0.5 right-0.5 w-5.75 h-5.75 bg-[#D28A44] rounded-full flex items-center justify-center text-white shadow-sm disabled:opacity-60"
                                        title="Change photo"
                                    >
                                        <SettingsCameraIcon />
                                    </button>
                                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </div>
                                <div>
                                    <h2 className="text-[19px] font-medium text-(--db-text-primary)">{[form.firstName, form.lastName].filter(Boolean).join(" ") || "Admin Name"}</h2>
                                    <p className="text-[13px] text-(--db-text-primary) mb-1">{profile?.role ?? "Fully Admin"}</p>
                                    <p className="text-sm text-(--db-text-primary) mb-2">{form.email || "admin@alphaestate.ai"}</p>
                                    <div className="flex items-center gap-1 text-[13px] text-[#D28A44]">
                                        <SavedLocIcon />
                                        <span>{[form.city, form.country].filter(Boolean).join(", ") || "Location"}</span>
                                    </div>
                                </div>
                            </div>
                            {!formOpen && (
                                <button
                                    onClick={() => setFormOpen(true)}
                                    className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center shrink-0"
                                >
                                    <SettingsPencilIcon />
                                </button>
                            )}
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${formOpen ? "max-h-screen opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}>
                            <div className="border border-[#D28A4433] mb-6" />

                        <div className="w-full">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[17px] font-semibold text-[#D28A44]">Personal Information</h3>
                                <button
                                    onClick={() => setFormOpen(false)}
                                    className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center"
                                >
                                    <SettingsPencilIcon />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelCls}>First Name</label>
                                    <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="First name" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Last Name</label>
                                    <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Email Address</label>
                                    <input type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Phone Number</label>
                                    <input type="text" value={form.phone} onChange={set("phone")} placeholder="+971 XX XXX XXXX" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Country / Region</label>
                                    <div className="relative">
                                        <select
                                            value={form.country}
                                            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                                            className={`${inputCls} appearance-none cursor-pointer`}
                                        >
                                            {PROFILE_COUNTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>City / State</label>
                                    <div className="relative">
                                        <select
                                            value={form.city}
                                            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                                            className={`${inputCls} appearance-none cursor-pointer`}
                                        >
                                            {PROFILE_CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className={labelCls}>Short Bio</label>
                                <textarea
                                    rows={4}
                                    value={form.bio}
                                    onChange={set("bio")}
                                    placeholder="Tell us about yourself."
                                    className={`${inputCls} resize-none`}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button variant="primary" className="py-2.5!" disabled={saving} onClick={handleSaveProfile}>
                                    {saving ? "SAVING..." : "SAVE CHANGES"}
                                </Button>
                                <ModalButton className="max-w-fit px-5 py-2.5!" onClick={() => setFormOpen(false)}>CANCEL</ModalButton>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">

                        {/* Account Security */}
                        <div className="bg-(--db-main-bg) rounded-md p-5">
                            <h3 className="text-[18px] font-medium text-(--db-text-primary) mb-4">Account Security</h3>

                            <div className="bg-(--db-section-bg) rounded-md p-5 mb-3">
                                <div className="flex items-center gap-2 mb-1.75">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${twoFaEnabled ? "bg-[#5E9F62]" : "bg-[#CF2D48]"}`} />
                                    <p className="text-sm font-semibold text-(--db-text-primary)">Two-Factor Authentication</p>
                                </div>
                                <p className="text-[13px] text-(--db-text-primary) mb-3.5">
                                    Add an extra layer of protection to your administrator account.
                                </p>
                                <ModalButton className="max-w-fit px-7 py-2! rounded-md!" disabled={twoFaLoading} onClick={handleToggle2Fa}>
                                    {twoFaLoading ? "UPDATING..." : twoFaEnabled ? "DISABLE 2FA" : "ENABLE 2FA"}
                                </ModalButton>
                            </div>

                            <div className="bg-(--db-section-bg) rounded-md p-5">
                                <div className="flex items-center gap-2 mb-1.75">
                                    <span className="w-2 h-2 rounded-full bg-[#5E9F62] shrink-0" />
                                    <p className="text-sm font-semibold text-(--db-text-primary)">Password Management</p>
                                </div>
                                <p className="text-[13px] text-(--db-text-primary) mb-3.5">
                                    Update your password and review recent security activity.
                                </p>
                                <ModalButton className="max-w-fit px-7 py-2! rounded-md!" onClick={() => setPwModalOpen(true)}>CHANGE PASSWORD</ModalButton>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-(--db-main-bg) rounded-md p-5">
                            <h3 className="text-[18px] font-medium text-(--db-text-primary) mb-4">Preferences</h3>
                            <div className="space-y-3">
                                {([
                                    // Could be used further
                                    // { key: "emailNotifications", label: "Email Notifications" },
                                    { key: "systemHealthAlerts", label: "System Health Alerts" },
                                    // { key: "activitySummary", label: "Activity Summary" },
                                ] as { key: keyof typeof prefs; label: string }[]).map(({ key, label }) => (
                                    <div key={key} className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-section-bg) rounded-md p-4">
                                        <span className="text-sm text-(--db-text-primary) font-normal">{label}</span>
                                        <Toggle checked={prefs[key]} onChange={() => togglePref(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Information — full width */}
                <div className="mt-5 bg-(--db-main-bg) rounded-md p-5">
                    <h3 className="text-[18px] font-medium text-(--db-text-primary) mb-4">Account Information</h3>
                    <div className="flex flex-wrap border border-[#D28A441F] bg-(--db-section-bg) rounded-md p-4 gap-x-20 gap-y-4">
                        {[
                            { label: "Member Since", value: profile?.memberSince ?? "January 2025" },
                            { label: "Last Login", value: profile?.lastLogin ?? "January 2025" },
                            { label: "Active Sessions", value: profile?.activeSessions ?? "January 2025" },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">{s.label}</p>
                                <p className="text-[13px] font-normal text-(--db-text-primary)">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <ChangePasswordModal isOpen={pwModalOpen} onClose={() => setPwModalOpen(false)} />
        </div>
    );
}
