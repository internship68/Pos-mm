export type Role = "ADMIN" | "CASHIER";

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
