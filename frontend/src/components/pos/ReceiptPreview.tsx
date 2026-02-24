"use client";

import type { Sale } from "@/types/sale.type";

export default function ReceiptPreview({ sale }: { sale: Sale }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-center mb-4">
        <div className="text-lg font-black">RECEIPT</div>
        <div className="text-xs text-slate-500 font-mono">#{sale.id}</div>
      </div>

      <div className="space-y-2">
        {sale.items?.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{item.product?.name ?? "-"}</div>
              <div className="text-xs text-slate-500 font-mono">
                ฿{Number(item.priceAtSale).toLocaleString()} x {item.quantity}
              </div>
            </div>
            <div className="font-black">
              ฿{(Number(item.priceAtSale) * item.quantity).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">รวม</span>
        <span className="text-xl font-black text-primary-600">฿{Number(sale.totalAmount).toLocaleString()}</span>
      </div>
    </div>
  );
}

