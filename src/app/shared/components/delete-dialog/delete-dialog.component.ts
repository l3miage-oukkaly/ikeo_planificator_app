import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DayPlannerComponent, DialogData} from "../../../views/day-planner/day-planner.component";
import {PlanificatorService} from "../../services/planificator.service";

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent {
  planificatorService = inject(PlanificatorService)

  constructor(public dialogRef: MatDialogRef<DayPlannerComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
