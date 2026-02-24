import { create } from "zustand";

type InventoryUiState = {
  adjustModalOpen: boolean;
  setAdjustModalOpen: (open: boolean) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
};

export const useInventoryStore = create<InventoryUiState>((set) => ({
  adjustModalOpen: false,
  setAdjustModalOpen: (open) => set({ adjustModalOpen: open }),
  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),
}));

