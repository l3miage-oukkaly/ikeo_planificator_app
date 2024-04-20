import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {CdkAccordion, CdkAccordionItem} from "@angular/cdk/accordion";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {DeliveryTour} from "../../../core/models/delivery-tour.models";
import {SetupBundle} from "../../../core/models/setup-bundle.models";
import {Day} from "../../../core/models/day.models";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-accordion-deliverymen',
  standalone: true,
  imports: [
    CdkAccordion,
    CdkAccordionItem,
    MatIcon,
    MatMiniFabButton,
    NgClass
  ],
  templateUrl: './accordion-deliverymen.component.html',
  styleUrl: './accordion-deliverymen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionDeliverymenComponent {
  @Input({required: true}) deliveryTourIndex!: number
  @Input() bundle!: WritableSignal<SetupBundle>
  @Input({required: true}) day! : WritableSignal<Day>
  @Input({required: true}) mode!: "edit" | "display"

  addDeliveryMan(Delindex: number) {
    // ALTERNATIVE WITH MAP
    // const delMen: string[] = this.day().tours[this.deliveryTourIndex].deliveryMen
    // delMen.push(this.bundle().deliveryMen.at(Delindex)!);
    // this.day.set({date: this.day().date, tours: this.day().tours.map((tour, index) => {
    //     if (index === this.deliveryTourIndex) {
    //       tour.deliveryMen = delMen
    //     }
    //     return tour
    //   } )})
    const tours = this.day().tours
    tours[this.deliveryTourIndex].deliveryMen.push(this.bundle().deliveryMen.at(Delindex)!)
    this.day.set({date: this.day().date, tours})
    this.bundle().deliveryMen.splice(Delindex, 1)
  }

  removeDeliveryMan(index:number) {
    this.bundle().deliveryMen.push(this.day().tours[this.deliveryTourIndex].deliveryMen.at(index)!)
    const tours = this.day().tours
    tours[this.deliveryTourIndex].deliveryMen.splice(index, 1)
    this.day.set({date: this.day().date, tours})
  }


}
