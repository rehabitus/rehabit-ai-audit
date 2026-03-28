import { NextRequest, NextResponse } from "next/server";

// ─── Admin auth helper ────────────────────────────────────────────────────────
async function expectedToken(): Promise<string | undefined> {
    if (!process.env.ADMIN_PASSWORD) return undefined;
    const encoder = new TextEncoder();
    const data = encoder.encode(`admin-session:${process.env.ADMIN_PASSWORD}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ── Locale path prefix: rewrite /sk/foo -> /foo while preserving visible URL ──
    const localeMatch = pathname.match(/^\/(sk|en)(\/.*)?$/);
    if (localeMatch) {
        const rest = localeMatch[2] || "/"; // remainder after the locale prefix
        const url = req.nextUrl.clone();
        url.pathname = rest;
        url.searchParams.delete("lang");
        return NextResponse.rewrite(url);
    }

    // ── Admin auth ────────────────────────────────────────────────────────────
    const isProtected =
        (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
        pathname.startsWith("/home-v1-backup");

    if (isProtected) {
        const token = req.cookies.get("admin_token")?.value;
        const expected = await expectedToken();

        if (!expected || !token || token !== expected) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Locale prefixes
        "/sk",
        "/sk/:path*",
        "/en",
        "/en/:path*",
        // Admin protection
        "/admin/:path*",
        "/home-v1-backup/:path*",
        "/home-v1-backup",
    ],
};
