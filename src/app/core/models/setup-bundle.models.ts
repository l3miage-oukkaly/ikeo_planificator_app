import {Delivery} from "./delivery.models";

export interface SetupBundle {
  multipleOrders : Delivery[],
  deliveryMen : string[],
  trucks: string[]
}
