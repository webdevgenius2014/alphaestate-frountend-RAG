import type { ReactNode } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-[#0B1F3A] overflow-hidden">
            {children}
        </div>
    );
}
