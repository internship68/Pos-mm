"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginDto } from "@/types/dtos";
import { useState, useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const { isAuthenticated } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    // Check if already authenticated and redirect
    useEffect(() => {
        if (isAuthenticated) {
            console.log('🔄 Already authenticated, redirecting...');
            router.push('/admin'); // or check user role
        }
    }, [isAuthenticated, router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginDto>();

    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            console.log('✅ Login Success - Response:', data);
            console.log('✅ User role:', data.user.role);
            setAuth(data.user, data.access_token);
            if (data.user.role === "ADMIN") {
                console.log('🔄 Redirecting to /admin');
                router.push("/admin");
            } else {
                console.log('🔄 Redirecting to /cashier');
                router.push("/cashier");
            }
        },
        onError: (err: any) => {
            console.error('❌ Login Error:', err);
            setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
        },
    });

    const onSubmit = (data: LoginDto) => {
        if (isSubmitting) return; // Prevent multiple submissions
        setError(null);
        console.log('🚀 Submitting login form...');
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -z-10 animate-float opacity-20">
                    <div className="w-64 h-64 rounded-full bg-primary-400 blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 -z-10 animate-float opacity-20" style={{ animationDelay: '2s' }}>
                    <div className="w-80 h-80 rounded-full bg-accent-400 blur-3xl"></div>
                </div>

                <div className="glass rounded-3xl p-8 shadow-2xl space-y-8 border-white/50">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                            POS <span className="text-primary-600">Smart</span>
                        </h1>
                        <p className="mt-2 text-slate-500">ระบบจัดการร้านค้าอัจฉริยะ</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                                <input
                                    {...register("email", { required: "กรุณากรอกอีเมล" })}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 backdrop-blur transition-all"
                                    placeholder="admin@pos.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                                <input
                                    {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 backdrop-blur transition-all"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
                        >
                            {isSubmitting || mutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        ยังไม่มีบัญชี?{" "}
                        <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
