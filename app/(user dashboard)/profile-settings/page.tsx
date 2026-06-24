"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import ModalButton from "@/app/components/ui/modal-button";
import { DeleteAccountModal } from "@/app/components/dashboard/alert-modals";
import appService from "@/app/services/appService";
import {PHONE_CODES} from "@/app/constant";
import {
    SETTINGS_TABS,
    PROFILE_COUNTRIES,
    PROFILE_CITIES,
    SettingsPencilIcon,
    SettingsCameraIcon,
    SecurityEyeIcon,
    SecurityEyeOffIcon,
    SelectChevron,
    SavedLocIcon,
    NOTIF_MAIN_TOGGLES,
    NOTIF_AI_ALERTS,
    NOTIF_MARKET_UPDATE_OPTIONS,
    NOTIF_SENSITIVITY_OPTIONS,
    NOTIF_SUMMARY_OPTIONS,
    NOTIF_DISTRICTS,
    NOTIF_ACCOUNT_TOGGLES,
    AI_PREF_INVESTMENT_FOCUS,
    AI_PREF_INSIGHT_LEVELS,
    AI_PREF_DISTRICTS,
} from "@/app/(user dashboard)/constants";
import Button from "@/app/components/ui/button";

const inputCls =
    "w-full border border-[#D28A441F] rounded-[3px] p-[12px_14px] bg-(--db-sidebar-bg) text-(--db-text-primary) text-[13px] outline-none focus:border-[#D28A44]/60 transition-colors placeholder-(--db-text-primary)";

const labelCls = "block text-[15px] font-medium text-(--db-text-primary) mb-2";

function FormField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {children}
        </div>
    );
}

function SelectField({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <FormField label={label}>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer`}
                >
                    {!value && <option value="" disabled>Select {label}</option>}
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SelectChevron />
                </span>
            </div>
        </FormField>
    );
}

function SectionTitle({ children, showEdit }: { children: ReactNode; showEdit?: boolean }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-semibold text-[#D28A44]">{children}</h3>
            {showEdit && (
                <button className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center">
                    <SettingsPencilIcon />
                </button>
            )}
        </div>
    );
}

function Checkbox({ checked, onChange, label, textCls }: { checked: boolean; onChange: () => void; label: string; textCls?: string }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
            <span className={`shrink-0 w-4.75 h-4.75 rounded-[3px] border flex items-center justify-center transition-colors ease-linear ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-sidebar-bg) border-[#D28A4466]"}`}>
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span className={textCls ?? "text-[13px] text-(--db-text-primary)"}>{label}</span>
        </label>
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

function PasswordInput({ label, show, onToggle, ...rest }: { label: string; show: boolean; onToggle: () => void } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <FormField label={label}>
            <div className="relative">
                <input type={show ? "text" : "password"} {...rest} className={`${inputCls} bg-(--db-main-bg)!`} />
                <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--db-text-muted) hover:text-(--db-text-primary) transition-colors">
                    {show ? <SecurityEyeOffIcon /> : <SecurityEyeIcon />}
                </button>
            </div>
        </FormField>
    );
}

function SaveBar({ label = "SAVE CHANGES" }: { label?: string }) {
    return (
        <div className="flex items-center gap-4 mt-2">
            <Button variant="primary" className="py-2.5!">
                {label}
            </Button>
            <ModalButton className="max-w-fit px-5 py-2.5!">CANCEL</ModalButton>
        </div>
    );
}

type ProfileForm = {
    firstName: string;
    lastName: string;
    email: string;
    phoneCode: string;
    phone: string;
    country: string;
    city: string;
    bio: string;
};

