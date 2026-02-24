import { api } from "./api";
import { Product } from "@/types/product.type";
import { CreateProductDto } from "@/types/dtos";

export const productService = {
    findAll: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>("/products");
        return response.data;
    },

    findOne: async (id: string): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    create: async (data: CreateProductDto): Promise<Product> => {
        const response = await api.post<Product>("/products", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateProductDto>): Promise<Product> => {
        const response = await api.patch<Product>(`/products/${id}`, data);
        return response.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },

    getLowStock: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>("/products/low-stock");
        return response.data;
    }
};
