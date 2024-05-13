import {Delivery} from "./delivery.models";

export interface DeliveryTour {
  refTour?: string
  deliveries : Delivery[],
  deliverymen : string[],
  truck : string,
  distanceToCover: number
}
