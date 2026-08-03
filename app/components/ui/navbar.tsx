"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import { NotificationIcon, ReportTrashIcon } from "@/app/(user dashboard)/constants";
import appService from "@/app/services/appService";

function formatLabel(segment: string) {
    return segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

type NotificationRow = { id: string; text: string; time: string; isRead: boolean };

function toNotificationRow(n: any): NotificationRow {
    return {
        id: String(n.id ?? n._id ?? ""),
        text: n.message ?? n.text ?? n.title ?? "",
        time: n.createdAt
            ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
            : (n.time ?? ""),
        isRead: n.isRead ?? n.read ?? false,
    };
}

export default function Navbar() {
    const pathname = usePathname();
    const { toggleDrawer, isDrawerOpen, user } = useTheme();
    const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
    const pageLabel = formatLabel(segment);

    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<NotificationRow[]>([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        appService.getUnreadNotificationCount().then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const payload = res.data?.data ?? res.data;
                setUnreadCount(payload?.count ?? 0);
            }
        });
    }, []);

    useEffect(() => {
        if (!notifOpen) return;
        setNotifLoading(true);
        appService.getNotifications(1, 20).then((res) => {
            if (res?.status === 200 || res?.status === 201) {
                const payload = res.data?.data ?? res.data;
                const items = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload?.items)
                    ? payload.items
                    : [];
                setNotifications(items.map(toNotificationRow));
                if (payload?.unreadCount != null) setUnreadCount(payload.unreadCount);
            }
            setNotifLoading(false);
        });
    }, [notifOpen]);

    function handleMarkRead(id: string) {
        const target = notifications.find((n) => n.id === id);
        if (!target || target.isRead) return;
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        appService.markNotificationRead(id);
    }

    function handleMarkAllRead() {
        if (unreadCount === 0) return;
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        appService.markAllNotificationsRead();
    }

    function handleDelete(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        const wasUnread = notifications.find((n) => n.id === id)?.isRead === false;
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
        appService.deleteNotification(id);
    }

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="bg-(--db-main-bg) flex items-center justify-between px-5 py-4.5 shrink-0">

            <div className="hidden md:flex items-center gap-2 text-base text-(--db-text-primary) font-normal">
                {segment === "dashboard" && (
                    <>
                        <span>Overview</span>
                        <span>/</span>
                    </>
                )}
                <span>{pageLabel}</span>
            </div>
            <img src="/favicon.ico" alt="" className="max-w-8 md:hidden" />

            <div className="flex gap-4 items-center ml-auto">

                <div
                    className={`fixed inset-0 bg-black z-70 transition-opacity duration-200 ${notifOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setNotifOpen(false)}
                />

                <div ref={notifRef} className={`relative ${notifOpen ? "z-80" : "z-10"}`}>
                    <button
                        onClick={() => setNotifOpen((v) => !v)}
                        className={`relative w-7.5 h-7.5 rounded-sm ${notifOpen? ' bg-[#D28A44] text-[#F6ECDF]' : 'text-[#D28A44] bg-(--db-sidebar-bg)'} flex justify-center items-center `}
                    >
                        <NotificationIcon />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-[#CF2D48] text-white text-[10px] font-semibold flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <div
                        className={`md:absolute md:right-0 md:top-full md:left-[unset] md:mt-2 md:w-78.5 fixed top-17.5 left-4 right-4 bg-(--db-dropdown-bg) rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out origin-top-right ${notifOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                            style={{ backgroundColor: 'var(--db-dropdown-bg)' }}
                    >
                        <div className="flex items-center justify-between px-5 pt-4.75">
                            <p className="text-sm font-semibold text-(--db-text-primary)">Notifications</p>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[11px] font-medium text-[#D28A44] hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="px-5 py-5.75 max-h-150 overflow-y-auto thin-scroll">
                            {notifLoading ? (
                                <p className="text-sm text-(--db-text-muted) text-center py-4">Loading...</p>
                            ) : notifications.length === 0 ? (
                                <p className="text-sm text-(--db-text-muted) text-center py-4">No notifications</p>
                            ) : (
                                notifications.map((item, i) => (
                                    <div key={item.id}>
                                        <div
                                            className="flex items-start gap-3 cursor-pointer group"
                                            onClick={() => handleMarkRead(item.id)}
                                        >
                                            <span className="text-[#D28A44] shrink-0 mt-0.5">
                                                <NotificationIcon />
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm text-(--db-text-primary) ${item.isRead ? "font-normal" : "font-semibold"}`}>
                                                    {item.text}
                                                </p>
                                                <p className="text-[10px] font-normal text-(--db-text-primary) mt-0.5">{item.time}</p>
                                            </div>
                                            {!item.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-[#D28A44] shrink-0 mt-1.5" />
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-(--db-text-muted) hover:text-rose-500"
                                                title="Delete"
                                            >
                                                <ReportTrashIcon />
                                            </button>
                                        </div>
                                        {i < notifications.length - 1 && (
                                            <div className="border-b border-(--db-chat-text) my-5" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.25 ml-auto">
                    <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatarUrl
                            ? <img src={user.avatarUrl} alt="" className="object-cover w-full h-full" />
                            : <img src="/favicon.ico" alt="" className="object-cover" />
                        }
                    </div>
                    <div className="leading-tight xl:mr-0 mr-2">
                        <p className="text-[15px] font-normal text-(--db-text-primary)">{user?.fullName ?? "User"}</p>
                        <p className="text-xs text-(--db-text-muted) font-normal capitalize">{user?.role ?? "User Role"}</p>
                    </div>

                    <button
                        onClick={toggleDrawer}
                        className={`xl:hidden relative flex min-w-9.75 w-9.75 h-9.75 rounded-sm items-center justify-center bg-[#D28A44] shrink-0 ${isDrawerOpen ? "z-60" : "z-10"}`}
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-9 h-9 flex items-center justify-center">
                            <span className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "rotate-45 translate-y-0" : "-translate-y-2 rotate-0"}`} />
                            <span className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}`} />
                            <span className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "-rotate-45 translate-y-0" : "translate-y-2 rotate-0"}`} />
                        </div>
                    </button>
                </div>
            </div>

        </header>
    );
}
