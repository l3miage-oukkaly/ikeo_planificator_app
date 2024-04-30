import { Signal, WritableSignal } from "@angular/core";
import { Day } from "../../../core/models/day.models";
import { SetupBundle } from "../../../core/models/setup-bundle.models";

/*
 * this service should contain the state of the tomorrow planified day 
 * this state is exposed by a public signal 
 *  
 * utilisation Partial ?
 * utilisation Readonly ?
 */
export interface PlanificatorServiceInterface {
    
    readonly _sigPlanifiedDay : WritableSignal<Day> ;
    readonly sigPlanifiedDay : Signal<Day> ;

    readonly _daySetupBundle : WritableSignal<SetupBundle> ;
    readonly daySetupBundle : Signal<SetupBundle> ;  

    /*
        this method should update the state of the planified tomorrow day
        and add a new delivery tour to the array 
        
        if the array is initially empty we should put all the data in the first item
        ( trucks , deliverymen , orders)

        else we create an empty item ( a holder for the next edit of the planificator )

    */
    addDeliveryTour(): void ;

    /*
       should remove a delivery tour and put the affected ( truck , deliverymen , orders ) in the day set up bundle 
       on the first devliery tour ,
       if we only have the first tour , just delete them
       if we delete the fist tour , the second one becomes the first and we add the data of the first in it 
       
       example : 
        daySetupBundle = { [c7] , ["Jhon"] , []}

        tour1 : ( [c1,[c2,c3]] , ["thomas","Nico"] , "Renault Kongo"
        tour2 : ( [c4] , ["Hamid"] , "Express" )
       if we delete tour1 , the new state should be :

        daySetupBundle = { [c1,[c2,c3],c7] , ["Jhon"] , []}

        tour1 : ( [c4] , ["Hamid"] , "Express" )
       
     */
    removeDeliveryTour(): void;

    
}