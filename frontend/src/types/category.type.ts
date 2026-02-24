import { Product } from "./product.type";

export interface Category {
    id: string;
    name: string;
    description?: string;
    products?: Product[];
    _count?: {
        products: number;
    };
    createdAt: string;
    updatedAt: string;
}
