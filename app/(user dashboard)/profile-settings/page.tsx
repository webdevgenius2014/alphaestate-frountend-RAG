"use client";

import React, { useState, useEffect, useRef, type ReactNode } from "react";
import ModalButton from "@/app/components/ui/modal-button";
import { DeleteAccountModal } from "@/app/components/dashboard/alert-modals";
import appService from "@/app/services/appService";
import { getCookie, clearAuthCookies } from "@/app/services/interceptor";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import { formatDevice, getLocation, formatRelativeTime } from "@/app/utils/session";
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
import { toast } from "react-hot-toast";

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

function SectionTitle({ children, showEdit, onEdit }: { children: ReactNode; showEdit?: boolean; onEdit?: () => void }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-semibold text-[#D28A44]">{children}</h3>
            {showEdit && (
                <button onClick={onEdit} className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center">
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

function SaveBar({ label = "SAVE CHANGES", onCancel, onSave, saving }: { label?: string; onCancel?: () => void; onSave?: () => void; saving?: boolean }) {
    return (
        <div className="flex items-center gap-4 mt-2">
            <Button variant="primary" className="py-2.5!" onClick={onSave} disabled={saving}>
                {saving ? "SAVING..." : label}
            </Button>
            <ModalButton className="max-w-fit px-5 py-2.5!" onClick={onCancel}>CANCEL</ModalButton>
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
    const { updateUser } = useTheme();
    const [formOpen, setFormOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
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

    const loadProfile = () => {
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
                    if (data.avatarUrl) updateUser({ avatarUrl: data.avatarUrl });
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setAvatarUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await appService.uploadProfileAvatar(formData);
        setAvatarUploading(false);

        if (res?.status === 200 || res?.status === 201) {
            const data = res.data?.data ?? res.data;
            const newAvatarUrl = data?.avatarUrl ?? data?.avatar;
            setProfile((prev: any) => (prev ? { ...prev, avatarUrl: newAvatarUrl ?? prev.avatarUrl } : prev));
            if (newAvatarUrl) updateUser({ avatarUrl: newAvatarUrl });
            toast.success("Profile photo updated successfully.");
        } else {
            toast.error(res?.data?.error || res?.data?.message || "Failed to upload photo.");
        }
    };

    const handleChange =
        (key: keyof ProfileForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const location = [profile?.cityState, profile?.countryRegion].filter(Boolean).join(", ") || "—";

    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => {
        setSaving(true);
        const res = await appService.updateUserProfile({
            fullName: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phoneCode: form.phoneCode,
            phoneNumber: form.phone,
            countryRegion: form.country,
            cityState: form.city,
            bio: form.bio,
        });
        setSaving(false);

        if (res?.status === 200 || res?.status === 201) {
            const data = res.data?.data ?? res.data;
            setProfile(data);
            toast.success("Profile updated successfully.");
            setFormOpen(false);
        } else {
            toast.error(res?.data?.error || res?.data?.message || "Failed to update profile.");
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)]">
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">My Profile</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Manage your personal account information and profile details.</p>
            </div>

            <div className="bg-(--db-main-bg) p-6.25">
                {/* Avatar + summary row */}
                <div className="w-full">
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
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={avatarUploading}
                                    className="absolute bottom-0.5 right-0.5 w-5.75 h-5.75 bg-[#D28A44] rounded-full flex items-center justify-center text-white shadow-sm disabled:opacity-60"
                                    title="Change photo"
                                >
                                    <SettingsCameraIcon />
                                </button>
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
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

                        {!formOpen && (
                            <button onClick={() => setFormOpen(true)} className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center shrink-0">
                                <SettingsPencilIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* Personal information form — accordion */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${formOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"}`}>
                    <hr className="pb-4 mt-6 border-[#D28A4433]" />
                <div className="w-full mb-6.5">
                    <SectionTitle showEdit onEdit={() => setFormOpen(false)}>Personal Information</SectionTitle>

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

                <SaveBar onCancel={() => setFormOpen(false)} onSave={handleSaveProfile} saving={saving} />
                </div>
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

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setPwLoading(true);
        try {
            const res = await appService.changePassword({ currentPassword, newPassword });
            if (res?.status === 200 || res?.status === 201) {
                toast.success("Password updated successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(res?.data?.error || res?.data?.message || "Failed to update password.");
            }
        } finally {
            setPwLoading(false);
        }
    };

    const [prefs, setPrefs] = useState({ email: true, newDevice: true, suspicious: true });
    const [prefsLoading, setPrefsLoading] = useState({ email: false, newDevice: false, suspicious: false });

    useEffect(() => {
        appService.getNotificationPreferences().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (d) {
                setPrefs({
                    email: d.emailLoginAlertsEnabled ?? true,
                    newDevice: d.newDeviceNotificationsEnabled ?? true,
                    suspicious: d.suspiciousActivityDetectionEnabled ?? true,
                });
            }
        });
    }, []);

    const handleTogglePref = async (key: keyof typeof prefs) => {
        const prevPrefs = prefs;
        const nextPrefs = { ...prefs, [key]: !prefs[key] };

        setPrefs(nextPrefs);
        setPrefsLoading((p) => ({ ...p, [key]: true }));

        const res = await appService.updateNotificationPreferences({
            emailLoginAlertsEnabled: nextPrefs.email,
            newDeviceNotificationsEnabled: nextPrefs.newDevice,
            suspiciousActivityDetectionEnabled: nextPrefs.suspicious,
        });
        setPrefsLoading((p) => ({ ...p, [key]: false }));

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("Notification preference updated.");
        } else {
            setPrefs(prevPrefs);
            toast.error(res?.data?.message || "Failed to update notification preference.");
        }
    };

    const secPrefs: { key: keyof typeof prefs; label: string }[] = [
        { key: "email",      label: "Email Login Alerts" },
        { key: "newDevice",  label: "New Device Notifications" },
        { key: "suspicious", label: "Suspicious Activity Detection" },
    ];

    const [twoFaEnabled, setTwoFaEnabled] = useState(false);
    const [twoFaLoading, setTwoFaLoading] = useState(false);

    useEffect(() => {
        appService.getUserProfile().then((res) => {
            if (res?.data?.success && res.data.data) {
                setTwoFaEnabled(!!res.data.data.isTwoFactorEnabled);
            }
        });
    }, []);

    type SessionRow = { id: string; device: string; location: string; lastActive: string; isCurrent: boolean };
    const [sessions, setSessions] = useState<SessionRow[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [logoutLoadingId, setLogoutLoadingId] = useState<string | null>(null);

    useEffect(() => {
        appService.getSessions().then(async (res) => {
            const list = res?.data?.data ?? res?.data;
            if (!Array.isArray(list)) {
                setSessionsLoading(false);
                return;
            }
            const currentSessionId = getCookie("session_id");
            const rows = await Promise.all(
                list.map(async (s: any): Promise<SessionRow> => ({
                    id: s.id,
                    device: formatDevice(s.userAgent ?? null),
                    location: await getLocation(s.ipAddress ?? s.ip ?? null),
                    lastActive: formatRelativeTime(s.lastUsedAt ?? s.lastUsed ?? null),
                    isCurrent: !!currentSessionId && s.id === currentSessionId,
                }))
            );
            setSessions(rows);
            setSessionsLoading(false);
        }).catch(() => setSessionsLoading(false));
    }, []);

    const handleLogoutSession = async (id: string) => {
        setLogoutLoadingId(id);
        const res = await appService.logoutSession(id);
        setLogoutLoadingId(null);

        if (res?.data?.success || res?.status === 200 || res?.status === 204) {
            setSessions((prev) => prev.filter((s) => s.id !== id));
            toast.success("Device logged out successfully.");
        } else {
            toast.error(res?.data?.message || "Failed to logout device.");
        }
    };

    const [currentSessionLoading, setCurrentSessionLoading] = useState(false);

    const handleLogoutCurrentSession = async () => {
        const sessionId = getCookie("session_id");
        if (!sessionId) {
            toast.error("No active session found.");
            return;
        }

        setCurrentSessionLoading(true);
        const res = await appService.logoutSessionBySessionId(sessionId);
        setCurrentSessionLoading(false);

        if (res?.data?.success || res?.status === 200 || res?.status === 204) {
            clearAuthCookies();
            window.location.href = "/login";
        } else {
            toast.error(res?.data?.message || "Failed to logout device.");
        }
    };

    const handleToggle2Fa = async () => {
        setTwoFaLoading(true);
        const res = await appService.toggleUserProfile2Fa({ enabled: !twoFaEnabled });
        setTwoFaLoading(false);

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            setTwoFaEnabled((prev) => !prev);
            toast.success(!twoFaEnabled ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
        } else {
            toast.error(res?.data?.message || "Failed to update two-factor authentication.");
        }
    };

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
                            <ModalButton className="py-3! max-w-fit px-6" onClick={handleLogoutCurrentSession} disabled={currentSessionLoading}>
                                {currentSessionLoading ? "LOGGING OUT..." : "LOGOUT DEVICE"}
                            </ModalButton>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-4">Two-Factor Authentication</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${twoFaEnabled ? "bg-[#5E9F62]" : "bg-[#CF2D48]"}`} />
                                <span className="text-sm font-semibold text-(--db-text-primary)">{twoFaEnabled ? "2FA Enabled" : "2FA Disabled"}</span>
                            </div>
                            <p className="text-[13px] text-(--db-text-primary) mb-4">
                                {twoFaEnabled ? "Your account is protected with two-factor authentication." : "Your account currently uses password-only authentication."}
                            </p>
                            <ModalButton className="py-2.25! max-w-fit px-6" onClick={handleToggle2Fa} disabled={twoFaLoading}>
                                {twoFaLoading ? "UPDATING..." : twoFaEnabled ? "DISABLE 2FA" : "ENABLE 2FA"}
                            </ModalButton>
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
                                        <Toggle checked={prefs[key]} onChange={() => !prefsLoading[key] && handleTogglePref(key)} />
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

const AI_ALERT_FIELD_MAP: Record<string, string> = {
    "Price Drop Alerts": "priceDropAlertsEnabled",
    "New Listings in Saved Areas": "newListingsInSavedAreasEnabled",
    "Market Trend Shifts": "marketTrendShiftsEnabled",
    "Investment Score Changes": "investmentScoreChangesEnabled",
    "ROI Opportunity Flags": "roiOpportunityFlagsEnabled",
    "Rental Yield Updates": "rentalYieldUpdatesEnabled",
    "Comparable Sales Alerts": "comparableSalesAlertsEnabled",
    "District Development News": "districtDevelopmentNewsEnabled",
};

const ACCOUNT_TOGGLE_FIELD_MAP: Record<string, string> = {
    property_saved: "propertySavedEnabled",
    deal_analyzed: "dealAnalyzedEnabled",
    report_ready: "reportReadyEnabled",
    profile_updated: "profileUpdatedEnabled",
};

const FREQUENCY_TO_API: Record<string, string> = { "Daily": "daily", "Weekly": "weekly", "Monthly": "monthly", "Never": "never" };
const API_TO_FREQUENCY: Record<string, string> = Object.fromEntries(Object.entries(FREQUENCY_TO_API).map(([k, v]) => [v, k]));

const SENSITIVITY_TO_API: Record<string, string> = { "Low": "low", "Medium": "medium", "High": "high" };
const API_TO_SENSITIVITY: Record<string, string> = Object.fromEntries(Object.entries(SENSITIVITY_TO_API).map(([k, v]) => [v, k]));

const SUMMARY_TO_API: Record<string, string> = {
    "Weekly Summary": "weekly_summary",
    "Bi-Weekly": "bi_weekly",
    "Monthly": "monthly",
    "Never": "never",
};
const API_TO_SUMMARY: Record<string, string> = Object.fromEntries(Object.entries(SUMMARY_TO_API).map(([k, v]) => [v, k]));

function NotificationsTab() {
    const [mainToggles, setMainToggles] = useState<Record<string, boolean>>({
        email: true, push: true, sms: false,
    });
    const [mainToggleLoading, setMainToggleLoading] = useState<Record<string, boolean>>({});

    const [aiAlerts, setAiAlerts] = useState<Set<string>>(
        () => new Set(["Price Drop Alerts", "New Listings in Saved Areas", "Market Trend Shifts", "ROI Opportunity Flags"])
    );
    const [aiAlertLoading, setAiAlertLoading] = useState<Record<string, boolean>>({});

    const [marketUpdate, setMarketUpdate] = useState("Daily");
    const [sensitivity, setSensitivity]   = useState("Medium");
    const [summary, setSummary]           = useState("Weekly Summary");
    const [selectLoading, setSelectLoading] = useState({ marketUpdate: false, sensitivity: false, summary: false });

    const [districts, setDistricts] = useState<Set<string>>(
        () => new Set(["Downtown Dubai", "Dubai Marina"])
    );
    const [districtLoading, setDistrictLoading] = useState<Record<string, boolean>>({});

    const [accountToggles, setAccountToggles] = useState<Record<string, boolean>>({
        property_saved: true, deal_analyzed: true, report_ready: true, profile_updated: false,
    });
    const [accountToggleLoading, setAccountToggleLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        appService.getNotificationPreferences().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (!d) return;

            setMainToggles((p) => ({
                ...p,
                push: d.pushNotificationsEnabled ?? p.push,
                sms: d.smsNotificationsEnabled ?? p.sms,
            }));

            setAiAlerts((prev) => {
                const next = new Set(prev);
                Object.entries(AI_ALERT_FIELD_MAP).forEach(([label, field]) => {
                    if (d[field] == null) return;
                    d[field] ? next.add(label) : next.delete(label);
                });
                return next;
            });

            if (d.marketUpdatesFrequency) setMarketUpdate(API_TO_FREQUENCY[d.marketUpdatesFrequency] ?? d.marketUpdatesFrequency);
            if (d.alertSensitivity) setSensitivity(API_TO_SENSITIVITY[d.alertSensitivity] ?? d.alertSensitivity);
            if (d.weeklySummary) setSummary(API_TO_SUMMARY[d.weeklySummary] ?? d.weeklySummary);
            if (Array.isArray(d.preferredDistricts)) setDistricts(new Set(d.preferredDistricts));

            setAccountToggles((p) => ({
                ...p,
                property_saved: d.propertySavedEnabled ?? p.property_saved,
                deal_analyzed: d.dealAnalyzedEnabled ?? p.deal_analyzed,
                report_ready: d.reportReadyEnabled ?? p.report_ready,
                profile_updated: d.profileUpdatedEnabled ?? p.profile_updated,
            }));
        });
    }, []);

    const patchPref = async (payload: Record<string, any>, revert: () => void) => {
        const res = await appService.updateNotificationPreferences(payload);
        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("Notification preference updated.");
        } else {
            revert();
            toast.error(res?.data?.message || "Failed to update notification preference.");
        }
    };

    const handleToggleMain = async (id: string) => {
        if (id !== "push" && id !== "sms") {
            setMainToggles((p) => ({ ...p, [id]: !p[id] }));
            return;
        }

        const prevValue = mainToggles[id];
        const nextValue = !prevValue;

        setMainToggles((p) => ({ ...p, [id]: nextValue }));
        setMainToggleLoading((p) => ({ ...p, [id]: true }));

        const payload = id === "push" ? { pushNotificationsEnabled: nextValue } : { smsNotificationsEnabled: nextValue };
        await patchPref(payload, () => setMainToggles((p) => ({ ...p, [id]: prevValue })));
        setMainToggleLoading((p) => ({ ...p, [id]: false }));
    };

    const handleToggleAiAlert = async (label: string) => {
        const field = AI_ALERT_FIELD_MAP[label];
        const wasChecked = aiAlerts.has(label);
        const nextChecked = !wasChecked;

        setAiAlerts((prev) => {
            const next = new Set(prev);
            nextChecked ? next.add(label) : next.delete(label);
            return next;
        });
        setAiAlertLoading((p) => ({ ...p, [label]: true }));

        await patchPref({ [field]: nextChecked }, () => setAiAlerts((prev) => {
            const next = new Set(prev);
            wasChecked ? next.add(label) : next.delete(label);
            return next;
        }));
        setAiAlertLoading((p) => ({ ...p, [label]: false }));
    };

    const handleMarketUpdateChange = async (value: string) => {
        const prevValue = marketUpdate;
        setMarketUpdate(value);
        setSelectLoading((p) => ({ ...p, marketUpdate: true }));
        await patchPref({ marketUpdatesFrequency: FREQUENCY_TO_API[value] ?? value }, () => setMarketUpdate(prevValue));
        setSelectLoading((p) => ({ ...p, marketUpdate: false }));
    };

    const handleSensitivityChange = async (value: string) => {
        const prevValue = sensitivity;
        setSensitivity(value);
        setSelectLoading((p) => ({ ...p, sensitivity: true }));
        await patchPref({ alertSensitivity: SENSITIVITY_TO_API[value] ?? value }, () => setSensitivity(prevValue));
        setSelectLoading((p) => ({ ...p, sensitivity: false }));
    };

    const handleSummaryChange = async (value: string) => {
        const prevValue = summary;
        setSummary(value);
        setSelectLoading((p) => ({ ...p, summary: true }));
        await patchPref({ weeklySummary: SUMMARY_TO_API[value] ?? value }, () => setSummary(prevValue));
        setSelectLoading((p) => ({ ...p, summary: false }));
    };

    const handleToggleDistrict = async (district: string) => {
        const wasChecked = districts.has(district);
        const nextChecked = !wasChecked;
        const nextDistricts = new Set(districts);
        nextChecked ? nextDistricts.add(district) : nextDistricts.delete(district);

        setDistricts(nextDistricts);
        setDistrictLoading((p) => ({ ...p, [district]: true }));

        await patchPref({ preferredDistricts: Array.from(nextDistricts) }, () => setDistricts(districts));
        setDistrictLoading((p) => ({ ...p, [district]: false }));
    };

    const handleToggleAccount = async (id: string) => {
        const field = ACCOUNT_TOGGLE_FIELD_MAP[id];
        const prevValue = accountToggles[id];
        const nextValue = !prevValue;

        setAccountToggles((p) => ({ ...p, [id]: nextValue }));
        setAccountToggleLoading((p) => ({ ...p, [id]: true }));

        await patchPref({ [field]: nextValue }, () => setAccountToggles((p) => ({ ...p, [id]: prevValue })));
        setAccountToggleLoading((p) => ({ ...p, [id]: false }));
    };

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
                                onChange={() => !mainToggleLoading[item.id] && handleToggleMain(item.id)}
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
                                    onChange={() => !aiAlertLoading[label] && handleToggleAiAlert(label)}
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
                                            <select value={marketUpdate} onChange={(e) => handleMarketUpdateChange(e.target.value)} disabled={selectLoading.marketUpdate} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
                                                {NOTIF_MARKET_UPDATE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Alert Sensitivity</p>
                                        <div className="relative">
                                            <select value={sensitivity} onChange={(e) => handleSensitivityChange(e.target.value)} disabled={selectLoading.sensitivity} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
                                                {NOTIF_SENSITIVITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Weekly Summary</p>
                                    <div className="relative">
                                        <select value={summary} onChange={(e) => handleSummaryChange(e.target.value)} disabled={selectLoading.summary} className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}>
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
                                    <Checkbox key={d} label={d} checked={districts.has(d)} onChange={() => !districtLoading[d] && handleToggleDistrict(d)} />
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
                                    onChange={() => !accountToggleLoading[item.id] && handleToggleAccount(item.id)}
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
