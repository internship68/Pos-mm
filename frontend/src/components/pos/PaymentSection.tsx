"use client";

import type { PaymentMethod } from "@/types/sale.type";

export default function PaymentSection({
  total,
  paymentMethod,
  setPaymentMethod,
  onPay,
  disabled,
}: {
  total: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  onPay: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-700">ยอดรวม</span>
        <span className="text-2xl font-black text-primary-600">฿{Number(total).toLocaleString()}</span>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">วิธีชำระ</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
        >
          <option value="CASH">เงินสด</option>
          <option value="TRANSFER">โอนเงิน</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={disabled}
        className="w-full gradient-primary text-white py-3 rounded-xl font-black disabled:opacity-70"
      >
        ชำระเงิน
      </button>
    </div>
  );
}

