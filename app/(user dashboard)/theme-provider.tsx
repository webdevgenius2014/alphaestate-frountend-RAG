"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/ui/sidebar";
import Navbar from "@/app/components/ui/navbar";

type ThemeCtx = {
    isDark: boolean;
    toggleTheme: () => void;
    isDrawerOpen: boolean;
    toggleDrawer: () => void;
    closeDrawer: () => void;
};

const ThemeContext = createContext<ThemeCtx>({
    isDark: false,
    toggleTheme: () => { },
    isDrawerOpen: false,
    toggleDrawer: () => { },
    closeDrawer: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <ThemeContext.Provider value={{
            isDark,
            toggleTheme: () => setIsDark((p) => !p),
            isDrawerOpen,
            toggleDrawer: () => setIsDrawerOpen((p) => !p),
            closeDrawer: () => setIsDrawerOpen(false),
        }}>
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 xl:hidden"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}
            <div className={`flex h-screen overflow-hidden bg-(--db-main-bg) ${isDark ? "dark" : ""}`}>
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar />
                    <main className="flex-1 p-[20px_21px_20px_20px] overflow-auto bg-(--db-main-bg) thin-scroll">
                        {children}
                        <footer className="bg-(--db-sidebar-bg) mt-5 px-5 py-3 flex flex-wrap rounded-[3px] items-center justify-between gap-2">
                            <p className="text-xs inline-flex text-(--db-text-primary)">© Copyright 2025, Alpha Estate | All Rights Reserved</p>
                            <div className="inline-flex items-center gap-4 text-xs text-(--db-text-primary)">
                                <Link href="#" className="hover:text-(--db-text-primary) transition-colors">Privacy Policy</Link>
                                <Link href="#" className="hover:text-(--db-text-primary) transition-colors">Terms of Service</Link>
                            </div>
                        </footer>
                    </main>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
