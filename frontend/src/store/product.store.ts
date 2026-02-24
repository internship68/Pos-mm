import { create } from "zustand";

type ProductUiState = {
  search: string;
  setSearch: (value: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
};

export const useProductStore = create<ProductUiState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}));

