// For the moment, Order = string so orders = string[].
// When implementing RO, change it to Order[]

import {LatLngTuple} from "leaflet";

export interface Delivery {
  address: string
  orders: string[],
  distanceToCover?: number,
  coordinates?: LatLngTuple
}
