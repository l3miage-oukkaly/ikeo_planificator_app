import { ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {
  AccordionDeliverymenComponent
} from "../../shared/components/accordion-deliverymen/accordion-deliverymen.component";
import { AccordionTruckComponent } from "../../shared/components/accordion-truck/accordion-truck.component";
import { CdkDrag, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatFabButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { PlanificatorService } from "../../shared/services/planificator.service";
import {JsonPipe, NgClass} from "@angular/common";

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
    NgClass,
    JsonPipe
  ],
  templateUrl: './day-displayer.component.html',
  styleUrl: './day-displayer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayDisplayerComponent implements OnInit {
  planificatorService = inject(PlanificatorService)

  async ngOnInit() {
    await this.planificatorService.getDay(this.planificatorService.getTomorrowDate())
  }

}
