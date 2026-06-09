"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/app/(user dashboard)/theme-provider";

function formatLabel(segment: string) {
    return segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function Navbar() {
    const pathname = usePathname();
    const { toggleDrawer, isDrawerOpen } = useTheme();
    const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
    const pageLabel = formatLabel(segment);

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

            <div className="flex items-center gap-2.25 ml-auto">
                <div className="w-8.5 h-8.5 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/favicon.ico" alt="" className="object-cover" />
                </div>
                <div className="leading-tight xl:mr-0 mr-2">
                    <p className="text-[15px] font-normal text-(--db-text-primary)">Jammy Roy</p>
                    <p className="text-xs text-(--db-text-muted) font-normal">User Admin</p>
                </div>

                <button
                    onClick={toggleDrawer}
                    className="xl:hidden relative z-60 flex min-w-9.75 w-9.75 h-9.75 rounded-sm items-center justify-center bg-[#D28A44] shrink-0"
                    aria-label="Toggle menu"
                >
                    <div className="relative w-9 h-9 flex items-center justify-center">
                        <span
                            className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "rotate-45 translate-y-0" : "-translate-y-2 rotate-0"
                                }`}
                        />
                        <span
                            className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                                }`}
                        />
                        <span
                            className={`absolute w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${isDrawerOpen ? "-rotate-45 translate-y-0" : "translate-y-2 rotate-0"
                                }`}
                        />
                    </div>
                </button>
            </div>

        </header>
    );
}
