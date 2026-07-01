"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
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
    const [security, setSecurity] = useState({ twoFA: true, sessionTimeout: "30 Minutes", passwordPolicy: "Strong Password Required" });
    const [notifs, setNotifs] = useState({ email: true, systemHealth: true });

    const setG = (k: keyof typeof general) => (e: React.ChangeEvent<HTMLInputElement>) => setGeneral((p) => ({ ...p, [k]: e.target.value }));

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
                            <Toggle checked={security.twoFA} onChange={() => setSecurity((p) => ({ ...p, twoFA: !p.twoFA }))} />
                        </div>

                        <Select label="Session Timeout" options={["15 Minutes", "30 Minutes", "1 Hour", "4 Hours", "Never"]} value={security.sessionTimeout} onChange={(v) => setSecurity((p) => ({ ...p, sessionTimeout: v }))} />

                        <div>
                            <label className={labelCls}>Password Policy</label>
                            <input type="text" value={security.passwordPolicy} onChange={(e) => setSecurity((p) => ({ ...p, passwordPolicy: e.target.value }))} placeholder="Strong Password Required" className={fieldCls} />
                        </div>
                    </div>

                    <div className="bg-(--db-main-bg) rounded-md p-5 flex flex-col gap-3">
                        <h3 className="text-[17px] font-medium text-(--db-text-primary)">Notifications</h3>

                        <div className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-sidebar-bg) rounded-[3px] px-4 py-3">
                            <span className="text-sm text-(--db-text-primary)">Email Notifications</span>
                            <Toggle checked={notifs.email} onChange={() => setNotifs((p) => ({ ...p, email: !p.email }))} />
                        </div>
                        <div className="flex items-center justify-between gap-4 border border-[#D28A441F] bg-(--db-sidebar-bg) rounded-[3px] px-4 py-3">
                            <span className="text-sm text-(--db-text-primary)">System Health Notifications</span>
                            <Toggle checked={notifs.systemHealth} onChange={() => setNotifs((p) => ({ ...p, systemHealth: !p.systemHealth }))} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Button variant="primary" className="py-2.5! max-w-fit px-8">SAVE CHANGES</Button>
            </div>
        </div>
    );
}
