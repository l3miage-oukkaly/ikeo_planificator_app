import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {CdkAccordion, CdkAccordionItem} from "@angular/cdk/accordion";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {DeliveryTour} from "../../../core/models/delivery-tour.models";
import {Day} from "../../../core/models/day.models";
import {Delivery} from "../../../core/models/delivery.models";
import {SetupBundle} from "../../../core/models/setup-bundle.models";

@Component({
  selector: 'app-accordion-truck',
  standalone: true,
    imports: [
        CdkAccordion,
        CdkAccordionItem,
        MatIcon,
        MatMiniFabButton
    ],
  templateUrl: './accordion-truck.component.html',
  styleUrl: './accordion-truck.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionTruckComponent {
  @Input() deliveryTourIndex!: number
  @Input() bundle!: WritableSignal<SetupBundle>
  @Input() day! : WritableSignal<Day>

  removeTruck() {
    this.bundle().trucks.push(this.day().tours[this.deliveryTourIndex].truck)
    this.day.set({date:this.day().date, tours: this.day().tours.map((tour, index) => {
      if (index === this.deliveryTourIndex) {
        tour.truck = ''
        return tour
      } else {
        return tour
      }
      })})
  }

  addTruck(truckIndex: number) {
    this.day.set({date: this.day().date, tours: this.day().tours.map((tour, index) => {
      if (index === this.deliveryTourIndex) {
        tour.truck = this.bundle().trucks.at(truckIndex)!
      }
        return tour
      } )})
    this.bundle().trucks.splice(truckIndex, 1)
  }

  replaceTruck(index: number) {
    const trucks = this.bundle().trucks
    trucks.push(this.day().tours[this.deliveryTourIndex].truck)
    this.bundle.set({multipleOrders: this.bundle().multipleOrders, deliveryMen: this.bundle().deliveryMen,
      trucks: trucks})
    this.addTruck(index)
  }
}
