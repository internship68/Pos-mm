"use client";

import type { Product } from "@/types/product.type";
import CartItem from "./CartItem";

export default function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  items: (Product & { quantity: number })[];
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}) {
  if (items.length === 0) {
    return <p className="text-slate-500 text-center py-8">ตะกร้าว่าง</p>;
  }

  return (
    <div className="divide-y divide-slate-50">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item.id)}
          onDecrease={() => onDecrease(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}

