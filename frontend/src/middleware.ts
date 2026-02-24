import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    const isPublicPath = pathname === "/login" || pathname === "/register";

    if (!token && !isPublicPath && (pathname.startsWith("/admin") || pathname.startsWith("/cashier"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isPublicPath) {
        // Ideally we should check the role here, but we'll handle redirection in the page/component 
        // because role is stored in localStorage/state usually, not cookies in this simple setup.
        // However, if we put role in cookies we could redirect properly here.
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/cashier/:path*", "/login", "/register"],
};
