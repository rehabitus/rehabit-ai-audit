"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Login page renders standalone — no nav
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const logout = async () => {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin/login");
    };

    const navLinks = [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/integrations", label: "Integrations" },
    ];

    return (
        <div className="min-h-screen bg-[#0A1020] text-white">
            {/* Top nav */}
            <nav className="border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="text-brand-green font-logo font-bold text-lg">rehabit.ai</span>
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        pathname === link.href
                                            ? "bg-white/10 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </nav>
            <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </div>
    );
}
