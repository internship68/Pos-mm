import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export function useProducts(queryKey: string[] = ["products"]) {
  return useQuery({
    queryKey,
    queryFn: productService.findAll,
  });
}

