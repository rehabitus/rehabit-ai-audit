import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: "ADMIN_PASSWORD not configured" }, { status: 503 });
    }

    if (password === process.env.ADMIN_PASSWORD) {
        const res = NextResponse.json({ ok: true });
        res.cookies.set("admin_token", password, {
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
