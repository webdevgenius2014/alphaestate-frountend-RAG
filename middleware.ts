import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROUTES, USER_ROUTES, isAdmin, getHomePath } from "@/lib/roles";

const publicRoutes = [
  "/login",
  "/signup",
  "/resend-email",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const role = req.cookies.get("user_role")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    /\.\w+$/.test(path)
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(path)) {
    if (refreshToken) {
      return NextResponse.redirect(new URL(getHomePath(role), req.url));
    }
    return NextResponse.next();
  }

  if (ADMIN_ROUTES.some((p) => path.startsWith(p))) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!isAdmin(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (USER_ROUTES.some((p) => path.startsWith(p))) {
    if (!refreshToken) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("refresh_token");
      response.cookies.delete("access_token");
      response.cookies.delete("user_role");
      return response;
    }
    return NextResponse.next();
  }

  if (!refreshToken && path !== "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