function MyProfileTab() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '',
    phone: '',
    country: '',
    city: '',
    bio: '',
    });

    useEffect(() => {
        appService.getUserProfile()
            .then((res) => {
                if (res?.status === 200 || res?.status === 201) {
                    const data = res.data?.data ?? res.data;
                    setProfile(data);
                    const nameParts = (data.fullName ?? "").trim().split(/\s+/);
                    setForm({
                        firstName: nameParts[0] ?? "",
                        lastName:  nameParts.slice(1).join(" "),
                        email:     data.email         ?? "",
                        phoneCode: data.phoneCode     ?? "", 
                        phone:     data.phoneNumber   ?? "",
                        country:   data.countryRegion ?? "",
                        city:      data.cityState     ?? "",
                        bio:       data.bio           ?? "",
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange =
        (key: keyof ProfileForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const location = [profile?.cityState, profile?.countryRegion].filter(Boolean).join(", ") || "—";

    return (
        <div>
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">My Profile</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Manage your personal account information and profile details.</p>
            </div>

            <div className="bg-(--db-main-bg) p-6.25">
                {/* Avatar + summary row */}
                <div className="mb-5 pb-6 border-b border-[#D28A4433]">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-7">
                            <div className="relative shrink-0">
                                <div className="w-27.25 h-27.25 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        src={profile?.avatarUrl ?? "/favicon.ico"}
                                        alt="Profile avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <button
                                    className="absolute bottom-0.5 right-0.5 w-5.75 h-5.75 bg-[#D28A44] rounded-full flex items-center justify-center text-white shadow-sm"
                                    title="Change photo"
                                >
                                    <SettingsCameraIcon />
                                </button>
                            </div>

                            {/* Name / role / email / location */}
                            <div>
                                {loading ? (
                                    <div className="space-y-2">
                                        <div className="h-5 w-36 bg-(--db-sidebar-bg) rounded animate-pulse" />
                                        <div className="h-4 w-24 bg-(--db-sidebar-bg) rounded animate-pulse" />
                                        <div className="h-4 w-48 bg-(--db-sidebar-bg) rounded animate-pulse" />
                                        <div className="h-4 w-32 bg-(--db-sidebar-bg) rounded animate-pulse" />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-[19px] font-medium text-(--db-text-primary)">{profile?.fullName || "User"}</h2>
                                        <p className="text-[13px] text-(--db-text-primary) font-normal mb-1">{profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Role"}</p>
                                        <p className="text-sm text-(--db-text-primary) font-normal mb-2.25">{profile?.email ?? "Email"}</p>
                                        <div className="flex items-center gap-1 text-[13px] text-[#D28A44]">
                                            <SavedLocIcon />
                                            <span>{location ?? "Location"}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center">
                            <SettingsPencilIcon />
                        </button>
                    </div>
                </div>

                {/* Personal information form */}
                <div className="w-full mb-6.5">
                    <SectionTitle showEdit>Personal Information</SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <FormField label="First Name">
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={handleChange("firstName")}
                                placeholder="First name"
                                className={inputCls}
                            />
                        </FormField>
                        <FormField label="Last Name">
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={handleChange("lastName")}
                                placeholder="Last name"
                                className={inputCls}
                            />
                        </FormField>
                        <FormField label="Email Address">
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                placeholder="Email address"
                                className={inputCls}
                            />
                        </FormField>
                        <SelectField
                            label="Country / Region"
                            options={PROFILE_COUNTRIES}
                            value={form.country}
                            onChange={(v) => setForm((prev) => ({ ...prev, country: v }))}
                        />
                        <SelectField
                            label="City / State"
                            options={PROFILE_CITIES}
                            value={form.city}
                            onChange={(v) => setForm((prev) => ({ ...prev, city: v }))}
                        />
                    </div>

                    <FormField label="Short Bio">
                        <textarea
                            rows={4}
                            value={form.bio}
                            onChange={handleChange("bio")}
                            placeholder="Tell us a little about yourself."
                            className={`${inputCls} resize-none`}
                        />
                    </FormField>

                    {/* Account information */}
                    <h3 className="text-[17px] font-semibold text-[#D28A44] mt-7 mb-3.5">Account Information</h3>
                    <div className="bg-(--db-sidebar-bg) p-5 flex flex-wrap gap-20">
                        {loading ? (
                            [1, 2, 3].map((n) => (
                                <div key={n} className="space-y-1">
                                    <div className="h-4 w-24 bg-(--db-main-bg) rounded animate-pulse" />
                                    <div className="h-3 w-32 bg-(--db-main-bg) rounded animate-pulse" />
                                </div>
                            ))
                        ) : (
                            [
                                { label: "Member Since",    value: profile?.memberSince    ?? "—" },
                                { label: "Last Login",      value: profile?.lastLogin      ?? "—" },
                                { label: "Active Sessions", value: profile?.activeSessions ?? "—" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">{s.label}</p>
                                    <p className="text-[13px] text-(--db-text-primary)">{s.value}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <SaveBar />
            </div>
        </div>
    );
}

function SecurityTab() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");

    const handleChangePassword = async () => {
        setPwError("");
        setPwSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPwError("All fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match.");
            return;
        }

        setPwLoading(true);
        try {
            const res = await appService.changePassword({ currentPassword, newPassword });
            if (res?.status === 200 || res?.status === 201) {
                setPwSuccess("Password updated successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPwError(res?.data?.message || "Failed to update password.");
            }
        } finally {
            setPwLoading(false);
        }
    };

    const [prefs, setPrefs] = useState({ email: true, newDevice: true, suspicious: true });
    const togglePref = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

    const secPrefs: { key: keyof typeof prefs; label: string }[] = [
        { key: "email",      label: "Email Login Alerts" },
        { key: "newDevice",  label: "New Device Notifications" },
        { key: "suspicious", label: "Suspicious Activity Detection" },
    ];

    return (
        <div>
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Security Settings</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Manage your password, account protection, and secure access preferences.</p>
            </div>

            <div className="bg-(--db-main-bg) p-6.25">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div className="space-y-5">
                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-5">Password Security</h3>
                            <div className="space-y-4 mb-5">
                                <PasswordInput label="Current Password" show={showCurrent} onToggle={() => setShowCurrent((p) => !p)} placeholder="****************" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                <PasswordInput label="New Password" show={showNew} onToggle={() => setShowNew((p) => !p)} placeholder="****************" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <PasswordInput label="Confirm New Password" show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} placeholder="****************" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            {pwError && <p className="text-red-400 text-sm mb-3">{pwError}</p>}
                            {pwSuccess && <p className="text-green-400 text-sm mb-3">{pwSuccess}</p>}
                            <ModalButton className="py-2.25! max-w-fit px-3" onClick={handleChangePassword} disabled={pwLoading}>
                                {pwLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                            </ModalButton>
                        </div>

                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-4">Active Sessions</h3>
                            <div className="bg-(--db-main-bg) p-4.5 mb-4">
                                <p className="text-[15px] font-medium text-(--db-text-primary) mb-1.5">Windows Desktop · Chrome</p>
                                <div className="flex items-center gap-1 text-[13px] text-[#D28A44] mb-2">
                                    <SavedLocIcon />
                                    <span>Abu Dhabi, UA</span>
                                </div>
                                <p className="text-[15px] font-medium text-(--db-text-primary) mb-1.5">Last Active: 10 mins ago</p>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-(--db-text-primary)">
                                    <div className="w-2 h-2 rounded-full bg-[#5E9F62] shrink-0" />
                                    <span>Current Session</span>
                                </div>
                            </div>
                            <ModalButton className="py-3! max-w-fit px-6">LOGOUT DEVICE</ModalButton>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-4">Two-Factor Authentication</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-[#5E9F62] shrink-0" />
                                <span className="text-sm font-semibold text-(--db-text-primary)">2FA Disabled</span>
                            </div>
                            <p className="text-[13px] text-(--db-text-primary) mb-4">Your account currently uses password-only authentication.</p>
                            <ModalButton className="py-2.25! max-w-fit px-6">ENABLE 2FA</ModalButton>
                        </div>

                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-4">Login Activity</h3>
                            <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">Successful login — Chrome on Windows</p>
                            <p className="text-[13px] text-(--db-text-primary) mb-3.5">Today · 10:42 AM</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">New device login</p>
                                    <p className="text-[13px] text-(--db-text-primary)">Last week</p>
                                </div>
                                <div>
                                    <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">Password updated</p>
                                    <p className="text-[13px] text-(--db-text-primary)">3 days ago</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-(--db-sidebar-bg) p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-4">Security Preferences</h3>
                            <div className="space-y-3.75">
                                {secPrefs.map(({ key, label }) => (
                                    <div key={key} className="flex bg-(--db-main-bg) p-3.75 items-center justify-between gap-4">
                                        <span className="text-sm font-normal text-(--db-text-primary)">{label}</span>
                                        <Toggle checked={prefs[key]} onChange={() => togglePref(key)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function NotificationsTab() {
    const [mainToggles, setMainToggles] = useState<Record<string, boolean>>({
        email: true, push: true, sms: false,
    });
    const [aiAlerts, setAiAlerts] = useState<Set<string>>(
        () => new Set(["Price Drop Alerts", "New Listings in Saved Areas", "Market Trend Shifts", "ROI Opportunity Flags"])
    );
    const [marketUpdate, setMarketUpdate] = useState("Daily");
    const [sensitivity, setSensitivity]   = useState("Medium");
    const [summary, setSummary]           = useState("Weekly Summary");
    const [districts, setDistricts] = useState<Set<string>>(
        () => new Set(["Downtown Dubai", "Dubai Marina"])
    );
    const [accountToggles, setAccountToggles] = useState<Record<string, boolean>>({
        property_saved: true, deal_analyzed: true, report_ready: true, profile_updated: false,
    });

    const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
        setter((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

    return (
        <div>
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">Notification Settings</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Control how and when you receive notifications.</p>
            </div>

            <div className="bg-(--db-main-bg) p-5">
                <div className="space-y-3 mb-5">
                    {NOTIF_MAIN_TOGGLES.map((item) => (
                        <div key={item.id} className="bg-(--db-sidebar-bg) rounded-sm p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-(--db-text-primary) mb-0.5">{item.label}</p>
                                <p className="text-[13px] text-(--db-text-primary)">{item.desc}</p>
                            </div>
                            <Toggle
                                checked={mainToggles[item.id] ?? false}
                                onChange={() => setMainToggles((p) => ({ ...p, [item.id]: !p[item.id] }))}
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[288px_auto] gap-5 mb-5">
                    <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                        <p className="text-[17px] font-semibold text-[#D28A44] mb-4">AI Market Alerts</p>
                        <div className="grid grid-cols-1 gap-4.75">
                            {NOTIF_AI_ALERTS.map((label) => (
                                <Checkbox
                                    key={label}
                                    label={label}
                                    checked={aiAlerts.has(label)}
                                    onChange={() => toggleSet(setAiAlerts, label)}
                                    textCls="text-sm font-normal text-(--db-text-primary)"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <p className="text-[17px] font-semibold text-[#D28A44] mb-3">Notification Frequency</p>
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Market Updates</p>
                                        <div className="relative">
                                            <select value={marketUpdate} onChange={(e) => setMarketUpdate(e.target.value)} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
                                                {NOTIF_MARKET_UPDATE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Alert Sensitivity</p>
                                        <div className="relative">
                                            <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
                                                {NOTIF_SENSITIVITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Weekly Summary</p>
                                    <div className="relative">
                                        <select value={summary} onChange={(e) => setSummary(e.target.value)} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
                                            {NOTIF_SUMMARY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                        </select>
                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <p className="text-[15px] font-semibold text-(--db-text-primary) mb-3">Preferred District Alerts</p>
                            <div className="flex flex-wrap gap-x-5 gap-y-2">
                                {NOTIF_DISTRICTS.map((d) => (
                                    <Checkbox key={d} label={d} checked={districts.has(d)} onChange={() => toggleSet(setDistricts, d)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-(--db-sidebar-bg) rounded-sm p-5 mb-5">
                    <p className="text-[15px] font-semibold text-(--db-text-primary) mb-4">Account Notifications</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {NOTIF_ACCOUNT_TOGGLES.map((item) => (
                            <div key={item.id} className="flex bg-(--db-main-bg) p-3.5 rounded-sm items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-(--db-text-primary)">{item.label}</p>
                                    <p className="text-[13px] text-(--db-text-primary)">{item.desc}</p>
                                </div>
                                <Toggle
                                    checked={accountToggles[item.id] ?? false}
                                    onChange={() => setAccountToggles((p) => ({ ...p, [item.id]: !p[item.id] }))}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIPreferencesTab() {
    const [investmentFocus, setInvestmentFocus] = useState<Set<string>>(() => new Set());
    const [insightLevel, setInsightLevel]       = useState<Set<string>>(() => new Set(["Basic Insights"]));
    const [aiDistricts, setAiDistricts]         = useState<Set<string>>(() => new Set());

    const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
        setter((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

    return (
        <div>
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">AI Preferences</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Customize how the AI assistant analyses and presents information for you.</p>
            </div>

            <div className="bg-(--db-main-bg) p-6.25">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                        <p className="text-[15px] font-semibold text-[#D28A44] mb-3">Preferred Investment Focus</p>
                        <div className="space-y-2.5">
                            {AI_PREF_INVESTMENT_FOCUS.map((item) => (
                                <Checkbox key={item} label={item} checked={investmentFocus.has(item)} onChange={() => toggleSet(setInvestmentFocus, item)} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                        <p className="text-[15px] font-semibold text-[#D28A44] mb-2">AI Insight Level</p>
                        <p className="text-[13px] text-(--db-text-primary) mb-3">Choose how detailed AI-generated analysis should be across the platform.</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                            {AI_PREF_INSIGHT_LEVELS.map((item) => (
                                <Checkbox key={item} label={item} checked={insightLevel.has(item)} onChange={() => toggleSet(setInsightLevel, item)} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-(--db-sidebar-bg) rounded-sm p-5 mb-5">
                    <p className="text-[15px] font-semibold text-[#D28A44] mb-3">Preferred Districts</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                        {AI_PREF_DISTRICTS.map((d) => (
                            <Checkbox key={d} label={d} checked={aiDistricts.has(d)} onChange={() => toggleSet(setAiDistricts, d)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfileSettingsPage() {
    const [activeTab, setActiveTab]       = useState("profile");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleTabClick = (id: string) => {
        if (id === "delete") { setDeleteModalOpen(true); return; }
        setActiveTab(id);
    };

    return (
        <div className="w-full">
            <div className="flex items-start flex-wrap justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Profile Settings</h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Manage your account preferences, security settings, notifications, and AI preferences profile.
                    </p>
                </div>
            </div>

            <div className="bg-(--db-sidebar-bg) p-5 rounded-none! grid grid-cols-[177px_auto] self-start">
                <nav className="w-full shrink-0 pr-5 h-fit space-y-4 md:sticky top-0">
                    {SETTINGS_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full text-left px-3 py-1.5 text-[13px] rounded-sm transition-colors ease-linear ${
                                tab.isDanger
                                    ? "mt-7.5 bg-[#CF2D481A] text-[#CF2D48] hover:bg-[#CF2D4830] font-normal"
                                    : activeTab === tab.id
                                        ? "bg-[#D28A4438] text-(--db-text-primary) font-medium"
                                        : "text-(--db-text-primary) font-normal hover:bg-[#D28A4438] hover:font-medium"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="flex-1 min-w-0 pl-5 border-l border-[#D28A4433]">
                    {activeTab === "profile"         && <MyProfileTab key="profile" />}
                    {activeTab === "security"        && <SecurityTab key="security" />}
                    {activeTab === "notifications"   && <NotificationsTab key="notifications" />}
                    {activeTab === "ai-preferences"  && <AIPreferencesTab key="ai-preferences" />}
                </div>
            </div>

            {deleteModalOpen && (
                <DeleteAccountModal
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={() => { setDeleteModalOpen(false); window.location.href = "/login"; }}
                />
            )}
        </div>
    );
}
