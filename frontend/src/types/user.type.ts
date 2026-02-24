import { Role } from "./auth";

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}
