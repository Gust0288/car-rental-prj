import { carService } from "./api-client";

export type Car = {
  id: number;
  make: string;
  model: string;
  img_path?: string;
  year?: number;
  class?: string;
  fuel_type?: string;
  drive?: string;
  transmission?: string;
  cylinders?: number;
  displacement?: number;
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
  car_location?: string;
};

export async function getCars(search?: string, limit?: number, offset?: number): Promise<Car[]> {
  // Use carService.getAllCars so callers can pass search/limit/offset consistently.
  const resp = await carService.getAllCars(search, limit, offset);
  // carService returns an axios-like response with `.data` in many places,
  // but keep this wrapper resilient: return resp.data if present, otherwise resp.
  // This keeps callers using `getCars()` unchanged while allowing query params.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybeAny: any = resp;
  return maybeAny?.data ?? maybeAny ?? [];
}
