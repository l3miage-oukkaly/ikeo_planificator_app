import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-day-displayer',
  standalone: true,
  imports: [],
  templateUrl: './day-displayer.component.html',
  styleUrl: './day-displayer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayDisplayerComponent {

}
