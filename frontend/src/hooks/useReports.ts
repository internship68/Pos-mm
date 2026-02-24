import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: reportService.getDashboardSummary,
  });
}

