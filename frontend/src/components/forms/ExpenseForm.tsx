"use client";

import { useForm } from "react-hook-form";

export type ExpenseFormValues = {
  title: string;
  amount: number;
  category: string;
};

export default function ExpenseForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: ExpenseFormValues) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit, formState } = useForm<ExpenseFormValues>({
    defaultValues: { title: "", amount: 0, category: "" },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">รายการ</label>
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          {...register("title", { required: "กรุณากรอกรายการ" })}
        />
        {formState.errors.title ? (
          <p className="mt-1 text-xs text-red-500">
            {String(formState.errors.title.message)}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">จำนวนเงิน</label>
        <input
          type="number"
          step="0.01"
          min={0}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          {...register("amount", { valueAsNumber: true, required: true })}
        />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">หมวดหมู่</label>
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          {...register("category", { required: true })}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-200 disabled:opacity-70"
        >
          {submitting ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
    </form>
  );
}

