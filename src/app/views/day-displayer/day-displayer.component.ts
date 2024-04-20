import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {
  AccordionDeliverymenComponent
} from "../../shared/components/accordion-deliverymen/accordion-deliverymen.component";
import {AccordionTruckComponent} from "../../shared/components/accordion-truck/accordion-truck.component";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Day} from "../../core/models/day.models";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-day-displayer',
  standalone: true,
  imports: [
    AccordionDeliverymenComponent,
    AccordionTruckComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatFabButton,
    MatIcon,
    MatMiniFabButton,
    NgClass
  ],
  templateUrl: './day-displayer.component.html',
  styleUrl: './day-displayer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayDisplayerComponent {
  planificatorService = inject(PlanificatorService)
  DaySig = signal<Day>({date: this.planificatorService.getTomorrowDate(), tours: [
      {deliveries: [{orders: ['C1', 'C2'], distanceToCover: 0}], deliveryMen: ['ABB'], distanceToCover: 0, truck: 'XP-098-IO'},
      {deliveries: [{orders: ['C3'], distanceToCover: 0}], deliveryMen: ['POL', 'TEL'], distanceToCover: 0, truck: 'AE-473-AD'},
    ]})
}
