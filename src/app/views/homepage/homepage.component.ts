import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {DatePipe} from "@angular/common";
import {MapComponent} from "../../shared/components/map/map.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../../shared/components/delete-dialog/delete-dialog.component";
import {ChoiceDialogComponent} from "../../shared/components/choice-dialog/choice-dialog.component";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    RouterLink,
    MapComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  dialog = inject(MatDialog)
  disabledSig = signal<boolean>(false)

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ChoiceDialogComponent, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }

  async ngOnInit() {
    await this.planificatorService.getDay(this.planificatorService.getTomorrowDate()).then(() => {}, (error) => {
      if (error.status === 404 && this.planificatorService.sigPlanifiedDay().tours.length === 0){
        this.disabledSig.set(true)
      }
    })
  }

}
