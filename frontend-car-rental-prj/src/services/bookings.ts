import { httpClient } from "./httpClient";

export type Booking = {
  id: number;
  car_id: number;
  user_id: number;
  pickup_location_id?: string;
  return_location_id?: string;
  pickup_at: string;
  return_at: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'returned' | 'canceled';
  price_total?: number;
  created_at: string;
  updated_at: string;
};

export async function getBookedCarIds(): Promise<number[]> {
  try {
    // Fetch all bookings (you might want to add a dedicated endpoint for this)
    // For now, we'll need to implement an endpoint that returns just booked car IDs
    // or we filter from all bookings
    const { data } = await httpClient.get<Booking[]>("/bookings");
    
    console.log("Raw bookings data:", data);
    
    // Filter active bookings (not canceled or returned)
    const activeStatuses = ['pending', 'confirmed', 'in_progress'];
    const activeBookings = data.filter(booking => activeStatuses.includes(booking.status));
    
    console.log("Active bookings:", activeBookings);
    
    // Convert car_id to number to ensure type consistency
    const bookedCarIds = activeBookings.map(booking => Number(booking.car_id));
    
    console.log("Booked car IDs (with duplicates):", bookedCarIds);
    
    // Return unique car IDs
    const uniqueIds = [...new Set(bookedCarIds)];
    console.log("Unique booked car IDs:", uniqueIds);
    
    return uniqueIds;
  } catch (error) {
    console.error("Failed to fetch booked cars:", error);
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
