import {Delivery} from "./delivery.models";

export interface DeliveryTour {
  refTour?: string
  deliveries : Delivery[],
  deliveryMen : string[],
  truck : string,
  distanceToCover: number
}
