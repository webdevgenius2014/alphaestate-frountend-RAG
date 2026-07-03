"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";
import { SelectChevron } from "@/app/(user dashboard)/constants";
import { fieldCls, inputCls, labelCls, selCls } from "@/app/(admin dashboard)/constants";


function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button type="button" onClick={onChange} className={`relative w-13.75 h-6 rounded-full border transition-colors ease-linear shrink-0 ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-main-bg) border-(--db-toggle-border)"}`}>
            <div className={`absolute top-px w-5 h-5 rounded-full shadow transition-all ease-linear ${checked ? "right-0.5 bg-(--db-main-bg)" : "left-0.5 bg-[#D28A44]"}`} />
        </button>
    );
}

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <div className="relative">
                <select value={value} onChange={(e) => onChange(e.target.value)} className={selCls}>
                    {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><SelectChevron /></span>
            </div>
        </div>
    );
}

export function PlatformSystemSettings() {
    const [general, setGeneral] = useState({ platformName: "", supportEmail: "", timeZone: "UAE Standard Time", currency: "AED", language: "English" });
    const [savingGeneral, setSavingGeneral] = useState(false);
    const [security, setSecurity] = useState({ twoFA: true, sessionTimeout: "30 Minutes", passwordPolicy: "Strong Password Required" });
    const [twoFaLoading, setTwoFaLoading] = useState(false);
    const [notifs, setNotifs] = useState({ email: true, systemHealth: true });
    const [notifLoading, setNotifLoading] = useState({ email: false, systemHealth: false });

    const setG = (k: keyof typeof general) => (e: React.ChangeEvent<HTMLInputElement>) => setGeneral((p) => ({ ...p, [k]: e.target.value }));

    useEffect(() => {
        appService.getPlatformGeneralInfo().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (d) {
                setGeneral((p) => ({
                    platformName: d.platformName ?? p.platformName,
                    supportEmail: d.supportEmail ?? p.supportEmail,
                    timeZone: d.timeZone ?? p.timeZone,
                    currency: d.currency ?? p.currency,
                    language: d.language ?? p.language,
                }));
            }
        });
    }, []);

    const handleSaveGeneral = async () => {
        setSavingGeneral(true);
        const res = await appService.updatePlatformGeneralInfo({
            platformName: general.platformName,
            supportEmail: general.supportEmail,
            timeZone: general.timeZone,
            currency: general.currency,
            language: general.language,
        });
        setSavingGeneral(false);

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("General settings updated successfully.");
        } else {
            toast.error(res?.data?.message || "Failed to update general settings.");
        }
    };

    useEffect(() => {
        appService.getPlatformSecurityInfo().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (d) {
                setSecurity((p) => ({ ...p, twoFA: d.twoFactorAuthenticationEnabled ?? p.twoFA }));
            }
        });
    }, []);

    const handleToggleTwoFa = async () => {
        const prevValue = security.twoFA;
        const nextValue = !prevValue;

        setSecurity((p) => ({ ...p, twoFA: nextValue }));
        setTwoFaLoading(true);

        const res = await appService.updatePlatformSecurityInfo({ twoFactorAuthenticationEnabled: nextValue });
        setTwoFaLoading(false);

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("Security settings updated successfully.");
        } else {
            setSecurity((p) => ({ ...p, twoFA: prevValue }));
            toast.error(res?.data?.message || "Failed to update security settings.");
        }
    };

    useEffect(() => {
        appService.getAdminNotificationSettings().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (d) {
                setNotifs({
                    email: d.emailNotifications ?? d.email ?? true,
                    systemHealth: d.systemHealthNotifications ?? d.systemHealth ?? true,
                });
            }
        });
    }, []);

    const handleToggleNotif = async (key: keyof typeof notifs) => {
        const prevNotifs = notifs;
        const nextNotifs = { ...notifs, [key]: !notifs[key] };

        setNotifs(nextNotifs);
        setNotifLoading((p) => ({ ...p, [key]: true }));

        const res = await appService.updateAdminNotificationSettings({
            emailNotifications: nextNotifs.email,
            systemHealthNotifications: nextNotifs.systemHealth,
        });
        setNotifLoading((p) => ({ ...p, [key]: false }));

        if (res?.data?.success || res?.status === 200 || res?.status === 201) {
            toast.success("Notification settings updated successfully.");
        } else {
            setNotifs(prevNotifs);
            toast.error(res?.data?.message || "Failed to update notification settings.");
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">
            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">System Settings</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">Configure platform preferences, security settings, and operational controls.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* General Settings */}
                <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-4">
                    <h3 className="text-[17px] font-medium text-(--db-text-primary)">General Settings</h3>

                    <div>
                        <label className={labelCls}>Platform Name</label>
                        <input type="text" value={general.platformName} onChange={setG("platformName")} placeholder="Alpha Estate" className={fieldCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Support Email</label>
                        <input type="email" value={general.supportEmail} onChange={setG("supportEmail")} placeholder="support@alphaestate.ai" className={fieldCls} />
                    </div>
                    <Select label="Time Zone" options={["UAE Standard Time", "GMT", "UTC+4", "EST", "PST"]} value={general.timeZone} onChange={(v) => setGeneral((p) => ({ ...p, timeZone: v }))} />
                    <Select label="Default Currency" options={["AED", "USD", "EUR", "GBP", "SAR"]} value={general.currency} onChange={(v) => setGeneral((p) => ({ ...p, currency: v }))} />
                    <Select label="Language" options={["English", "Arabic", "French", "Spanish"]} value={general.language} onChange={(v) => setGeneral((p) => ({ ...p, language: v }))} />
                </div>

                {/* Security + Notifications */}
                <div className="flex flex-col gap-5">
                    <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-4">
                        <h3 className="text-[17px] font-medium text-(--db-text-primary)">Security Settings</h3>

                        <div className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-sidebar-bg) rounded-[3px] px-4 py-3">
                            <span className="text-sm text-(--db-text-primary)">Two-Factor Authentication</span>
                            <Toggle checked={security.twoFA} onChange={() => !twoFaLoading && handleToggleTwoFa()} />
                        </div>
                        {/* Could be used further */}

                        {/* <Select label="Session Timeout" options={["15 Minutes", "30 Minutes", "1 Hour", "4 Hours", "Never"]} value={security.sessionTimeout} onChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))} />

                        <div>
                            <label className={labelCls}>Password Policy</label>
                            <input type="text" value={security.passwordPolicy} onChange={(e) => setSecurity((p) => ({ ...p, passwordPolicy: e.target.value }))} placeholder="Strong Password Required" className={fieldCls} />
                        </div> */}
                    </div>

                    <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-3">
                        <h3 className="text-[17px] font-medium text-(--db-text-primary)">Notifications</h3>

                        <div className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-sidebar-bg) rounded-[3px] px-4 py-3">
                            <span className="text-sm text-(--db-text-primary)">Email Notifications</span>
                            <Toggle checked={notifs.email} onChange={() => !notifLoading.email && handleToggleNotif("email")} />
                        </div>
                        <div className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-sidebar-bg) rounded-[3px] px-4 py-3">
                            <span className="text-sm text-(--db-text-primary)">System Health Notifications</span>
                            <Toggle checked={notifs.systemHealth} onChange={() => !notifLoading.systemHealth && handleToggleNotif("systemHealth")} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Button variant="primary" className="py-2.5! max-w-fit px-8" onClick={handleSaveGeneral} disabled={savingGeneral}>
                    {savingGeneral ? "SAVING..." : "SAVE CHANGES"}
                </Button>
            </div>
        </div>
    );
}
