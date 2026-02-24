import { Category } from "./category.type";

export interface Product {
    id: string;
    barcode?: string;
    name: string;
    description?: string;
    costPrice: number;
    sellPrice: number;
    stockQuantity: number;
    lowStockThreshold: number;
    imageUrl?: string;
    categoryId: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}
