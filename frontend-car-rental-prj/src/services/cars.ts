import { httpClient } from "./httpClient";

export type Car = { id: number; make: string; model: string; img_path?: string };

export async function getCars(): Promise<Car[]> {
  const { data } = await httpClient.get<Car[]>("/cars");
  return data;
}
