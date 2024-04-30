import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  @Output() sidenav: EventEmitter<any> = new EventEmitter();

  toggle() {
    this.sidenav.emit();
  }
}
