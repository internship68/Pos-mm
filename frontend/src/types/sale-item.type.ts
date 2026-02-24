import { Product } from "./product.type";

export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    product?: Product;
    quantity: number;
    priceAtSale: number;
}
