import { httpClient } from "./httpClient";

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    httpClient.post("/users/login", credentials),

  signup: (userData: {
    username: string;
    name: string;
    user_last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => httpClient.post("/users/signup", userData),

  getProfile: (userId: number, config?: any) =>
    httpClient.get(`/users/profile/${userId}`, config),

  updateProfile: (
    userId: number,
    profileData: {
      username: string;
      name: string;
      user_last_name: string;
      email: string;
    }
  ) => httpClient.put(`/users/profile/${userId}`, profileData),

  deleteAccount: (userId: number) =>
    httpClient.delete(`/users/profile/${userId}`),
};

// Car services
export const carService = {
  getAllCars: (search?: string, limit?: number, offset?: number) => {
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(String(search))}`);
    if (typeof limit === "number") params.push(`limit=${limit}`);
    if (typeof offset === "number") params.push(`offset=${offset}`);
    const qs = params.length ? `?${params.join("&")}` : "";
    return httpClient.get(`/cars${qs}`);
  },
  getCarById: (carId: number) => httpClient.get(`/cars/${carId}`),
  // Add more car-related endpoints as needed
};

// Admin services
export const adminService = {
  listUsers: () => httpClient.get("/admin/users"),
  softDeleteUser: (userId: number) =>
    httpClient.delete(`/admin/users/${userId}`),
  listUserBookings: (userId: number) =>
    httpClient.get(`/admin/users/${userId}/bookings`),
};

// Booking services (general)
export const bookingService = {
  getAll: () => httpClient.get("/bookings"),
  cancel: (bookingId: number) =>
    httpClient.patch(`/bookings/${bookingId}/cancel`),
};

// Health check
export const healthService = {
  check: () => httpClient.get("/health"),
};
