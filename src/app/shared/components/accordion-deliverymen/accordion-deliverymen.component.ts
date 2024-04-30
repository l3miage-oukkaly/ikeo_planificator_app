import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, WritableSignal} from '@angular/core';
import { CdkAccordion, CdkAccordionItem } from "@angular/cdk/accordion";
import { MatIcon } from "@angular/material/icon";
import { MatMiniFabButton } from "@angular/material/button";
import { DeliveryTour } from "../../../core/models/delivery-tour.models";
import { SetupBundle } from "../../../core/models/setup-bundle.models";
import { Day } from "../../../core/models/day.models";
import { NgClass } from "@angular/common";
import {PlanificatorService} from "../../services/planificator.service";

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
  @Input({ required: true }) deliveryTourIndex!: number
  @Input({ required: true }) mode!: "edit" | "display"
  planificatorService = inject(PlanificatorService)
}
