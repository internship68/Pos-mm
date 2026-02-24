"use client";

import { useForm } from "react-hook-form";
import type { Category } from "@/types/category.type";
import type { CreateProductDto } from "@/types/dtos";

export default function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  submitting,
}: {
  categories: Category[];
  defaultValues?: Partial<CreateProductDto>;
  onSubmit: (data: CreateProductDto) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit, formState } = useForm<CreateProductDto>({
    defaultValues: defaultValues as any,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ชื่อสินค้า</label>
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          {...register("name", { required: "กรุณากรอกชื่อสินค้า" })}
        />
        {formState.errors.name ? (
          <p className="mt-1 text-xs text-red-500">{String(formState.errors.name.message)}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">หมวดหมู่</label>
        <select
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
          {...register("categoryId", { required: true })}
        >
          <option value="">เลือกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ราคาทุน</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register("costPrice", { valueAsNumber: true, required: true })}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ราคาขาย</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register("sellPrice", { valueAsNumber: true, required: true })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">บาร์โค้ด</label>
        <input
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          {...register("barcode")}
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

