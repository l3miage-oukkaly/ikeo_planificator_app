import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {
  AccordionDeliverymenComponent
} from "../../shared/components/accordion-deliverymen/accordion-deliverymen.component";
import {AccordionTruckComponent} from "../../shared/components/accordion-truck/accordion-truck.component";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-day-preview',
  standalone: true,
  imports: [
    AccordionDeliverymenComponent,
    AccordionTruckComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    NgClass,
    RouterLink
  ],
  templateUrl: './day-preview.component.html',
  styleUrl: './day-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPreviewComponent {
  planificatorService = inject(PlanificatorService)
}
