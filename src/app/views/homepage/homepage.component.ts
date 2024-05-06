import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {DatePipe} from "@angular/common";
import {MapComponent} from "../../shared/components/map/map.component";

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
export class HomepageComponent {
  planificatorService = inject(PlanificatorService)

}
