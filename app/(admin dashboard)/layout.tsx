import type { ReactNode } from "react";
import ThemeProvider from "@/app/(user dashboard)/theme-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}
