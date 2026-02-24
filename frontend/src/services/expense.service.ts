import { api } from "./api";
import type { Expense } from "@/types/expense.type";

export const expenseService = {
  findAll: async (): Promise<Expense[]> => {
    const res = await api.get<Expense[]>("/expenses");
    return res.data;
  },
  create: async (data: {
    title: string;
    amount: number;
    category: string;
    description?: string;
  }): Promise<Expense> => {
    const res = await api.post<Expense>("/expenses", data);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

