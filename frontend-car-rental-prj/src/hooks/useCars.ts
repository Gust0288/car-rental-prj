import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCars, type Car } from "../services/cars";
import { getBookedCarIds } from "../services/bookings";
import { logger } from "../utils/logger";

// Query Keys - centralized for consistency
export const carQueryKeys = {
  all: ["cars"] as const,
  lists: () => [...carQueryKeys.all, "list"] as const,
  list: (filters?: { search?: string; limit?: number }) =>
    [...carQueryKeys.lists(), filters] as const,
  booked: () => ["bookedCarIds"] as const,
};

/**
 * Hook to fetch all cars with caching and retry logic
 */
export function useCars(search?: string, limit = 200) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: carQueryKeys.list({ search, limit }),
    queryFn: async () => {
      logger.debug("Fetching cars", { search, limit });
      try {
        const cars = await getCars(search, limit);
        logger.info(`Loaded ${cars.length} cars`, { search });
        return cars;
      } catch (error) {
        logger.error("Failed to fetch cars", error, { search, limit });
        throw error;
      }
    },

    // Caching Configuration
    staleTime: 5 * 60 * 1000, // 5 min - cars rarely change
    gcTime: 30 * 60 * 1000, // 30 min - keep in memory

    // Retry Configuration
    retry: (failureCount, error: any) => {
      // Don't retry on 404/400 errors
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    // Initial Data (optional - use cached data from broader query)
    initialData: () => {
      const allCars = queryClient.getQueryData<Car[]>(carQueryKeys.list());
      return allCars;
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(carQueryKeys.list())?.dataUpdatedAt;
    },

    // Prefetching - start loading before user needs it
    placeholderData: (previousData) => previousData, // Keep old data while loading
  });
}

/**
 * Hook to fetch booked car IDs with aggressive caching
 */
export function useBookedCarIds() {
  return useQuery({
    queryKey: carQueryKeys.booked(),
    queryFn: async () => {
      logger.debug("Fetching booked car IDs");
      try {
        const bookedIds = await getBookedCarIds();
        logger.info(`Loaded ${bookedIds.length} booked car IDs`);
        return bookedIds;
      } catch (error) {
        logger.error("Failed to fetch booked car IDs", error);
        throw error;
      }
    },

    staleTime: 2 * 60 * 1000, // 2 min - bookings change more frequently
    gcTime: 10 * 60 * 1000, // 10 min

    retry: 2,
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
}

/**
 * Prefetch cars for better UX (call on hover/navigation)
 */
export function usePrefetchCars() {
  const queryClient = useQueryClient();

  return (search?: string) => {
    queryClient.prefetchQuery({
      queryKey: carQueryKeys.list({ search }),
      queryFn: () => getCars(search, 200),
      staleTime: 5 * 60 * 1000,
    });
  };
}
