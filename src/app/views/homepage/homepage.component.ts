import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent {
}
