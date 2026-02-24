import { api } from "./api";
import type { Sale } from "@/types/sale.type";

export const receiptService = {
  findAll: async (): Promise<Sale[]> => {
    const res = await api.get<Sale[]>("/sales");
    return res.data;
  },
  findOne: async (id: string): Promise<Sale> => {
    const res = await api.get<Sale>(`/sales/${id}`);
    return res.data;
  },
};

