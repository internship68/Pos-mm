import { create } from "zustand";
import type { Sale } from "@/types/sale.type";

type SaleUiState = {
  selectedSale: Sale | null;
  setSelectedSale: (sale: Sale | null) => void;
};

export const useSaleStore = create<SaleUiState>((set) => ({
  selectedSale: null,
  setSelectedSale: (sale) => set({ selectedSale: sale }),
}));

