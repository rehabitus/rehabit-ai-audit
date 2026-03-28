import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Derive a session token from the password — never store the password itself in the cookie
function sessionToken(password: string): string {
    return createHash("sha256").update(`admin-session:${password}`).digest("hex");
}

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "ADMIN_PASSWORD not configured" }, { status: 503 });
    }

    if (password === process.env.ADMIN_PASSWORD) {
        const token = sessionToken(process.env.ADMIN_PASSWORD);
        const res = NextResponse.json({ ok: true });
        res.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return res;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin_token");
    return res;
}
