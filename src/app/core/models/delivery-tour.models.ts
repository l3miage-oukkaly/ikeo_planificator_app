import {Order} from "./order.models";

export interface DeliveryTour {
  id?: string
  deliveries : [orders: Order[], distanceToCover: number],
  deliveryMen : string[],
  truck : string,
  distanceToCover: number
}
