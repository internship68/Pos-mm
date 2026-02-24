import { api } from "./api";
import { CreateSaleDto } from "@/types/dtos";
import { Sale } from "@/types/sale.type";

export const saleService = {
    create: async (data: CreateSaleDto): Promise<Sale> => {
        const response = await api.post<Sale>("/sales", data);
        return response.data;
    },

    findAll: async (): Promise<Sale[]> => {
        const response = await api.get<Sale[]>("/sales");
        return response.data;
    },

    findOne: async (id: string): Promise<Sale> => {
        const response = await api.get<Sale>(`/sales/${id}`);
        return response.data;
    },
};
