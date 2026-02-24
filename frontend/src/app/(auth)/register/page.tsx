"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterDto } from "@/types/dtos";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterDto & { confirmPassword?: string }>();

    const mutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            router.push("/login?registered=true");
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
        },
    });

    const onSubmit = (data: RegisterDto) => {
        setError(null);
        mutation.mutate({
            ...data,
            role: "ADMIN", // Default for registration in this flow
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full py-12">
                <div className="glass rounded-3xl p-8 shadow-2xl space-y-8 border-white/50">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                            Create <span className="text-primary-600">Account</span>
                        </h1>
                        <p className="mt-2 text-slate-500">สมัครสมาชิกเพื่อเริ่มต้นใช้งานระบบ</p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้งาน</label>
                                <input
                                    {...register("name", { required: "กรุณากรอกชื่อ" })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 transition-all"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                                <input
                                    {...register("email", { required: "กรุณากรอกอีเมล" })}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 transition-all"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                                <input
                                    {...register("password", {
                                        required: "กรุณากรอกรหัสผ่าน",
                                        minLength: { value: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }
                                    })}
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 transition-all"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ยืนยันรหัสผ่าน</label>
                                <input
                                    {...register("confirmPassword", {
                                        required: "กรุณายืนยันรหัสผ่าน",
                                        validate: (value) => value === watch("password") || "รหัสผ่านไม่ตรงกัน"
                                    })}
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white/50 transition-all"
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || mutation.isPending}
                            className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isSubmitting || mutation.isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        มีบัญชีอยู่แล้ว?{" "}
                        <Link href="/login" className="text-primary-600 font-semibold hover:underline">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
