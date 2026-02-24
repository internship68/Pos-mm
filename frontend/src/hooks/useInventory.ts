import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";

export function useInventory() {
  const queryClient = useQueryClient();

  const movementsQuery = useQuery({
    queryKey: ["inventory-movements"],
    queryFn: inventoryService.getMovements,
  });

  const updateStockMutation = useMutation({
    mutationFn: inventoryService.updateStock,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      await queryClient.invalidateQueries({ queryKey: ["products-active"] });
      await queryClient.invalidateQueries({ queryKey: ["products-admin"] });
    },
  });

  return {
    movementsQuery,
    updateStockMutation,
  };
}

