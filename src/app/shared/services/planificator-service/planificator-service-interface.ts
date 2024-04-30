import { Signal, WritableSignal } from "@angular/core";
import { Day } from "../../../core/models/day.models";

/*
 * this service should contain the state of the tomorrow planified day 
 * this state is exposed by a public signal 
 *  
 */
export interface PlanificatorServiceInterface {
    readonly _sigPlanifiedDay : WritableSignal<Day> ;
    readonly sigPlanifiedDay : Signal<Day> ;

    /*
        this method should update the state of the planified tomorrow day
        and add a new delivery tour to the array 
        
        if the array is initially empty we should put all the data in the first item
        ( trucks , deliverymen , orders)

        else we create an empty item ( a holder for the next edit of the planificator )

    */
    addDeliveryTour(): void ;

    /*
     *  
     */
    removeDeliveryTour(): void;

    
}