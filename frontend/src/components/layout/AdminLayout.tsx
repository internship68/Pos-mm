"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        } else if (user?.role !== "ADMIN") {
            router.push("/cashier");
        }
    }, [isAuthenticated, user, router]);

    const menuItems = [
        { name: "แดชบอร์ด", href: "/admin", icon: DashboardIcon },
        { name: "สินค้า", href: "/admin/products", icon: ProductsIcon },
        { name: "หมวดหมู่", href: "/admin/categories", icon: CategoriesIcon },
        { name: "จัดการสต็อก", href: "/admin/inventory", icon: InventoryIcon },
        { name: "รายงาน", href: "/admin/reports", icon: ReportsIcon },
        { name: "รายจ่าย", href: "/admin/expenses", icon: ExpensesIcon },
        { name: "พนักงาน", href: "/admin/users", icon: UsersIcon },
    ];

    if (!isAuthenticated || user?.role !== "ADMIN") return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 glass-dark text-slate-300 border-none m-4 rounded-3xl hidden md:flex flex-col shadow-2xl">
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-white tracking-widest">
                        POS<span className="text-primary-400">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${pathname === item.href
                                    ? "bg-primary-500 text-white shadow-lg shadow-primary-900/40"
                                    : "hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-primary-400"}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span className="font-medium">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 pt-6">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            สวัสดี, <span className="text-primary-600 font-black">{user?.name}</span> 👋
                        </h2>
                        <p className="text-slate-500 mt-1">นี่คือภาพรวมธุรกิจของคุณในวันนี้</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="glass p-1.5 rounded-full px-6 flex items-center space-x-3 border-slate-200">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border-2 border-white shadow-sm">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-slate-800 leading-none">{user?.name}</p>
                                <p className="text-slate-400 text-xs mt-0.5 tracking-wider uppercase font-semibold">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}

// Inline SVGs for simplicity in this setup
function DashboardIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        </svg>
    );
}

function ProductsIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function CategoriesIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );
}

function InventoryIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    );
}

function ReportsIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}

function ExpensesIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V15" />
        </svg>
    );
}

function UsersIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

function LogoutIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}
