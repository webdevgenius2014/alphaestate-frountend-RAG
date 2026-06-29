"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: "#0B1F3A",
                    color: "#fff",
                    border: "1px solid rgba(210,138,68,0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                },
                error: {
                    style: {
                        background: "#CF2D48",
                        border: "none",
                    },
                    iconTheme: { primary: "#fff", secondary: "#CF2D48" },
                },
            }}
        />
    );
}
