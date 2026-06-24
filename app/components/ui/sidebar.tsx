"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/(user dashboard)/theme-provider";
import { LogoutModal } from "@/app/components/dashboard/alert-modals";
import {
    MENU_ITEMS,
    SETTINGS_ITEMS,
    SearchBtnIcon,
    SearchIcon,
    SidebarToggleIcon,
} from "@/app/(user dashboard)/constants";

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const { isDark, toggleTheme, isDrawerOpen, closeDrawer } = useTheme();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const handleNavClick = () => { if (isDrawerOpen) closeDrawer(); };

    return (
        <aside
            className={`flex flex-col shrink-0 bg-(--db-sidebar-bg) fixed inset-y-0 left-0 z-50 w-72 transition-all duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} xl:relative xl:inset-auto xl:z-auto xl:translate-x-0 xl:min-h-screen ${collapsed ? "xl:w-18" : "xl:w-84.5"}`}
        >
            <div className={`flex items-center px-5 py-5 mb-5 border-b border-(--db-border) shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Image src="/admin-logo.svg" alt="Alpha Estate" width={30} height={32} className="flex-shrink-0 w-full h-full" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed((p) => !p)}
                    className={`hidden xl:flex w-5.5 h-5.5 justify-center items-center border border-(--db-toggle-border) text-(--db-text-primary) rounded-[3px] transition-all ease-in-out shrink-0 ${collapsed ? "rotate-180" : ""}`}
                >
                    <SidebarToggleIcon collapsed={collapsed} />
                </button>
            </div>

            {!collapsed && (
                <div className={`${collapsed ? 'px-3' : 'px-5'} pb-5 mb-5 shrink-0 border-b border-(--db-border)`}>
                    <div className="flex items-center gap-2 bg-(--db-search-bg) rounded-sm px-2.5 h-11.5">
                        <SearchIcon className="shrink-0 text-(--db-text-primary)" />
                        <input
                            type="text"
                            placeholder="Search Here..."
                            className="flex-1 text-sm text-(--db-text-primary) outline-none bg-transparent placeholder-(--db-text-muted) min-w-0"
                        />
                        <span className="shrink-0">
                            <SearchBtnIcon />
                        </span>
                    </div>
                </div>
            )}

            <nav className="flex-1 overflow-y-auto pb-5 thin-scroll">
                {!collapsed && (
                    <p className="text-xs text-(--db-text-primary) font-normal uppercase px-5 mb-3.25">
                        Menu
                    </p>
                )}

                <div className={`space-y-2.5 mb-5 ${collapsed ? 'px-3' : 'px-5'} pb-5 border-b border-(--db-border)`}>
                    {MENU_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                title={collapsed ? item.label : undefined}
                                className={`group flex items-center gap-3 px-4.25 text-[15px] rounded-sm transition-all duration-200 ease-linear ${active
                                        ? "bg-[#D28A44] text-white font-semibold"
                                        : "bg-(--db-item-bg) text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white font-medium hover:font-semibold"
                                    } ${collapsed ? "justify-center py-2" : "py-4"}`}
                            >
                                <item.icon
                                    className={`shrink-0 ${active ? "text-white" : "text-[#D28A44] group-hover:text-white"}`}
                                />
                                {!collapsed && (
                                    <span className="text-sm truncate">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {!collapsed && (
                    <p className="text-xs text-(--db-text-primary) font-normal uppercase px-5 mb-3.25">
                        Settings
                    </p>
                )}

                <div className={`space-y-2.5 mb-5 ${collapsed ? 'px-3' : 'px-5'}`}>
                    {SETTINGS_ITEMS.map((item) => {
                        if (item.isToggle) {
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={toggleTheme}
                                    title={collapsed ? item.label : undefined}
                                    className={`group flex w-full items-center gap-3 px-4.25 text-[15px] rounded-sm transition-all duration-200 ease-linear ${isDark
                                            ? "bg-[#D28A44] text-white font-semibold"
                                            : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white font-medium hover:font-semibold"
                                        } ${collapsed ? "justify-center py-2" : "py-4"}`}
                                >
                                    <item.icon
                                        className={`shrink-0 ${isDark ? "text-white" : "text-[#D28A44] group-hover:text-white"}`}
                                    />
                                    {!collapsed && (
                                        <>
                                            <span className="text-sm flex-1 text-left">
                                                {item.label}
                                            </span>
                                            <div
                                                className={`relative w-13.75 h-6 rounded-full border transition-colors duration-200 shrink-0 ${isDark ? "bg-white border-[#D28A44]" : "bg-white border-[#E4E4E4]"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 w-5 h-5 bg-[#D28A44] rounded-full shadow transition-all duration-200 ${isDark ? "left-0.5" : "left-0.5"
                                                        }`}
                                                />
                                            </div>
                                        </>
                                    )}
                                </button>
                            );
                        }

                        if (item.label === "Logout") {
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setLogoutOpen(true)}
                                    title={collapsed ? item.label : undefined}
                                    className={`group flex w-full items-center gap-3 px-4.25 text-[15px] rounded-sm transition-all duration-200 ease-linear text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white font-medium hover:font-semibold ${collapsed ? "justify-center py-2" : "py-4"}`}
                                >
                                    <item.icon className="shrink-0 text-[#D28A44] group-hover:text-white" />
                                    {!collapsed && <span className="text-sm truncate">{item.label}</span>}
                                </button>
                            );
                        }

                        const active = item.href ? isActive(item.href) : false;
                        return (
                            <Link
                                key={item.label}
                                href={item.href ?? "#"}
                                onClick={handleNavClick}
                                title={collapsed ? item.label : undefined}
                                className={`group flex items-center gap-3 px-4.25 text-[15px] rounded-sm transition-all duration-200 ease-linear ${active
                                        ? "bg-[#D28A44] text-white font-semibold"
                                        : "text-(--db-text-primary) hover:bg-[#D28A44] hover:text-white font-medium  hover:font-semibold"
                                    } ${collapsed ? "justify-center py-2" : "py-4"}`}
                            >
                                <item.icon
                                    className={`shrink-0 ${active ? "text-white" : "text-[#D28A44] group-hover:text-white"}`}
                                />
                                {!collapsed && (
                                    <span className="text-sm truncate">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {logoutOpen && (
                <LogoutModal
                    onClose={() => setLogoutOpen(false)}
                />
            )}
        </aside>
    );
}
