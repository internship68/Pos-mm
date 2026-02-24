"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

interface CashierLayoutProps {
    children: React.ReactNode;
}

export default function CashierLayout({ children }: CashierLayoutProps) {
    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden">
            {/* Top Navigation */}
            <header className="h-16 glass border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-4">
                    <Link href="/cashier" className="text-xl font-black tracking-tighter text-slate-900">
                        POS<span className="text-primary-600">SMART</span>
                    </Link>
                    <div className="h-6 w-[1px] bg-slate-300 mx-2"></div>
                    <p className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                        CASHIER MODE
                    </p>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">พนักงานขาย</p>
                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all group"
                            title="ออกจากระบบ"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
