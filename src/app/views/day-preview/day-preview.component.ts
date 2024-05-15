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
import {MapDialogComponent} from "../../shared/components/map-dialog/map-dialog.component";
import {MatDialog} from "@angular/material/dialog";

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
  dialog = inject(MatDialog)


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, tourIndex: number): void {
    this.dialog.open(MapDialogComponent, {
      width: 90 + 'vw',
      height: 90 + 'vh',
      maxHeight: 90 + 'vh',
      maxWidth: 90 + 'vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        tourIndex
      }
    });
  }
}
