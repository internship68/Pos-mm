"use client";

import type { Product } from "@/types/product.type";

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: Product & { quantity: number };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100">
      <div className="min-w-0 flex-1">
        <div className="font-bold text-slate-800 truncate">{item.name}</div>
        <div className="text-xs text-slate-500">฿{Number(item.sellPrice).toLocaleString()} x {item.quantity}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDecrease} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200">-</button>
        <div className="w-8 text-center font-bold">{item.quantity}</div>
        <button onClick={onIncrease} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200">+</button>
        <button onClick={onRemove} className="w-8 h-8 rounded-lg text-red-600 hover:bg-red-50">×</button>
      </div>
    </div>
  );
}

