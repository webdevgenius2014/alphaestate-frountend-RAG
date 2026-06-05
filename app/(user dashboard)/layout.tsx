import type { ReactNode } from "react";
import ThemeProvider from "./theme-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}
