"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { LoginDto } from "@/types/dtos";
import { useState } from "react";

export default function LoginForm({
  onSuccessRedirect,
}: {
  onSuccessRedirect?: (role: string) => string;
}) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<LoginDto>();

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      const role = data.user.role;
      const redirectTo = onSuccessRedirect
        ? onSuccessRedirect(role)
        : role === "ADMIN"
          ? "/admin"
          : "/cashier";
      router.push(redirectTo);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((data) => {
        setError(null);
        mutation.mutate(data);
      })}
    >
      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

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
          {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
        />
        {formState.errors.password ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.password.message)}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting || mutation.isPending}
        className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-200 disabled:opacity-70"
      >
        {mutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}

