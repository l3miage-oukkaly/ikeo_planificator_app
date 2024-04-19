import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal} from '@angular/core';
import {CdkAccordion, CdkAccordionItem} from "@angular/cdk/accordion";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {DeliveryTour} from "../../../core/models/delivery-tour.models";
import {SetupBundle} from "../../../core/models/setup-bundle.models";
import {Day} from "../../../core/models/day.models";

@Component({
  selector: 'app-accordion-deliverymen',
  standalone: true,
    imports: [
        CdkAccordion,
        CdkAccordionItem,
        MatIcon,
        MatMiniFabButton
    ],
  templateUrl: './accordion-deliverymen.component.html',
  styleUrl: './accordion-deliverymen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionDeliverymenComponent {
  @Input() deliveryTourIndex!: number
  @Input() bundle!: WritableSignal<SetupBundle>
  @Input() day! : WritableSignal<Day>

  addDeliveryMan(Delindex: number) {
    const delMen: string[] = this.day().tours[this.deliveryTourIndex].deliveryMen
    delMen.push(this.bundle().deliveryMen.at(Delindex)!);
    this.day.set({date: this.day().date, tours: this.day().tours.map((tour, index) => {
        if (index === this.deliveryTourIndex) {
          tour.deliveryMen = delMen
        }
        return tour
      } )})
    this.bundle().deliveryMen.splice(Delindex, 1)
  }

  removeDeliveryMan(index:number) {
    this.bundle().deliveryMen.push(this.day().tours[this.deliveryTourIndex].deliveryMen.at(index)!)
    const delMen = this.day().tours[this.deliveryTourIndex].deliveryMen.splice(index, 1)
    this.day.set({date:this.day().date, tours: this.day().tours.map((tour, index) => {
        if (index === this.deliveryTourIndex) {
          tour.deliveryMen = delMen
        }
        return tour
      })})
  }


}
