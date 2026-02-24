"use client";

import { useForm } from "react-hook-form";

export type RestockValues = {
  productId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason?: string;
};

export default function RestockForm({
  products,
  defaultProductId,
  onSubmit,
  submitting,
}: {
  products: { id: string; name: string }[];
  defaultProductId?: string;
  onSubmit: (values: RestockValues) => void;
  submitting?: boolean;
}) {
  const { register, handleSubmit } = useForm<RestockValues>({
    defaultValues: {
      productId: defaultProductId ?? "",
      type: "IN",
      quantity: 1,
      reason: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">สินค้า</label>
        <select
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
          {...register("productId", { required: true })}
        >
          <option value="">เลือกสินค้า...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">ประเภท</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
            {...register("type")}
          >
            <option value="IN">รับเข้า (IN)</option>
            <option value="OUT">เอาออก (OUT)</option>
            <option value="ADJUST">ปรับยอด (ADJUST)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">จำนวน</label>
          <input
            type="number"
            min={1}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            {...register("quantity", { valueAsNumber: true, required: true })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">เหตุผล</label>
        <textarea
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none h-20"
          {...register("reason")}
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

