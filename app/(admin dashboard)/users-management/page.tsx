"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import appService from "@/app/services/appService";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import { SortIcon } from "@/app/(user dashboard)/constants";
import {
    UM_STATS,
    UM_ACTIVITY,
    SearchIcon,
    EyeIcon,
    BanIcon,
    TrashIcon,
    USER_DETAILS,
} from "@/app/(admin dashboard)/constants";
import Button from "@/app/components/ui/button";
import ModalButton from "@/app/components/ui/modal-button";
import { SuspendUserModal, DeleteUserModal } from "@/app/components/dashboard/admin-modals";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

export default function UsersManagementPage() {
    const [activePage, setActivePage] = useState(1);
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [apiStats, setApiStats] = useState<any>(null);
    const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
    const [activitySnapshot, setActivitySnapshot] = useState<any>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey((k) => k + 1);

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [periodFilter, setPeriodFilter] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setActivePage(1);
            setActiveSearch(searchInput);
        }, 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    const triggerSearch = () => {
        setActivePage(1);
        setActiveSearch(searchInput);
    };

    useEffect(() => {
        appService.getAdminUsers(activePage, 10, activeSearch || undefined, planFilter || undefined, statusFilter || undefined, periodFilter || undefined).then((res) => {
            if (res?.data?.data) {
                const d = res.data.data;
                setAdminUsers(Array.isArray(d.items) ? d.items : []);
                setTotalPages(Math.ceil((d.total ?? 1) / (d.limit ?? 10)));
                setApiStats(d.stats ?? null);
                setRecentRegistrations(Array.isArray(d.recentRegistrations) ? d.recentRegistrations : []);
                setActivitySnapshot(d.activitySnapshot ?? null);
            }
        });
    }, [activePage, refreshKey, activeSearch, planFilter, statusFilter, periodFilter]);

    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
    const drawerOpen = selectedUser !== null;
    const closeDrawer = () => { setSelectedUser(null); setSelectedUserDetail(null); };

    const [suspendIdx, setSuspendIdx] = useState<number | null>(null);
    const closeSuspend = () => setSuspendIdx(null);

    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    return (
        <>
            <div className="flex flex-col gap-5">

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                            User Management
                        </h1>
                        <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                            Manage user accounts, subscriptions, and platform access.
                        </p>
                    </div>
                    <Button variant="navy" className="w-auto! py-2.5!">
                        EXPORT USERS
                    </Button>
                </div>

                <Card className="p-4!">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex flex-1 pr-1.5 max-w-99.75 items-center border border-(--db-border) rounded-sm overflow-hidden bg-(--db-main-bg)">
                            <input
                                type="text"
                                placeholder="Search by name, email"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                                className="flex-1 text-[11px] text-(--db-text-primary) placeholder-(--db-text-muted) bg-transparent outline-none px-3 py-2.5"
                            />
                            <button onClick={triggerSearch} className="flex items-center justify-center w-6.75 h-6.75 bg-[#D28A44] hover:bg-[#0B1F3A] rounded-[3px] text-white shrink-0">
                                <SearchIcon />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="relative">
                                <select
                                    value={planFilter}
                                    onChange={(e) => { setPlanFilter(e.target.value); setActivePage(1); }}
                                    className="text-xs border border-(--db-border) rounded-sm px-1.5 py-2 font-medium bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="">Subscription Plan</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Essential">Essential</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setActivePage(1); }}
                                    className="text-xs border border-(--db-border) rounded-sm px-1.5 py-2 font-medium bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                                >
                                    <option value="">Account Status</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {UM_STATS.map((s, i) => {
                        const apiValues = [
                            String(apiStats?.totalUsers ?? s.value),
                            String(apiStats?.activeUsers ?? s.value),
                            String(apiStats?.paidSubscribers ?? s.value),
                            String(apiStats?.suspendedAccounts ?? s.value),
                        ];
                        return (
                            <div key={s.label} className="bg-(--db-sidebar-bg) rounded-md p-5 flex flex-col gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="shrink-0 bg-[#D28A441F] p-2 rounded-sm">{s.icon}</div>
                                    <p className="text-sm font-medium text-(--db-text-primary)">{s.label}</p>
                                </div>
                                <AnimatedNumber
                                    value={apiValues[i]}
                                    className="text-[38px] font-semibold text-(--db-text-primary) leading-none"
                                />
                            </div>
                        );
                    })}
                </div>

                <Card className="rounded-none!">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">
                                User Directory
                            </h2>
                            <p className="text-[13px] text-(--db-text-primary)">
                                View and manage all registered platform users.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <select
                                value={periodFilter}
                                onChange={(e) => { setPeriodFilter(e.target.value); setActivePage(1); }}
                                className="text-xs border border-(--db-border) rounded-sm px-2.5 py-1.5 bg-(--db-main-bg) text-(--db-text-primary) outline-none"
                            >
                                <option value="">All Time</option>
                                <option value="last_year">Last Year</option>
                                <option value="last_6months">6 Months</option>
                                <option value="last_month">Last Month</option>
                            </select>
                            <button className="flex items-center justify-center w-8 h-8 border border-(--db-border) rounded-md bg-(--db-main-bg) text-(--db-text-primary) shrink-0">
                                <SortIcon />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                    <th className="min-w-40 px-5 py-3 font-semibold whitespace-nowrap">User</th>
                                    <th className="min-w-32 px-5 py-3 font-semibold whitespace-nowrap">Role</th>
                                    <th className="min-w-32 px-5 py-3 font-semibold whitespace-nowrap">Plan</th>
                                    <th className="min-w-36 px-5 py-3 font-semibold whitespace-nowrap">Last Active</th>
                                    <th className="min-w-28 px-5 py-3 font-semibold whitespace-nowrap">Status</th>
                                    <th className="min-w-28 px-5 py-3 font-semibold whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminUsers.map((user, i) => (
                                    <tr
                                        key={user.id ?? i}
                                        className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium whitespace-nowrap text-(--db-text-primary)">{user.fullName}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary) uppercase">{user.role}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{user.planName}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{user.lastActive}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${user.isActive ? "bg-[#5E9F622E] text-[#5E9F62]" : "bg-[#CF2D482E] text-[#CF2D48]"}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {user.isActive ? "Active" : "Suspended"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => {
                                                    setSelectedUser(i);
                                                    const userId = user.id;
                                                    if (userId) appService.getAdminUserById(userId).then((res) => { if (res?.data?.data) setSelectedUserDetail(res.data.data); });
                                                }} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear" title="View">
                                                    <EyeIcon />
                                                </button>
                                                <button onClick={() => setSuspendIdx(i)} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear" title="Suspend">
                                                    <BanIcon />
                                                </button>
                                                <button onClick={() => setDeleteUserId(user.id ?? null)} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear" title="Delete">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        {Array.from(
                            {
                                length: Math.min(
                                    5,
                                    totalPages -
                                    Math.max(
                                        1,
                                        Math.min(activePage - 2, totalPages - 4)
                                    ) +
                                    1
                                ),
                            },
                            (_, i) =>
                                Math.max(
                                    1,
                                    Math.min(activePage - 2, totalPages - 4)
                                ) + i
                        ).map((p) => (
                            <button
                                key={p}
                                onClick={() => setActivePage(p)}
                                className={`w-6 h-6 rounded-sm text-[15px] font-medium transition-colors ${activePage === p
                                        ? "bg-[#D28A44] text-white"
                                        : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[auto_35%] gap-4">

                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">
                            Recent User Registrations
                        </h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Newest users who joined the platform.
                        </p>
                        <div className="overflow-x-auto border border-(--db-border) rounded-md">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                        <th className="px-5 py-3 font-semibold whitespace-nowrap">User</th>
                                        <th className="px-5 py-3 font-semibold whitespace-nowrap">Plan</th>
                                        <th className="px-5 py-3 font-semibold whitespace-nowrap">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentRegistrations.map((row, i) => (
                                        <tr
                                            key={row.id ?? i}
                                            className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                        >
                                            <td className="px-5 py-3.5 font-medium whitespace-nowrap text-(--db-text-primary)">{row.fullName}</td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{row.planName}</td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{row.joinedDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <Card className="rounded-none!">
                        <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">
                            User Activity Snapshot
                        </h2>
                        <p className="text-[13px] text-(--db-text-primary) mb-5">
                            Monitor platform engagement across registered users.
                        </p>
                        <div className="flex flex-col gap-3">
                            {UM_ACTIVITY.map((item, i) => {
                                const activityValues = [
                                    String(activitySnapshot?.dailyActiveUsers ?? item.value),
                                    item.value,
                                ];
                                return (
                                    <div key={item.label} className="flex items-center justify-between gap-4 bg-(--db-main-bg) p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0 bg-[#D28A441F] p-2 rounded-sm">{item.icon}</div>
                                            <span className="text-sm font-medium text-(--db-text-primary)">{item.label}</span>
                                        </div>
                                        <AnimatedNumber
                                            value={activityValues[i]}
                                            className="text-[26px] font-semibold text-(--db-text-primary) shrink-0"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                </div>
            </div>

            <div
                onClick={closeDrawer}
                className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <div className={`fixed top-0 right-0 h-full w-full max-w-121.25 bg-(--db-sidebar-bg) z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
                {selectedUser !== null && (() => {
                    const listUser = adminUsers[selectedUser] ?? {};
                    const user = selectedUserDetail ? { ...listUser, ...selectedUserDetail } : listUser;
                    const det = USER_DETAILS[selectedUser] ?? USER_DETAILS[0];
                    return (
                        <div className="px-6 py-8 ">
                            {/* Header */}
                            <div className="flex items-start justify-between shrink-0">
                                <div>
                                    <h2 className="text-[25px] font-medium text-(--db-text-primary)">User Detail</h2>
                                    <p className="text-[13px] text-(--db-text-primary) mt-1 max-w-74.25">
                                        View account information, subscription status, and platform activity.
                                    </p>
                                </div>
                                <button onClick={closeDrawer} className="absolute top-4 right-4">
                                    <img src="/close.svg" alt="" />
                                </button>
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] pt-6 space-y-4">

                                {/* User avatar + name */}
                                <div className="flex  gap-4 bg-(--db-drawer-header-bg) p-4">
                                    <div className="w-21.5 h-21.5 rounded-full flex items-center justify-center shrink-0">
                                        <img src="/favicon.ico" alt="" />
                                    </div>
                                    <div className="min-w-0 my-auto">
                                        <p className="font-medium text-(--db-text-primary) text-lg leading-tight">{user.fullName}</p>
                                        <p className="text-sm text-(--db-text-primary) mt-0.5">{user.email}</p>
                                    </div>
                                    <span className={`ml-auto mt-0 mb-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${user.isActive ? "bg-[#5E9F622E] text-[#5E9F62]" : "bg-[#CF2D482E] text-[#CF2D48]"}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {user.isActive ? "Active" : "Suspended"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-(--db-drawer-section-bg) p-5 space-y-3.75">
                                        {[
                                            { label: "Member Since", value: user.memberSince ?? det.memberSince },
                                            { label: "Current Plan", value: user.planName ?? "N/A" },
                                            { label: "Renewal Date", value: user.subscription?.renewalDate ?? det.renewalDate ?? "N/A" },
                                        ].map((f) => (
                                            <div key={f.label}>
                                                <p className="text-[15px] text-(--db-text-primary) font-light mb-0.5">{f.label}</p>
                                                <p className="text-[13px] font-medium text-(--db-text-primary)">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-(--db-drawer-section-bg) p-5 space-y-3.75">
                                        {[
                                            { label: "User ID", value: user.id ?? det.userId },
                                            { label: "Phone Number", value: user.phoneNumber ?? det.phone },
                                            { label: "Registration Date", value: user.registrationDate ?? det.registrationDate },
                                        ].map((f) => (
                                            <div key={f.label}>
                                                <p className="text-[15px] text-(--db-text-primary) font-light mb-0.5">{f.label}</p>
                                                <p className="text-[13px] font-medium text-(--db-text-primary)">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-(--db-drawer-section-bg) p-5">
                                    <h3 className="text-lg font-medium text-(--db-text-primary) mb-3">Subscription Details</h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        {[
                                            { label: "Current Plan", value: user.planName ?? user.subscription?.planName ?? "N/A" },
                                            { label: "Subscription Status", value: user.isActive ? "Active" : "Suspended" },
                                            { label: "Billing Cycle", value: user.subscription?.billingCycle ?? det.billingCycle ?? "N/A" },
                                            { label: "Total Payments", value: user.subscription?.totalPayments ?? det.totalPayments ?? "N/A" },
                                        ].map((f) => (
                                            <div key={f.label}>
                                                <p className="text-[15px] text-(--db-text-primary) font-light">{f.label}</p>
                                                <p className="text-[13px] font-medium text-(--db-text-primary)">{f.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Platform Activity */}
                                <div className="bg-(--db-drawer-section-bg) p-5">
                                    <h3 className="text-lg font-medium text-(--db-text-primary) mb-3">Platform Activity</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "AI Queries", value: String(user.activity?.aiQueries ?? det.aiQueries ?? 0) },
                                            { label: "Reports Generated", value: String(user.activity?.reportsGenerated ?? det.reportsGenerated ?? 0) },
                                            { label: "Smart Alerts", value: String(user.activity?.smartAlerts ?? det.smartAlerts ?? 0) },
                                            { label: "Deal Analyses", value: String(user.activity?.dealAnalyses ?? det.dealAnalyses ?? 0) },
                                        ].map((m) => (
                                            <div key={m.label} className="bg-(--db-main-bg) rounded-md p-5">
                                                <p className="text-sm text-(--db-text-primary) font-medium mb-1">{m.label}</p>
                                                <AnimatedNumber value={String(m.value)} className="text-[20px] font-semibold text-(--db-text-primary)" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="shrink-0 flex items-center gap-4 py-5">
                                <Button
                                    variant="primary"
                                    onClick={closeDrawer}
                                    className="py-3.5! text-base! max-w-full! w-full!"
                                >
                                    CLOSE
                                </Button>
                                <ModalButton className="py-3.5! text-base! max-w-full! w-full!">
                                    SUSPEND USER
                                </ModalButton>
                            </div>
                        </div>
                    );
                })()}
            </div>

            <SuspendUserModal
                isOpen={suspendIdx !== null}
                onClose={closeSuspend}
                onConfirm={() => {
                    const id = suspendIdx !== null ? adminUsers[suspendIdx]?.id : null;
                    if (id) appService.suspendAdminUser(id).then(() => { refresh(); closeSuspend(); });
                }}
                userName={suspendIdx !== null ? (adminUsers[suspendIdx]?.fullName ?? "") : ""}
                userEmail={suspendIdx !== null ? (adminUsers[suspendIdx]?.email ?? "") : ""}
                userStatus={suspendIdx !== null ? (adminUsers[suspendIdx]?.isActive ? "active" : "suspended") : "active"}
            />
            <DeleteUserModal
                isOpen={deleteUserId !== null}
                onClose={() => setDeleteUserId(null)}
                onConfirm={() => {
                    if (deleteUserId) appService.deleteAdminUser(deleteUserId).then(() => { refresh(); setDeleteUserId(null); });
                }}
            />
        </>
    );
}
