import {Delivery} from "./delivery.models";

export interface DeliveryTour {
  refTour?: string
  deliveries : [orders: Delivery, distanceToCover: number],
  deliveryMen : string[],
  truck : string,
  distanceToCover: number
}
