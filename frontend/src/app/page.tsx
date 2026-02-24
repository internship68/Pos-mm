"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootPage() {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            if (user?.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/cashier");
            }
        }
    }, [isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );
}
