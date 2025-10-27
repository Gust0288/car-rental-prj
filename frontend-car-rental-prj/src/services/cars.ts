import { httpClient } from "./httpClient";

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
};

export async function getCars(): Promise<Car[]> {
  const { data } = await httpClient.get<Car[]>("/cars");
  return data;
}
