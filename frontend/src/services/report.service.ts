import { api } from "./api";
import type { SalesSummary } from "@/types/report.type";

export type DashboardSummary = {
  totalSales?: number;
  totalRevenue?: number;
  totalProducts?: number;
  lowStockCount?: number;
  todaySales?: number;
  todayRevenue?: number;
} & Record<string, unknown>;

export const reportService = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await api.get<DashboardSummary>("/dashboard/summary");
    return res.data;
  },
  getSalesSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SalesSummary> => {
    const res = await api.get<SalesSummary>("/reports/sales-summary", {
      params,
    });
    return res.data;
  },
};

