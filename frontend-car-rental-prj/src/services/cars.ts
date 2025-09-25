import { api } from './api'

export type Car = { id: number; brand: string; model: string }

export async function getCars(): Promise<Car[]> {
  const { data } = await api.get<Car[]>('/cars')
  return data
}
