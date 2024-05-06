import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import { CdkAccordion, CdkAccordionItem } from "@angular/cdk/accordion";
import { MatIcon } from "@angular/material/icon";
import { MatMiniFabButton } from "@angular/material/button";
import { DeliveryTour } from "../../../core/models/delivery-tour.models";
import { Day } from "../../../core/models/day.models";
import { Delivery } from "../../../core/models/delivery.models";
import { SetupBundle } from "../../../core/models/setup-bundle.models";
import { NgClass } from "@angular/common";
import {PlanificatorService} from "../../services/planificator.service";

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
  @Input({ required: true }) deliveryTourIndex!: number
  @Input({ required: true }) mode!: "edit" | "display"
  planificatorService = inject(PlanificatorService)

}
