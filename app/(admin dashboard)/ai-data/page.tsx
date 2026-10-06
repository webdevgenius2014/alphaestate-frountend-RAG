"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AIChatMonitoring } from "@/app/components/dashboard/ai-chat-monitoring";
import { AIIntelligenceEngine } from "@/app/components/dashboard/ai-intelligence-engine";
import { DistrictDataManagement } from "@/app/components/dashboard/district-data-management";
import { MarketAnalyticsData } from "@/app/components/dashboard/market-analytics-data";
import { DealAnalyzerRecords } from "@/app/components/dashboard/deal-analyzer-records";
import { RentalIngestionManagement } from "@/app/components/dashboard/rental-ingestion-management";
import { DistrictDetailDrawer } from "@/app/components/dashboard/district-detail-drawer";
import { TABS, type DistrictDetail } from "../constants";

type TabId = typeof TABS[number]["id"];

function isTabId(value: string | null): value is TabId {
    return TABS.some((t) => t.id === value);
}

function AIDataPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get("tab");
    const activeTab: TabId = isTabId(tabParam) ? tabParam : "chat-monitoring";
    const setActiveTab = (id: TabId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", id);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    const [drawerRecord, setDrawerRecord] = useState<DistrictDetail | null>(null);

    return (
        <div className="flex flex-col gap-6">

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                        AI & Data
                    </h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Monitor AI interactions, usage analytics, model performance, and platform data.
                    </p>
                </div>
            </div>

            <div className="border-b border-(--db-border)">
                <div className="flex items-center gap-2.5 overflow-x-auto">
                    {TABS.map((tab) => (
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

            {activeTab === "chat-monitoring" && <AIChatMonitoring />}
            {activeTab === "intelligence-engine" && <AIIntelligenceEngine />}
            {activeTab === "data-management" && <DistrictDataManagement onEye={(d) => setDrawerRecord(d)} />}
            {activeTab === "market-analytics" && <MarketAnalyticsData />}
            {activeTab === "deal-analyzer" && <DealAnalyzerRecords />}
            {activeTab === "rental-ingestion" && <RentalIngestionManagement />}

            {drawerRecord && <DistrictDetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />}
        </div>
    );
}

export default function AIDataPage() {
    return (
        <Suspense fallback={null}>
            <AIDataPageContent />
        </Suspense>
    );
}
