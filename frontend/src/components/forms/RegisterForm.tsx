"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { RegisterDto } from "@/types/dtos";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState } = useForm<
    RegisterDto & { confirmPassword?: string }
  >();

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => router.push("/login?registered=true"),
    onError: (err: any) =>
      setError(err?.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ"),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(({ confirmPassword, ...data }) => {
        setError(null);
        mutation.mutate({ ...data, role: data.role ?? "ADMIN" });
      })}
    >
      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้งาน</label>
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          {...register("name", { required: "กรุณากรอกชื่อ" })}
        />
        {formState.errors.name ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.name.message)}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          {...register("email", { required: "กรุณากรอกอีเมล" })}
        />
        {formState.errors.email ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.email.message)}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
        <input
          type="password"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          {...register("password", {
            required: "กรุณากรอกรหัสผ่าน",
            minLength: { value: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัว" },
          })}
        />
        {formState.errors.password ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.password.message)}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ยืนยันรหัสผ่าน</label>
        <input
          type="password"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
          {...register("confirmPassword", {
            required: "กรุณายืนยันรหัสผ่าน",
            validate: (v) => v === watch("password") || "รหัสผ่านไม่ตรงกัน",
          })}
        />
        {formState.errors.confirmPassword ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.confirmPassword.message)}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting || mutation.isPending}
        className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-200 disabled:opacity-70"
      >
        {mutation.isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
      </button>
    </form>
  );
}

