import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {PlanificatorService} from "../../shared/services/planificator.service";
import {MatDialog} from "@angular/material/dialog";
import {ChoiceDialogComponent} from "../../shared/components/choice-dialog/choice-dialog.component";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  authService = inject(AuthService)
  dialog = inject(MatDialog)
  disabledSig = signal<boolean>(false)

  constructor() {}

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
