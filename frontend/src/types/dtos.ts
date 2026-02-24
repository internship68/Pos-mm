import { Role } from "./auth";

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    role?: Role;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface CreateSaleDto {
    items: {
        productId: string;
        quantity: number;
    }[];
    paymentMethod: "CASH" | "TRANSFER";
    slipUrl?: string;
}

export interface CreateProductDto {
    barcode?: string;
    name: string;
    description?: string;
    costPrice: number;
    sellPrice: number;
    categoryId: string;
    imageUrl?: string;
    lowStockThreshold?: number;
}
