"use client";

import type { ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import { useVisibleRowsHeight } from "@/app/hooks/useVisibleRowsHeight";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { AlertROITrendChart, type TrendPoint } from "@/app/components/dashboard/smart-alerts-charts";
import { CreateAlertModal, EditAlertModal, DeleteAlertModal } from "@/app/components/dashboard/alert-modals";
import {
    ALERT_STATS, ALERT_NOTIFICATION_METHODS,
    type AlertStat,
    AlertEditIcon, AlertDeleteIcon, AlertBellIcon,
    SelectChevron,
    type AlertFeedItem,
} from "@/app/(user dashboard)/constants";
import {
    SIGNAL_BADGE_CLS, TRIGGER_TYPE_LABELS, FEED_VISIBLE_ITEMS, ALERT_PREF_FIELDS, FREQUENCY_FIELDS, FREQUENCY_OPTIONS,
    INITIAL_ALERT_STATS,
    type AlertStatsResponse,
} from "@/app/constant";

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
            <span className={`shrink-0 w-5.75 h-5.75 rounded-[3px] border flex items-center justify-center transition-colors ease-linear ${checked ? "bg-[#D28A44] border-[#D28A44]" : "bg-(--db-sidebar-bg) border-[#D28A4466]"}`}>
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span className="text-sm font-normal text-(--db-text-primary)">{label}</span>
        </label>
    );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

function SectionHeading({ children }: { children: ReactNode }) {
    return <p className="text-[17px] font-semibold text-[#D28A44] mb-3.75">{children}</p>;
}

const freqSelectCls = "w-full text-sm border border-(--db-border) rounded-md px-3 py-2.5 bg-(--db-sidebar-bg) text-(--db-text-primary) outline-none appearance-none focus:border-[#D28A44]/60 transition cursor-pointer";

