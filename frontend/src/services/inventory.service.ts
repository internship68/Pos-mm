import { api } from "./api";

export type InventoryMovement = {
  id: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason?: string;
  createdAt: string;
  product?: { id: string; name: string };
  user?: { id: string; name: string };
};

export const inventoryService = {
  getMovements: async (): Promise<InventoryMovement[]> => {
    const res = await api.get<InventoryMovement[]>("/inventory/movements");
    return res.data;
  },
  updateStock: async (data: {
    productId: string;
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    reason?: string;
  }): Promise<void> => {
    await api.post("/inventory/update", data);
  },
};

