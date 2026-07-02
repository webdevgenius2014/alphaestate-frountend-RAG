"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import { NotificationIcon, NOTIFICATIONS } from "@/app/(user dashboard)/constants";

function formatLabel(segment: string) {
    return segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function Navbar() {
    const pathname = usePathname();
    const { toggleDrawer, isDrawerOpen, user } = useTheme();
    const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
    const pageLabel = formatLabel(segment);

    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

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

            <div className="flex gap-4 items-center">

                <div
                    className={`fixed inset-0 bg-black z-70 transition-opacity duration-200 ${notifOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setNotifOpen(false)}
                />

                <div ref={notifRef} className={`relative ${notifOpen ? "z-80" : "z-10"}`}>
                    <button
                        onClick={() => setNotifOpen((v) => !v)}
                        className={`w-7.5 h-7.5 rounded-sm ${notifOpen? ' bg-[#D28A44] text-[#F6ECDF]' : 'text-[#D28A44] bg-(--db-sidebar-bg)'} flex justify-center items-center `}
                    >
                        <NotificationIcon />
                    </button>

                    <div
                        className={`absolute right-0 top-full mt-2 w-full max-w-78.5 md:w-78.5 bg-(--db-dropdown-bg) rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out origin-top-right ${notifOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                            style={{ backgroundColor: 'var(--db-dropdown-bg)' }}
                    >
                        <div className="px-5 py-5.75 max-h-150 overflow-y-auto thin-scroll">
                            {NOTIFICATIONS.map((item, i) => (
                                <div key={item.id}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D28A44] shrink-0 mt-0.5">
                                            <NotificationIcon />
                                        </span>
                                        <div>
                                            <p className="text-sm font-normal text-(--db-text-primary)">{item.text}</p>
                                            <p className="text-[10px] font-normal text-(--db-text-primary) mt-0.5">{item.time}</p>
                                        </div>
                                    </div>
                                    {i < NOTIFICATIONS.length - 1 && (
                                        <div className="border-b border-(--db-chat-text) my-5" />
                                    )}
                                </div>
                            ))}
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
