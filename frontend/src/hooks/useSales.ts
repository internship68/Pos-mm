import { useQuery } from "@tanstack/react-query";
import { saleService } from "@/services/sale.service";

export function useSales(queryKey: string[] = ["sales"]) {
  return useQuery({
    queryKey,
    queryFn: saleService.findAll,
  });
}

