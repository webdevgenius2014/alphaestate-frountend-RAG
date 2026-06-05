"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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
    toggleTheme: () => {},
    isDrawerOpen: false,
    toggleDrawer: () => {},
    closeDrawer: () => {},
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
                    <main className="flex-1 overflow-auto bg-(--db-main-bg)">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
