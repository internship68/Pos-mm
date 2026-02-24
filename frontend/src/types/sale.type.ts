import { User } from "./user.type";
import { SaleItem } from "./sale-item.type";

export type PaymentMethod = "CASH" | "TRANSFER";

export interface Sale {
    id: string;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    slipUrl?: string;
    cashierId: string;
    cashier?: Partial<User>;
    items: SaleItem[];
    createdAt: string;
    updatedAt: string;
}
