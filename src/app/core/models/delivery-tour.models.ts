import {Delivery} from "./delivery.models";

export interface DeliveryTour {
  deliveries : Delivery[],
  deliverymen : string[],
  truck : string,
  distanceToCover: number,
  refTour?: string
  coordinates? : [number, number]
}
