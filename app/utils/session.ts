import { UAParser } from "ua-parser-js";
import { formatDistanceToNow } from "date-fns";

export function formatDevice(userAgent: string | null): string {
    if (!userAgent) return "Unknown Device";
    const p = new UAParser(userAgent).getResult();
    const device = p.device.type === "mobile" ? "Mobile"
        : p.device.type === "tablet" ? "Tablet"
        : "Desktop";
    return `${p.os.name ?? "Unknown"} ${device} · ${p.browser.name ?? "Unknown"}`;
}

export async function getLocation(ip: string | null): Promise<string> {
    if (!ip || ip === "::1" || ip.startsWith("127.")) return "Local";
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SESSION_URL}/json/${ip}?fields=city,countryCode`);
        const data = await res.json();
        if (!data?.city) return ip;
        return `${data.city}, ${data.countryCode}`;
    } catch {
        return ip;
    }
}

export function formatRelativeTime(iso: string | null): string {
    if (!iso) return "—";
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
        return iso;
    }
}
