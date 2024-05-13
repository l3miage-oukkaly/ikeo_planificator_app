import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {DayPlannerComponent} from "../../../views/day-planner/day-planner.component";
import {HomepageComponent} from "../../../views/homepage/homepage.component";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {PlanificatorService} from "../../services/planificator.service";
import {MatFormField, MatInput, MatPrefix, MatSuffix} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-choice-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    RouterLink,
    MatInput,
    MatIcon,
    MatSuffix,
    MatPrefix,
    FormsModule,
    MatFormField,
    MatMiniFabButton
  ],
  templateUrl: './choice-dialog.component.html',
  styleUrl: './choice-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoiceDialogComponent {
  toursCountSig = signal<number>(0)
  pageSig = signal<string>("main")
  planificatorService = inject(PlanificatorService)

  constructor(public dialogRef: MatDialogRef<HomepageComponent>) {}

  changePage() {
    if (this.pageSig() === "main") {
      this.pageSig.set("auto presets")
    } else {
      this.pageSig.set("main")
    }
  }

  toursValueChange(changer: 'plus' | 'minus') {
    if (changer === 'plus' && this.toursCountSig() < 99) {
      this.toursCountSig.update(() => this.toursCountSig() + 1)
    } else if (changer === 'minus' && this.toursCountSig() > 0) {
      this.toursCountSig.update(() => this.toursCountSig() - 1)
    }
  }
}
