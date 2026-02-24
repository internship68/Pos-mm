"use client";

import type { Product } from "@/types/product.type";

export default function ProductList({
  products,
  onPick,
}: {
  products: Product[];
  onPick: (p: Product) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() => onPick(product)}
          className="text-left bg-slate-50 rounded-2xl p-4 hover:bg-primary-50 transition-colors"
        >
          <div className="aspect-square bg-slate-200 rounded-xl mb-2 overflow-hidden">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="font-bold text-sm truncate text-slate-900">{product.name}</div>
          <div className="text-primary-600 font-black">฿{Number(product.sellPrice).toLocaleString()}</div>
          <div className="text-xs text-slate-500">สต็อก: {product.stockQuantity}</div>
        </button>
      ))}
    </div>
  );
}

