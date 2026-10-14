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

export function formatLoginDevice(userAgent: string | null): string {
    if (!userAgent) return "Unknown device";
    const p = new UAParser(userAgent).getResult();
    return `${p.browser.name ?? "Unknown browser"} on ${p.os.name ?? "Unknown OS"}`;
}

const IP_LOOKUP_URL = "https://ipwho.is";
const locationCache = new Map<string, Promise<string>>();

export function getLocation(ip: string | null): Promise<string> {
    ip = ip?.replace(/^::ffff:/i, "") ?? null;
    if (!ip || ip === "::1" || ip.startsWith("127.")) return Promise.resolve("Local");
    const ipAddr = ip;
    if (!locationCache.has(ipAddr)) {
        locationCache.set(ipAddr, (async () => {
            try {
                const res = await fetch(`${IP_LOOKUP_URL}/${ipAddr}?fields=success,city,country`);
                const data = await res.json();
                if (!data?.success) return ipAddr;
                return [data.city, data.country].filter(Boolean).join(", ") || ipAddr;
            } catch {
                return ipAddr;
            }
        })());
    }
    return locationCache.get(ipAddr)!;
}

export function formatRelativeTime(iso: string | null): string {
    if (!iso) return "—";
    try {
        return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
        return iso;
    }
}
