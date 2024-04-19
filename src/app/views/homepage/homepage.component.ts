import {Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  private planificatorService = inject(PlanificatorService)

  // If planned, GETs the Day (D+1) from the server
  // Will be used when endpoints will be implemented
  async displayDayPlusOne() {
    //this.dayToDisplay.emit(await this.planificatorService.getDay(this.tomorrowsDate!))
  }

  // Temporary method when "Visualiser J+1" is clicked
  displayDayPlusOne_Dev() {
    console.log(this.planificatorService.tomorrowDate)
  }

}
