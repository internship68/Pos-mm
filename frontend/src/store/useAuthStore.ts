import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => {
                console.log('🔐 setAuth called with:', { user, token });
                if (typeof window !== "undefined") {
                    localStorage.setItem("access_token", token);
                    // Also set cookie for middleware
                    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Strict`;
                    console.log('💾 Token saved to localStorage and cookie');
                }
                set({ user, token, isAuthenticated: true });
                console.log('✅ Auth state updated:', { user, token, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("access_token");
                    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
                }
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
