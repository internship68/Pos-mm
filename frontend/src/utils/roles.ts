import type { Role } from "@/types/auth";

export function isAdmin(role?: Role | null) {
  return role === "ADMIN";
}

export function isCashier(role?: Role | null) {
  return role === "CASHIER";
}

