import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { SetupBundle } from "../../core/models/setup-bundle.models";
import { PlanificatorService } from "../../shared/services/planificator.service";
import { MatRow } from "@angular/material/table";
import { Day } from "../../core/models/day.models";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { NgClass } from "@angular/common";
import { MatDivider } from "@angular/material/divider";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { DeliveryTour } from "../../core/models/delivery-tour.models";
import {
  CdkDrag,
  CdkDragDrop, CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Delivery } from "../../core/models/delivery.models";
import {
  AccordionDeliverymenComponent
} from "../../shared/components/accordion-deliverymen/accordion-deliverymen.component";
import { AccordionTruckComponent } from "../../shared/components/accordion-truck/accordion-truck.component";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../../shared/components/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-day-planner',
  standalone: true,
  imports: [
    MatRow,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgClass,
    MatDivider,
    CdkAccordionModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    AccordionDeliverymenComponent,
    AccordionTruckComponent,
    RouterLink
  ],
  templateUrl: './day-planner.component.html',
  styleUrl: './day-planner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPlannerComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  dialog = inject(MatDialog)

  constructor() { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, tourIndex: number): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        tourIndex
      }
    });
  }

  moveDelivery(event: CdkDragDrop<Delivery[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  isValidTour(tour: DeliveryTour): boolean {
    return (tour.deliveries.length != 0 && tour.truck != '' && tour.deliveryMen.length != 0)
  }

  isValidDay() {
    if (this.planificatorService.daySig().tours.length === 0) {
      return true
    }
    return this.planificatorService.daySig().tours.map((tour) => this.isValidTour(tour)).filter((bool) => !bool).length != 0
  }

  async ngOnInit() {
    await this.planificatorService.getSetupBundle()
  }
}

export interface DialogData {
  tourIndex: number
}
