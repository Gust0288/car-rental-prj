import { httpClient } from './httpClient'


export const authService = {
  login: (credentials: { email: string; password: string }) =>
    httpClient.post('/users/login', credentials),
  
  signup: (userData: {
    username: string
    name: string
    user_last_name: string
    email: string
    password: string
    confirmPassword: string
  }) => httpClient.post('/users/signup', userData),
  
  getProfile: (userId: number) =>
    httpClient.get(`/users/profile/${userId}`),
  
  updateProfile: (userId: number, profileData: {
    username: string
    name: string
    user_last_name: string
    email: string
  }) => httpClient.put(`/users/profile/${userId}`, profileData),
  
  deleteAccount: (userId: number) =>
    httpClient.delete(`/users/profile/${userId}`)
}

// Car services
export const carService = {
  getAllCars: () => httpClient.get('/cars'),
  getCarById: (carId: number) => httpClient.get(`/cars/${carId}`),
}

// Health check
export const healthService = {
  check: () => httpClient.get('/health')
}