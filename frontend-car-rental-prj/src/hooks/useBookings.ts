import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserBookings,
  cancelBooking,
  type UserBooking,
} from "../services/bookings";
import { httpClient } from "../services/httpClient";
import { toaster, TOAST_DURATIONS } from "../utils/toaster";
import { carQueryKeys } from "./useCars";

export const bookingQueryKeys = {
  all: ["bookings"] as const,
  user: (userId: number) => [...bookingQueryKeys.all, "user", userId] as const,
};

/**
 * Hook to fetch user bookings with caching
 */
export function useUserBookings(userId: number | undefined) {
  return useQuery({
    queryKey: bookingQueryKeys.user(userId!),
    queryFn: () => getUserBookings(userId!),

    enabled: !!userId, // Only run if userId exists

    staleTime: 1 * 60 * 1000, // 1 min - bookings change frequently
    gcTime: 5 * 60 * 1000, // 5 min

    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false; // Don't retry auth errors
      return failureCount < 2;
    },
  });
}

/**
 * Hook to cancel booking with optimistic updates
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),

    // Optimistic Update - update UI immediately
    onMutate: async (bookingId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookingQueryKeys.all });

      // Snapshot previous value
      const previousBookings = queryClient.getQueriesData({
        queryKey: bookingQueryKeys.all,
      });

      // Optimistically update to canceled
      queryClient.setQueriesData<UserBooking[]>(
        { queryKey: bookingQueryKeys.all },
        (old) =>
          old?.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "canceled" as const }
              : booking
          )
      );

      return { previousBookings };
    },

    // Rollback on error
    onError: (_err, _bookingId, context) => {
      if (context?.previousBookings) {
        context.previousBookings.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toaster.create({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        type: "error",
        duration: TOAST_DURATIONS.medium,
      });
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },

    onSuccess: () => {
      toaster.create({
        title: "Booking canceled",
        description: "Your booking has been successfully canceled.",
        type: "success",
        duration: TOAST_DURATIONS.medium,
      });

      // Invalidate booked car IDs to update availability
      queryClient.invalidateQueries({ queryKey: carQueryKeys.booked() });
    },
  });
}
