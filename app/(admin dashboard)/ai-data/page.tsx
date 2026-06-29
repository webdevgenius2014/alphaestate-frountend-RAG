"use client";

import { useState } from "react";
import { AIChatMonitoring } from "@/app/components/dashboard/ai-chat-monitoring";
import { AIIntelligenceEngine } from "@/app/components/dashboard/ai-intelligence-engine";
import { TABS } from "../constants";



type TabId = typeof TABS[number]["id"];

export default function AIDataPage() {
    const [activeTab, setActiveTab] = useState<TabId>("chat-monitoring");

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
            {activeTab === "data-management" && (
                <div className="flex items-center justify-center min-h-64 bg-(--db-sidebar-bg) rounded-md">
                    <p className="text-(--db-text-muted) text-sm">Model Performance — coming soon</p>
                </div>
            )}
            {activeTab === "market-analytics" && (
                <div className="flex items-center justify-center min-h-64 bg-(--db-sidebar-bg) rounded-md">
                    <p className="text-(--db-text-muted) text-sm">Data Management — coming soon</p>
                </div>
            )}
            {activeTab === "deal-analyzer" && (
                <div className="flex items-center justify-center min-h-64 bg-(--db-sidebar-bg) rounded-md">
                    <p className="text-(--db-text-muted) text-sm">Data Management — coming soon</p>
                </div>
            )}
        </div>
    );
}
