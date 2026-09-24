export const ADMIN_ROUTES = [
    "/admin-dashboard",
    "/users-management",
    "/admin-analytics",
    "/subscriptions-billing",
    "/ai-data",
    "/properties-management",
    "/platform-management",
    "/queries",
];

export const USER_ROUTES = [
    "/dashboard",
    "/analytics",
    "/ai-chat",
    "/deal-analyzer",
    "/profile-settings",
    "/reports",
    "/saved",
    "/smart-alerts",
    "/subscription",
];

export function isAdmin(role?: string | null): boolean {
    return role === "admin";
}

export function getHomePath(role?: string | null): string {
    return isAdmin(role) ? "/admin-dashboard" : "/dashboard";
}
