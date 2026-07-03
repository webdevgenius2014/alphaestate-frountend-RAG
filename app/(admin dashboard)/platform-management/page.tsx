"use client";

import { useState } from "react";
import { PLATFORM_TABS } from "../constants";
import { PlatformSystemSettings } from "@/app/components/dashboard/platform-system-settings";
import { PlatformRolesPermissions } from "@/app/components/dashboard/platform-roles-permissions";
import { PlatformActivityLogs } from "@/app/components/dashboard/platform-activity-logs";
import { PlatformAPIConnections } from "@/app/components/dashboard/platform-api-connections";

type TabId = typeof PLATFORM_TABS[number]["id"];

export default function PlatformManagementPage() {
    const [activeTab, setActiveTab] = useState<TabId>("system-settings");

    return (
        <div className="flex flex-col gap-6">

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                        Platform Management
                    </h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Manage system settings, user permissions, integrations, and platform operations from a centralized control center.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <div className="flex items-center gap-2.5 overflow-x-auto">
                    {PLATFORM_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`shrink-0 px-5 py-2.5 uppercase rounded-sm text-sm font-semibold transition-colors border whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "border-[#D28A44] bg-[#D28A44] text-white"
                                    : "border-[#0B1F3A] text-(--db-text-primary) hover:bg-[#D28A44] hover:border-[#D28A44] hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "system-settings"   && <PlatformSystemSettings />}
            {/* Could be used further */}
            {/* {activeTab === "roles-permissions" && <PlatformRolesPermissions />} */}
            {activeTab === "activity-logs"     && <PlatformActivityLogs />}
            {activeTab === "api-connections"   && <PlatformAPIConnections />}

        </div>
    );
}
