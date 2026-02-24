import { create } from "zustand";
import type { Product } from "@/types/product.type";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (product, qty = 1) =>
    set((state) => {
      const existing = state.items.find((x) => x.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((x) =>
            x.product.id === product.id
              ? { ...x, quantity: x.quantity + qty }
              : x,
          ),
        };
      }
      return { items: [...state.items, { product, quantity: qty }] };
    }),
  setQty: (productId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((x) => x.product.id !== productId)
          : state.items.map((x) =>
              x.product.id === productId ? { ...x, quantity: qty } : x,
            ),
    })),
  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((x) => x.product.id !== productId),
    })),
  clear: () => set({ items: [] }),
  total: () =>
    get().items.reduce(
      (sum, line) => sum + Number(line.product.sellPrice) * line.quantity,
      0,
    ),
}));

