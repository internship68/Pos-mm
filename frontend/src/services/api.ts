import axios from "axios";

const raw = process.env.NEXT_PUBLIC_API_URL ?? "";
const trimmed = raw.replace(/\/$/, "");
const BASE = trimmed
  ? trimmed.endsWith("/api")
    ? trimmed
    : `${trimmed}/api`
  : "/api";

export const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});