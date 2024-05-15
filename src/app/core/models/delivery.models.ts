export interface Delivery {
  orders: string[],
  distanceToCover?: number,
  coordinates?: [number, number]
  address?: string
}
