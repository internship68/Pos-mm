import { Product } from "./product.type";

export interface Category {
    id: string;
    name: string;
    description?: string;
    products?: Product[];
    createdAt: string;
    updatedAt: string;
}
