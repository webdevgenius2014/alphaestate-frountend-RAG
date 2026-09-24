"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import appService from "@/app/services/appService";
import { SearchIcon, EyeIcon } from "@/app/(admin dashboard)/constants";
import Button from "@/app/components/ui/button";

const PAGE_LIMIT = 10;

type ContactQuery = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
    createdAt?: string;
};

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`bg-(--db-sidebar-bg) rounded-md p-5 ${className}`}>
            {children}
        </div>
    );
}

const fullName = (q: ContactQuery) => [q.firstName, q.lastName].filter(Boolean).join(" ") || "—";

const formatDate = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : format(d, "dd MMM yyyy, hh:mm a");
};

export default function QueriesPage() {
    const [queries, setQueries] = useState<ContactQuery[]>([]);
    const [activePage, setActivePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);

    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [selected, setSelected] = useState<ContactQuery | null>(null);
    const drawerOpen = selected !== null;

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

    const requestKey = `${activePage}|${activeSearch}`;
    const loading = loadedKey !== requestKey;

    useEffect(() => {
        appService.getAdminContacts(activePage, PAGE_LIMIT, activeSearch || undefined).then(({ items, total, totalPages }) => {
            setQueries(items as ContactQuery[]);
            setTotal(total);
            setTotalPages(totalPages);
            setLoadedKey(`${activePage}|${activeSearch}`);
        });
    }, [activePage, activeSearch]);

    const pageStart = Math.max(1, Math.min(activePage - 2, totalPages - 4));
    const pages = Array.from({ length: Math.min(5, totalPages - pageStart + 1) }, (_, i) => pageStart + i);

    return (
        <>
            <div className="flex flex-col gap-5">

                <div>
                    <h1 className="text-xl md:text-[25px] mb-1.5 leading-none font-medium text-(--db-text-primary)">
                        Queries
                    </h1>
                    <p className="text-sm text-(--db-text-primary) leading-5 font-normal">
                        Messages submitted through the Contact Us form on the landing page.
                    </p>
                </div>

                <Card className="rounded-none!">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary) mb-1">
                                Contact Queries {total > 0 && <span className="text-(--db-text-muted) text-sm">({total})</span>}
                            </h2>
                            <p className="text-[13px] text-(--db-text-primary)">
                                View all enquiries received from website visitors.
                            </p>
                        </div>
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
                    </div>

                    <div className="overflow-x-auto border border-(--db-border) rounded-md">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-(--db-table-header-bg) divide-x divide-(--db-border) text-left text-(--db-text-primary)">
                                    <th className="min-w-40 px-5 py-3 font-semibold whitespace-nowrap">Name</th>
                                    <th className="min-w-48 px-5 py-3 font-semibold whitespace-nowrap">Email</th>
                                    <th className="min-w-36 px-5 py-3 font-semibold whitespace-nowrap">Phone Number</th>
                                    <th className="min-w-64 px-5 py-3 font-semibold whitespace-nowrap">Message</th>
                                    <th className="min-w-44 px-5 py-3 font-semibold whitespace-nowrap">Received On</th>
                                    <th className="min-w-20 px-5 py-3 font-semibold whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map((q, i) => (
                                    <tr
                                        key={q.id ?? i}
                                        className="border-b divide-x divide-(--db-border) border-(--db-border) last:border-0 odd:bg-(--db-main-bg) even:bg-(--db-sidebar-bg) hover:bg-(--db-sidebar-bg) transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium whitespace-nowrap text-(--db-text-primary)">{fullName(q)}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">
                                            {q.email ? <a href={`mailto:${q.email}`} className="hover:text-[#D28A44]">{q.email}</a> : "—"}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{q.phoneNumber || "—"}</td>
                                        <td className="px-5 py-3.5 text-(--db-text-primary) max-w-80 truncate" title={q.message}>{q.message || "—"}</td>
                                        <td className="px-5 py-3.5 whitespace-nowrap text-(--db-text-primary)">{formatDate(q.createdAt)}</td>
                                        <td className="px-5 py-3.5">
                                            <button onClick={() => setSelected(q)} className="w-5.75 h-5.75 rounded-sm flex items-center justify-center text-(--db-text-primary) hover:text-white transition-colors bg-(--db-icon-btn-bg) hover:bg-[#D28A44] ease-linear" title="View">
                                                <EyeIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {!queries.length && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-(--db-text-muted)">
                                            {loading ? "Loading queries..." : "No queries found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-4">
                            {pages.map((p) => (
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
                    )}
                </Card>
            </div>

            <div
                onClick={() => setSelected(null)}
                className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <div className={`fixed top-0 right-0 h-full w-full max-w-121.25 bg-(--db-sidebar-bg) z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
                {selected && (
                    <div className="px-6 py-8">
                        <div className="flex items-start justify-between shrink-0">
                            <div>
                                <h2 className="text-[25px] font-medium text-(--db-text-primary)">Query Detail</h2>
                                <p className="text-[13px] text-(--db-text-primary) mt-1 max-w-74.25">
                                    Full message and contact details of the enquiry.
                                </p>
                            </div>
                            <button onClick={() => setSelected(null)} className="absolute top-4 right-4">
                                <img src="/close.svg" alt="" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] pt-6 space-y-4">
                            <div className="bg-(--db-drawer-section-bg) p-5 grid grid-cols-2 gap-x-6 gap-y-4">
                                {[
                                    { label: "Name", value: fullName(selected) },
                                    { label: "Received On", value: formatDate(selected.createdAt) },
                                    { label: "Email", value: selected.email || "—" },
                                    { label: "Phone Number", value: selected.phoneNumber || "—" },
                                ].map((f) => (
                                    <div key={f.label} className="min-w-0">
                                        <p className="text-[15px] text-(--db-text-primary) font-light mb-0.5">{f.label}</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary) break-words">{f.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-(--db-drawer-section-bg) p-5">
                                <h3 className="text-lg font-medium text-(--db-text-primary) mb-3">Message</h3>
                                <p className="text-sm text-(--db-text-primary) whitespace-pre-wrap break-words leading-6">
                                    {selected.message || "—"}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-4 py-5">
                            <Button variant="primary" onClick={() => setSelected(null)} className="py-3.5! text-base! max-w-full! w-full!">
                                CLOSE
                            </Button>
                            {/* Could be used further */}
                            {/* {selected.email && (
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="inline-flex items-center justify-center py-3.5 text-base w-full font-semibold uppercase border border-[#D28A44] text-[#D28A44] rounded-[5px] hover:bg-[#D28A44] hover:text-white transition-colors"
                                >
                                    Reply by Email
                                </a>
                            )} */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
