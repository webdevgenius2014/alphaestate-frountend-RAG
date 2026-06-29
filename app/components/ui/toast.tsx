"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

type ToastType = "error" | "success";
type ToastItem = { id: number; message: string; type: ToastType };

let _nextId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "error") => {
        const id = ++_nextId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, showToast, dismiss };
}

export function Toaster({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: number) => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted || toasts.length === 0) return null;

    return createPortal(
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-start gap-3 px-4 py-3.5 rounded-lg shadow-xl min-w-72 max-w-sm text-white text-sm font-medium pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-200 ${
                        t.type === "error" ? "bg-[#CF2D48]" : "bg-[#5E9F62]"
                    }`}
                >
                    <span className="flex-1 leading-5">{t.message}</span>
                    <button
                        onClick={() => dismiss(t.id)}
                        className="shrink-0 text-white/80 hover:text-white text-lg leading-none mt-px"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}
