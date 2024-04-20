import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import {CdkAccordion, CdkAccordionItem} from "@angular/cdk/accordion";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {DeliveryTour} from "../../../core/models/delivery-tour.models";
import {Day} from "../../../core/models/day.models";
import {Delivery} from "../../../core/models/delivery.models";
import {SetupBundle} from "../../../core/models/setup-bundle.models";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-accordion-truck',
  standalone: true,
  imports: [
    CdkAccordion,
    CdkAccordionItem,
    MatIcon,
    MatMiniFabButton,
    NgClass
  ],
  templateUrl: './accordion-truck.component.html',
  styleUrl: './accordion-truck.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionTruckComponent {
  @Input({required: true}) deliveryTourIndex!: number
  @Input() bundle!: WritableSignal<SetupBundle>
  @Input({required: true}) day! : WritableSignal<Day>
  @Input({required: true}) mode!: "edit" | "display"

  removeTruck() {
    this.bundle().trucks.push(this.day().tours[this.deliveryTourIndex].truck)
    this.day.set({date:this.day().date, tours: this.day().tours.map((tour, index) => {
      if (index === this.deliveryTourIndex) {
        tour.truck = ''
      }
      return tour
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
      trucks})
    this.addTruck(index)
  }
}
