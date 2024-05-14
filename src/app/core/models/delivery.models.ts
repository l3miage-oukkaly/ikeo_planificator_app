// For the moment, Order = string so orders = string[]
// When implementing RO, change it to Order[]

import {LatLngTuple} from "leaflet";

export interface Delivery {
  orders: string[],
  distanceToCover?: number,
  coordinates?: [number, number]
  address?: string
}
