"use client";

import { API_CONNECTIONS, API_STATUS_CONFIG } from "@/app/(admin dashboard)/constants";
import ModalButton from "../ui/modal-button";

export function PlatformAPIConnections() {
    return (
        <div className="flex flex-col gap-5 bg-(--db-sidebar-bg) rounded-md p-5">

            <div>
                <h2 className="text-base md:text-[21px] font-medium text-(--db-text-primary)">API & Data Connections</h2>
                <p className="text-[13px] text-(--db-text-primary) mt-0.5">Monitor external integrations and data service connections.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {API_CONNECTIONS.map((conn, i) => {
                    const st = API_STATUS_CONFIG[conn.status];
                    return (
                        <div key={i} className="bg-(--db-main-bg) border border-(--db-border) rounded-md p-5 flex flex-col gap-4">

                            <div className="flex items-center gap-4">
                                <div className="shrink-0 w-13 h-13 bg-[#D28A441A] rounded-md flex items-center justify-center">
                                    {conn.icon}
                                </div>
                                <p className="text-[15px] font-medium text-(--db-text-primary) leading-snug">{conn.name}</p>
                            </div>

                            <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-sm font-medium ${st.bg} ${st.color}`}>
                                <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                                {conn.status}
                            </span>

                            <div className="flex flex-col gap-5 flex-1">
                                {conn.metrics.map((m, j) => (
                                    <div key={j}>
                                        <p className="text-[15px] text-(--db-text-primary) font-normal">{m.label}</p>
                                        <p className="text-[13px] font-medium text-(--db-text-primary)">{m.value}</p>
                                    </div>
                                ))}
                            </div>

                            <ModalButton className="py-2! rounded-sm!">{conn.action}</ModalButton>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}
