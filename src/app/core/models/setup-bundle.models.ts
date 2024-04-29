import { Delivery } from "./delivery.models";

export interface SetupBundle {
  multipleOrders: Delivery[],
  deliverymen: string[],
  trucks: string[]
}
