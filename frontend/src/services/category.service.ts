import { api } from "./api";
import { Category } from "@/types/category.type";

export const categoryService = {
    findAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>("/categories");
        return response.data;
    },

    create: async (data: { name: string; description?: string }): Promise<Category> => {
        const response = await api.post<Category>("/categories", data);
        return response.data;
    },

    update: async (id: string, data: { name?: string; description?: string }): Promise<Category> => {
        const response = await api.patch<Category>(`/categories/${id}`, data);
        return response.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    }
};
