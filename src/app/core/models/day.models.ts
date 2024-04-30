import {DeliveryTour} from "./delivery-tour.models";

export interface Day {
  date: Readonly<string>,
  tours: DeliveryTour[]
}
