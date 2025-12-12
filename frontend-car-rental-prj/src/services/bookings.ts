import { httpClient } from "./httpClient";

export type Booking = {
  id: number;
  car_id: number;
  user_id: number;
  pickup_at: string;
  return_at: string;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "returned"
    | "canceled"
    | "expired";
  price_total?: number;
  created_at: string;
  updated_at: string;
};

export type UserBooking = Booking & {
  make?: string;
  model?: string;
  year?: number;
  img_path?: string;
  car_location?: string;
};

export async function getBookedCarIds(
  pickupAt?: string,
  returnAt?: string
): Promise<number[]> {
  try {
    const params: Record<string, string> = {};
    if (pickupAt) params.pickup_at = pickupAt;
    if (returnAt) params.return_at = returnAt;

    // Fetch booked car IDs directly (no booking details exposed)
    const { data } = await httpClient.get<number[]>(
      "/bookings/booked-car-ids",
      {
        params,
      }
    );

    console.log("Booked car IDs:", data);
    return data;
  } catch (error) {
    console.error("Error fetching booked car IDs:", error);
    return [];
  }
}

export async function checkCarAvailability(
  carId: number,
  pickupAt: string,
  returnAt: string
): Promise<boolean> {
  try {
    const { data } = await httpClient.get<{ available: boolean }>(
      `/bookings/availability`,
      {
        params: {
          car_id: carId,
          pickup_at: pickupAt,
          return_at: returnAt,
        },
      }
    );
    return data.available;
  } catch (error) {
    console.error("Failed to check availability:", error);
    return false;
  }
}

export async function getUserBookings(userId: number): Promise<UserBooking[]> {
  try {
    const { data } = await httpClient.get<UserBooking[]>(
      `/bookings/user/${userId}`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    throw error;
  }
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  try {
    const { data } = await httpClient.patch<Booking>(
      `/bookings/${bookingId}/cancel`
    );
    return data;
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw error;
  }
}
