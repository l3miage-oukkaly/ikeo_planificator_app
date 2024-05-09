// For the moment, Order = string so orders = string[].
// When implementing RO, change it to Order[]

export interface Delivery {
  address: string
  orders: string[],
  distanceToCover?: number
}
