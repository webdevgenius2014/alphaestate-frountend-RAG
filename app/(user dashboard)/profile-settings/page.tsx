"use client";

import React, { useState, type ReactNode } from "react";
import ModalButton from "@/app/components/ui/modal-button";
import { DeleteAccountModal } from "@/app/components/dashboard/alert-modals";
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

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
    return (
        <FormField label={label}>
            <div className="relative">
                <select defaultValue={defaultValue} className={`${inputCls} appearance-none cursor-pointer`}>
                    {options.map((o) => <option key={o}>{o}</option>)}
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


function MyProfileTab() {
    return (
        <div>
            <div className="mb-4.5">
                <h1 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">My Profile</h1>
                <p className="text-sm text-(--db-text-primary) font-normal">Manage your personal account information and profile details.</p>
            </div>

            <div className="bg-(--db-main-bg) p-6.25">
                <div className="mb-5 pb-6 border-b border-[#D28A4433]">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-7">
                            <div className="relative shrink-0">
                                <div className="w-27.25 h-27.25 rounded-full flex items-center justify-center">
                                    <img src="/favicon.ico" alt="" className="object-cover rounded-full" />
                                </div>
                                <button
                                    className="absolute bottom-0.5 right-0.5 w-5.75 h-5.75 bg-[#D28A44] rounded-full flex items-center justify-center text-white shadow-sm"
                                    title="Change photo"
                                >
                                    <SettingsCameraIcon />
                                </button>
                            </div>
                            <div>
                                <h2 className="text-[19px] font-medium text-(--db-text-primary)">Jammy Roy</h2>
                                <p className="text-[13px] text-(--db-text-primary) font-normal mb-1">User Admin</p>
                                <p className="text-sm text-(--db-text-primary) font-normal mb-2.25">jammyroy@estatealpha.ai</p>
                                <div className="flex items-center gap-1 text-[13px] text-[#D28A44]">
                                    <SavedLocIcon />
                                    <span>Abu Dhabi, UAE</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-7.5 h-7.5 rounded-sm flex justify-center items-center">
                            <SettingsPencilIcon />
                        </button>
                    </div>
                </div>

                <div className="w-full mb-6.5">
                    <SectionTitle showEdit>Personal Information</SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <FormField label="First Name">
                            <input type="text" placeholder="Jammy" className={inputCls} />
                        </FormField>
                        <FormField label="Last Name">
                            <input type="text" placeholder="Roy" className={inputCls} />
                        </FormField>
                        <FormField label="Email Address">
                            <input type="email" placeholder="jammyroy@estatealpha.ai" className={inputCls} />
                        </FormField>
                        <FormField label="Phone Number">
                            <input type="tel" placeholder="+23 8787876888" className={inputCls} />
                        </FormField>
                        <SelectField label="Country / Region" options={PROFILE_COUNTRIES} defaultValue="United Arab Emirates" />
                        <SelectField label="City / State" options={PROFILE_CITIES} defaultValue="Abu Dhabi" />
                    </div>

                    <FormField label="Short Bio">
                        <textarea
                            rows={4}
                            placeholder="Managing premium real estate investments and market research across Abu Dhabi districts."
                            className={`${inputCls} resize-none`}
                        />
                    </FormField>

                    <h3 className="text-[17px] font-semibold text-[#D28A44] mt-7 mb-3.5">Account Information</h3>
                    <div className="bg-(--db-sidebar-bg) p-5 flex flex-wrap gap-20">
                        {[
                            { label: "Member Since", value: "January 2025" },
                            { label: "Last Login", value: "Today · 10:42 AM" },
                            { label: "Active Sessions", value: "2 Devices Connected" },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-[15px] font-medium text-(--db-text-primary) mb-0.5">{s.label}</p>
                                <p className="text-[13px] text-(--db-text-primary)">{s.value}</p>
                            </div>
                        ))}
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
    const [prefs, setPrefs] = useState({ email: true, newDevice: true, suspicious: true });
    const togglePref = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

    const secPrefs: { key: keyof typeof prefs; label: string }[] = [
        { key: "email", label: "Email Login Alerts" },
        { key: "newDevice", label: "New Device Notifications" },
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
                                <PasswordInput label="Current Password" show={showCurrent} onToggle={() => setShowCurrent((p) => !p)} placeholder="****************" />
                                <PasswordInput label="New Password" show={showNew} onToggle={() => setShowNew((p) => !p)} placeholder="****************" />
                                <PasswordInput label="Confirm New Password" show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} placeholder="****************" />
                            </div>
                            <ModalButton className="py-2.25! max-w-fit px-3">UPDATE PASSWORD</ModalButton>
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
    const [sensitivity, setSensitivity] = useState("Medium");
    const [summary, setSummary] = useState("Weekly Summary");
    const [districts, setDistricts] = useState<Set<string>>(
        () => new Set(["Downtown Dubai", "Dubai Marina"])
    );
    const [accountToggles, setAccountToggles] = useState<Record<string, boolean>>({
        property_saved: true, deal_analyzed: true, report_ready: true, profile_updated: false,
    });

    const toggleAiAlert = (key: string) =>
        setAiAlerts((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

    const toggleDistrict = (key: string) =>
        setDistricts((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

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
                                    onChange={() => toggleAiAlert(label)}
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
                                            <select
                                                value={marketUpdate}
                                                onChange={(e) => setMarketUpdate(e.target.value)}
                                                className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}
                                            >
                                                {NOTIF_MARKET_UPDATE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Alert Sensitivity</p>
                                        <div className="relative">
                                            <select
                                                value={sensitivity}
                                                onChange={(e) => setSensitivity(e.target.value)}
                                                className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}
                                            >
                                                {NOTIF_SENSITIVITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                                            </select>
                                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--db-text-muted)"><SelectChevron /></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="block text-[15px] font-medium text-(--db-text-primary) mb-2">Weekly Summary</p>
                                    <div className="relative">
                                        <select
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            className={`${inputCls} bg-(--db-main-bg)! appearance-none pr-8`}
                                        >
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
                                    <Checkbox
                                        key={d}
                                        label={d}
                                        checked={districts.has(d)}
                                        onChange={() => toggleDistrict(d)}
                                    />
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
                {/* Top 2-col: Investment Focus | AI Insight Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                        <p className="text-[15px] font-semibold text-[#D28A44] mb-3">Preferred Investment Focus</p>
                        <div className="space-y-2.5">
                            {AI_PREF_INVESTMENT_FOCUS.map((item) => (
                                <Checkbox
                                    key={item}
                                    label={item}
                                    checked={investmentFocus.has(item)}
                                    onChange={() => toggleSet(setInvestmentFocus, item)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--db-sidebar-bg) rounded-sm p-5">
                        <p className="text-[15px] font-semibold text-[#D28A44] mb-2">AI Insight Level</p>
                        <p className="text-[13px] text-(--db-text-primary) mb-3">Choose how detailed AI-generated analysis should be across the platform.</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                            {AI_PREF_INSIGHT_LEVELS.map((item) => (
                                <Checkbox
                                    key={item}
                                    label={item}
                                    checked={insightLevel.has(item)}
                                    onChange={() => toggleSet(setInsightLevel, item)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-(--db-sidebar-bg) rounded-sm p-5 mb-5">
                    <p className="text-[15px] font-semibold text-[#D28A44] mb-3">Preferred Districts</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                        {AI_PREF_DISTRICTS.map((d) => (
                            <Checkbox
                                key={d}
                                label={d}
                                checked={aiDistricts.has(d)}
                                onChange={() => toggleSet(setAiDistricts, d)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


const TAB_PANELS: Record<string, ReactNode> = {
    profile: <MyProfileTab />,
    security: <SecurityTab />,
    notifications: <NotificationsTab />,
    "ai-preferences": <AIPreferencesTab />,
};

export default function ProfileSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
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
                            className={`w-full text-left px-3 py-1.5 text-[13px] rounded-sm transition-colors ease-linear ${tab.isDanger ? "mt-7.5 bg-[#CF2D481A] text-[#CF2D48] hover:bg-[#CF2D4830] font-normal" : activeTab === tab.id ? "bg-[#D28A4438] text-(--db-text-primary) font-medium" : "text-(--db-text-primary) font-normal hover:bg-[#D28A4438] hover:font-medium"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="flex-1 min-w-0 pl-5 border-l border-[#D28A4433]">
                    {TAB_PANELS[activeTab]}
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