function timeAgo(value?: string) {
    if (!value) return "";
    const diff = Date.now() - new Date(value).getTime();
    if (Number.isNaN(diff)) return value;
    const mins = Math.max(0, Math.floor(diff / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

function fmtPct(v: unknown) {
    if (v == null || v === "") return "-";
    return typeof v === "number" ? `${Number(v.toFixed(2))}%` : String(v);
}

function capitalize(v: unknown) {
    if (v == null || v === "") return "-";
    const str = String(v);
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toAlertFeedItem(a: any): AlertFeedItem {
    const metrics = a?.metrics ?? {};
    const signal = String(metrics?.marketSignal ?? "").toLowerCase();
    return {
        id: a?.id,
        alertId: a?.alertId,
        isMuted: !!a?.isMuted,
        triggerType: a?.triggerType,
        type: a?.title ?? "Alert",
        district: a?.district ?? "",
        description: a?.message ?? "",
        detail: a?.message ?? "",
        timeAgo: timeAgo(a?.createdAt),
        badge: a?.tag ?? "",
        badgeCls: SIGNAL_BADGE_CLS[signal] ?? "bg-[#D28A44] text-[#D28A44]",
        roi: fmtPct(metrics?.roi),
        rentalYield: fmtPct(metrics?.rentalYield),
        appreciation: capitalize(metrics?.appreciationPotential),
        aiScore: metrics?.aiScore != null ? `${metrics.aiScore}/100` : "-",
    };
}

function toAlertConfigItem(a: any): AlertFeedItem {
    const metrics = a?.districtMetrics ?? {};
    const signal = String(metrics?.marketSignal ?? "").toLowerCase();
    const trigger = TRIGGER_TYPE_LABELS[a?.triggerType] ?? a?.triggerType ?? "Alert";
    const threshold = a?.filterJson?.thresholdPercent;
    const description = threshold != null ? `${trigger} of ${threshold}% or more` : trigger;
    return {
        alertId: a?.id,
        triggerType: a?.triggerType,
        direction: a?.filterJson?.direction ?? a?.direction,
        deliveryChannels: Array.isArray(a?.deliveryChannels) ? a.deliveryChannels : undefined,
        frequency: a?.frequency ?? null,
        thresholdPercent: threshold ?? undefined,
        type: a?.name ?? "Smart Alert",
        district: a?.filterJson?.district ?? "",
        description,
        detail: `Monitoring ${a?.filterJson?.district ?? "this district"} for ${description.toLowerCase()}.`,
        timeAgo: timeAgo(a?.lastTriggeredAt ?? a?.createdAt),
        isMuted: !!a?.isMuted,
        badge: a?.isActive === false ? "Inactive" : "Active",
        badgeCls: SIGNAL_BADGE_CLS[signal] ?? "bg-[#D28A44] text-[#D28A44]",
        roi: fmtPct(metrics?.roi),
        rentalYield: fmtPct(metrics?.rentalYield),
        appreciation: capitalize(metrics?.appreciationPotential),
        aiScore: metrics?.aiScore != null ? `${metrics.aiScore}/100` : "-",
    };
}

function getItems(res: any): any[] {
    if (res?.status !== 200 && res?.status !== 201) return [];
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
}

const muteBtnCls = (isMuted?: boolean) => isMuted
    ? "bg-[#D28A44] text-white"
    : "bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn)";

function statTiles(a: AlertFeedItem) {
    return [
        { label: "ROI", value: a.roi },
        { label: "Rental Yield", value: a.rentalYield },
        { label: "Appreciation", value: a.appreciation },
        { label: "AI Score", value: a.aiScore },
    ];
}

const isFrequency = (v: unknown): v is string => FREQUENCY_OPTIONS.some((o) => o.value === v);

function buildAlertStats(stats: AlertStatsResponse | null): AlertStat[] {
    if (!stats) return ALERT_STATS.map((s) => ({ ...s, ...(INITIAL_ALERT_STATS[s.label] ?? { value: "-", sub: "" }) }));
    const active = stats.activeAlerts ?? 0;
    const pushOn = !!stats.push?.enabled;
    const smsOn = !!stats.sms?.enabled;
    const pushSmsCount = (stats.push?.categoriesEnabled ?? 0) + (stats.sms?.categoriesEnabled ?? 0);
    const values: Record<string, { value: string; sub: string }> = {
        "Active Alerts": { value: `${active} Active`, sub: `Monitoring ${active} condition${active === 1 ? "" : "s"}` },
        "Email Notifications": {
            value: stats.email?.enabled ? "Enabled" : "Disabled",
            sub: `${stats.email?.categoriesEnabled ?? 0}/${stats.email?.categoriesTotal ?? 0} categories enabled`,
        },
        "SMS / Push Alerts": {
            value: `${pushSmsCount} Enabled`,
            sub: pushOn && smsOn ? "Push & SMS active" : pushOn ? "Push active" : smsOn ? "SMS active" : "Push & SMS off",
        },
        "AI Monitoring Status": {
            value: stats.monitoringActive ? "Live Tracking" : "Paused",
            sub: stats.monitoringActive ? "Real-time market scan" : "No active monitoring",
        },
    };
    return ALERT_STATS.map((s) => ({ ...s, ...(values[s.label] ?? { value: "-", sub: "" }) }));
}

export default function SmartAlertsPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [frequencies, setFrequencies] = useState<Record<string, string>>(
        () => Object.fromEntries(FREQUENCY_FIELDS.map((f) => [f.field, "immediate"]))
    );
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [stats, setStats] = useState<AlertStatsResponse | null>(null);

    const loadStats = useCallback(() => {
        appService.getAlertStats().then((res) => {
            if (res?.status !== 200 && res?.status !== 201) return;
            setStats(res.data?.data ?? res.data ?? null);
        });
    }, []);

    useEffect(() => {
        appService.getNotificationPreferences().then((res) => {
            const d = res?.data?.data ?? res?.data;
            if (!d) return;
            setChecked(new Set(Object.keys(ALERT_PREF_FIELDS).filter((label) => !!d[ALERT_PREF_FIELDS[label]])));
            setFrequencies((prev) => Object.fromEntries(
                FREQUENCY_FIELDS.map(({ field }) => [field, isFrequency(d[field]) ? d[field] : prev[field]])
            ));
        });
    }, []);

    const savePreferences = async () => {
        if (savingPrefs) return;
        const payload = {
            ...Object.fromEntries(Object.entries(ALERT_PREF_FIELDS).map(([label, field]) => [field, checked.has(label)])),
            ...frequencies,
        };
        setSavingPrefs(true);
        const res = await appService.updateNotificationPreferences(payload);
        setSavingPrefs(false);
        if (res?.status === 200 || res?.status === 201) {
            toast.success("Notification preferences saved.");
            loadStats();
        } else {
            toast.error(res?.data?.message || "Failed to save notification preferences.");
        }
    };

    const closeCreate = useCallback(() => setCreateOpen(false), []);
    const closeEdit = useCallback(() => setEditOpen(false), []);
    const closeDelete = useCallback(() => setDeleteOpen(false), []);

    const [alerts, setAlerts] = useState<AlertFeedItem[]>([]);
    const [alertsLoading, setAlertsLoading] = useState(true);

    const loadAlertDetail = useCallback((item?: AlertFeedItem) => {
        if (!item || item.id || !item.alertId) return;
        const alertId = item.alertId;
        appService.getAlertById(alertId).then((res) => {
            if (res?.status !== 200 && res?.status !== 201) return;
            const payload = res.data?.data ?? res.data;
            if (!payload) return;
            const detail = toAlertConfigItem(payload);
            setAlerts((prev) => prev.map((a) => (!a.id && a.alertId === alertId ? detail : a)));
        });
    }, []);

    const loadAlerts = useCallback(() => {
        Promise.all([appService.getAlertsFeed(1, 20), appService.getAlerts(1, 20)]).then(([feedRes, alertsRes]) => {
            const items = [
                ...getItems(feedRes).map(toAlertFeedItem),
                ...getItems(alertsRes).map(toAlertConfigItem),
            ];
            setAlerts(items);
            setActiveIdx(0);
            setAlertsLoading(false);
            loadAlertDetail(items[0]);
        });
        loadStats();
    }, [loadStats, loadAlertDetail]);

    useEffect(() => {
        loadAlerts();
    }, [loadAlerts]);

    const selectAlert = (idx: number) => {
        setActiveIdx(idx);
        const id = alerts[idx]?.id;
        if (!id) { loadAlertDetail(alerts[idx]); return; }
        appService.getAlertFeedById(id).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const payload = res.data?.data ?? res.data;
                if (!payload) return;
                const detail = toAlertFeedItem(payload);
                setAlerts((prev) => prev.map((a) => (a.id === id ? detail : a)));
            }
        });
    };

    const toggleMute = async (item: AlertFeedItem | undefined) => {
        if (!item) return;
        if (!item.alertId) { toast.error("Alert not found."); return; }
        const alertId = item.alertId;
        const nextMuted = !item.isMuted;
        const res = await appService.updateAlert(alertId, { isMuted: nextMuted });
        if (res?.status === 200 || res?.status === 201) {
            const payload = res.data?.data ?? res.data;
            const isMuted = typeof payload?.isMuted === "boolean" ? payload.isMuted : nextMuted;
            setAlerts((prev) => prev.map((a) => (a.alertId === alertId ? { ...a, isMuted } : a)));
            if (isMuted !== nextMuted) {
                toast.error(`Mute wasn't saved: server still returns isMuted: ${isMuted}.`);
                return;
            }
            toast.success(isMuted ? "Alert muted." : "Alert unmuted.");
        } else {
            toast.error(res?.data?.message || "Failed to update alert.");
        }
    };

    const handleAlertDeleted = (alertId: string) => {
        loadStats();
        setAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
        setActiveIdx(0);
    };

    const activeAlert: AlertFeedItem | undefined = alerts[activeIdx] ?? alerts[0];
    const { ref: feedListRef, maxHeight: feedMaxHeight } = useVisibleRowsHeight(FEED_VISIBLE_ITEMS, [alerts]);

    const [districtIds, setDistrictIds] = useState<Record<string, string> | null>(null);
    useEffect(() => {
        appService.getAllDistricts().then((res) => {
            const items = res?.data?.data ?? res?.data ?? [];
            const map: Record<string, string> = {};
            if (Array.isArray(items)) {
                items.forEach((d: { id?: string; name?: string; district?: string }) => {
                    const name = d?.name ?? d?.district;
                    if (d?.id && name) map[name.toLowerCase()] = d.id;
                });
            }
            setDistrictIds(map);
        });
    }, []);

    const trendDistrictId = activeAlert?.district ? districtIds?.[activeAlert.district.toLowerCase()] : undefined;
    const [trend, setTrend] = useState<{ districtId: string; points: TrendPoint[] } | null>(null);
    useEffect(() => {
        if (!trendDistrictId) return;
        let cancelled = false;
        appService.getDistrictTrend(trendDistrictId, "roi", 30).then((res) => {
            if (cancelled) return;
            const list = res?.data?.data ?? res?.data;
            const points: TrendPoint[] = Array.isArray(list)
                ? list.filter((p) => p?.date && Number.isFinite(Number(p.value))).map((p) => ({ date: p.date, value: Number(p.value) }))
                : [];
            setTrend({ districtId: trendDistrictId, points });
        });
        return () => { cancelled = true; };
    }, [trendDistrictId]);
    const trendLoading = districtIds === null || (!!trendDistrictId && trend?.districtId !== trendDistrictId);
    const trendPoints = trendDistrictId && trend?.districtId === trendDistrictId ? trend.points : [];

    const toggleCheck = (item: string) =>
        setChecked((prev) => {
            const next = new Set(prev);
            next.has(item) ? next.delete(item) : next.add(item);
            return next;
        });

    return (
        <div className="flex flex-col min-h-full">
            {createOpen && <CreateAlertModal onClose={closeCreate} onCreated={loadAlerts} />}
            {editOpen && activeAlert && <EditAlertModal alert={activeAlert} onClose={closeEdit} onSaved={loadAlerts} />}
            {deleteOpen && activeAlert && <DeleteAlertModal alert={activeAlert} onClose={closeDelete} onDeleted={handleAlertDeleted} />}

            <div className="flex-1 space-y-6">

                <div className="flex items-end flex-wrap justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-2 leading-[100%] font-medium text-(--db-text-primary)">Smart Alerts Center</h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal max-w-130">
                            AI-powered monitoring for investment opportunities, market movements, and district performance alerts.
                        </p>
                    </div>
                    <ModalButton className="py-2.75! max-w-fit px-5 text-sm!" onClick={() => setCreateOpen(true)}>
                         CREATE ALERT
                    </ModalButton>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {buildAlertStats(stats).map((s) => (
                        <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-[13px_14px_21px] flex flex-col">
                            <div className="flex items-center justify-start gap-2 mb-2.5">
                                <div className="shrink-0 w-10 h-10 flex justify-center items-center bg-[#D28A441F] rounded-sm">{s.icon}</div>
                                <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                            </div>
                            <AnimatedNumber
                                value={s.value}
                                className="text-2xl mb-1 md:text-[32px] font-semibold text-(--db-text-primary) leading-[100%]"
                            />
                            <p className="text-[13px] font-normal text-(--db-text-muted)">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Manage Alert Preferences ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Manage Alert Preferences</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Configure which alerts you receive and how you'd like to be notified.
                    </p>

                    <div className="bg-(--db-main-bg) px-4 py-5 mb-5">
                        <SectionHeading>Notification Methods</SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {ALERT_NOTIFICATION_METHODS.map((method) => (
                                <div key={method.label} className="w-full">
                                    <div className="flex items-center gap-2.5 mb-4.5">
                                        <div className="bg-[#D28A441F] w-8.5 h-8.5 rounded-[3px] flex justify-center items-center text-[#D28A44] shrink-0">
                                            {method.icon}
                                        </div>
                                        <span className="text-base font-semibold text-(--db-text-primary)">{method.label}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {method.items.map((item) => (
                                            <Checkbox
                                                key={item}
                                                label={item}
                                                checked={checked.has(item)}
                                                onChange={() => toggleCheck(item)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--db-main-bg) px-4 py-5 mb-5">
                        <SectionHeading>Notification Frequency</SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {FREQUENCY_FIELDS.map(({ label, field }) => (
                                <div key={field}>
                                    <label className="block text-[15px] font-medium text-(--db-text-primary) mb-2">{label}</label>
                                    <div className="relative">
                                        <select
                                            className={freqSelectCls}
                                            value={frequencies[field]}
                                            onChange={(e) => setFrequencies((prev) => ({ ...prev, [field]: e.target.value }))}
                                        >
                                            {FREQUENCY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <SelectChevron />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex">
                        <ModalButton className="py-4! max-w-fit px-5" onClick={savePreferences} disabled={savingPrefs}>SAVE NOTIFICATION PREFERENCES</ModalButton>
                    </div>
                </Card>

                {/* ── Active Smart Alerts ── */}
                <Card className="rounded-none!">
                    <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">Active Smart Alerts</h2>
                    <p className="text-[13px] text-(--db-text-primary) mb-5">
                        Real-time AI-detected market opportunities and signals across monitored districts.
                    </p>

                    {!activeAlert ? (
                        <div className="bg-(--db-main-bg) rounded-sm px-5 py-14 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 mb-3 rounded-sm bg-[#D28A441F] text-[#D28A44] flex items-center justify-center">
                                <AlertBellIcon />
                            </div>
                            <p className="text-[17px] font-semibold text-[#D28A44] mb-1">
                                {alertsLoading ? "Loading alerts..." : "No data yet"}
                            </p>
                            {!alertsLoading && (
                                <p className="text-[13px] text-(--db-text-primary) font-normal max-w-90">
                                    Create a smart alert and AI-detected signals for your monitored districts will appear here.
                                </p>
                            )}
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[331px_1fr] gap-5">

                        {/* Left — Live Feed */}
                        <div className="bg-(--db-main-bg) rounded-sm p-5 overflow-hidden">
                            <h3 className="text-[17px] font-semibold text-[#D28A44] mb-2.5">Live Alert Feed</h3>
                            <div
                                ref={feedListRef}
                                style={{ maxHeight: feedMaxHeight }}
                                className="relative space-y-3.5 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#D28A4466_transparent]"
                            >
                                {alerts.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectAlert(idx)}
                                        className={`w-full text-left pl-4.75 pr-2 py-2.5 transition-colors ease-linear ${activeIdx === idx ? "bg-[#D28A444F]" : "bg-(--db-sidebar-bg) hover:bg-[#D28A444F]"}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-sm font-normal text-(--db-text-primary)">{item.type}</span>
                                            <span className="text-[9px] text-(--db-text-primary) shrink-0 mt-0.5">{item.timeAgo}</span>
                                        </div>
                                        <span className="block mt-0.5 text-base leading-5 text-[#D28A44] font-medium">{item.district}</span>
                                        <div className="mt-0.5 flex items-center justify-between gap-1.5">
                                            <p className="text-[13px] text-(--db-text-primary) font-normal">{item.description}</p>
                                            <span
                                                role="button"
                                                tabIndex={0}
                                                title={item.isMuted ? "Unmute alert" : "Mute alert"}
                                                aria-pressed={!!item.isMuted}
                                                onClick={(e) => { e.stopPropagation(); toggleMute(item); }}
                                                onKeyDown={(e) => {
                                                    if (e.key !== "Enter" && e.key !== " ") return;
                                                    e.preventDefault(); e.stopPropagation(); toggleMute(item);
                                                }}
                                                className={`shrink-0 cursor-pointer w-6.5 h-6.5 rounded-xs flex justify-center items-center ${muteBtnCls(item.isMuted)}`}
                                            >
                                                <AlertBellIcon />
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right — Detail Panel */}
                        <div className="bg-(--db-main-bg) rounded-sm p-5">
                            <div className="flex items-start justify-between gap-4 mb-3.5">
                                <h3 className="text-[17px] font-semibold text-[#D28A44]">{activeAlert.type}</h3>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditOpen(true)}
                                        title="Edit alert"
                                        className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center"
                                    >
                                        <AlertEditIcon />
                                    </button>
                                    <button
                                        onClick={() => setDeleteOpen(true)}
                                        title="Delete alert"
                                        className="bg-(--db-icon-btn-bg) text-(--db-modal-btn) hover:text-(--db-modal-btn-hover-text) hover:bg-(--db-modal-btn) w-6.5 h-6.5 rounded-xs flex justify-center items-center"
                                    >
                                        <AlertDeleteIcon />
                                    </button>
                                    <button
                                        onClick={() => toggleMute(activeAlert)}
                                        title={activeAlert.isMuted ? "Unmute alert" : "Mute alert"}
                                        aria-pressed={!!activeAlert.isMuted}
                                        className={`w-6.5 h-6.5 rounded-xs flex justify-center items-center ${muteBtnCls(activeAlert.isMuted)}`}
                                    >
                                        <AlertBellIcon />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-[17px] text-(--db-text-primary) font-medium mb-0.5">
                                    {activeAlert.district}
                                </p>
                                <p className="text-[13px] text-(--db-text-primary) font-normal mb-2.25">
                                    {activeAlert.detail}
                                </p>
                                <span className={`text-[10px] text-(--db-text-primary) font-normal flex gap-1 items-center`}>
                                    <span className={`w-2 h-2 rounded-full block ${activeAlert.badgeCls}`}></span>
                                    {activeAlert.badge}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                {statTiles(activeAlert).map((t) => (
                                    <div key={t.label} className="bg-(--db-icon-btn-bg) rounded-xs px-2 leading-3.75 py-1.5 text-[11px] font-medium text-(--db-text-primary)">
                                        <p className="">{t.label}: <b>{t.value}</b></p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-(--db-sidebar-bg) p-4">
                                <p className="text-sm font-medium text-(--db-text-primary) mb-3">ROI Trend — Last 30 Days</p>
                                <AlertROITrendChart data={trendPoints} loading={trendLoading} />
                            </div>
                        </div>

                    </div>
                    )}
                </Card>

            </div>
        </div>
    );
}
