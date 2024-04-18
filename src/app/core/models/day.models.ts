import {DeliveryTour} from "./delivery-tour.models";

export interface Day {
  date: string,
  tours: DeliveryTour[]
}
