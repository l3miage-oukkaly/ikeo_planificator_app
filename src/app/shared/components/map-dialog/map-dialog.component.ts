import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {MapComponent} from "../map/map.component";
import {MapService} from "../../services/map.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DayPreviewComponent} from "../../../views/day-preview/day-preview.component";
import {DialogData} from "../../../views/day-planner/day-planner.component";

@Component({
  selector: 'app-map-dialog',
  standalone: true,
  imports: [
    MapComponent,
    MapComponent
  ],
  templateUrl: './map-dialog.component.html',
  styleUrl: './map-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapDialogComponent {
  mapService = inject(MapService)

  constructor(public dialogRef: MatDialogRef<DayPreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
