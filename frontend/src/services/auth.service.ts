import { api } from "./api";
import { AuthResponse, User } from "@/types/auth";
import { RegisterDto, LoginDto } from "@/types/dtos";

export const authService = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterDto): Promise<User> => {
        const response = await api.post<User>("/auth/register", data);
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>("/auth/profile");
        return response.data;
    },
};
