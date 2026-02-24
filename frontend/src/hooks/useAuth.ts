import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { isAdmin, isCashier } from "@/utils/roles";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      setAuth,
      logout,
      isAdmin: isAdmin(user?.role),
      isCashier: isCashier(user?.role),
    }),
    [isAuthenticated, logout, setAuth, token, user],
  );
}

