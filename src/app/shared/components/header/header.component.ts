import {ChangeDetectionStrategy, Component, EventEmitter, Output, signal} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    RouterLink,
    MatSlideToggle
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() sidenav: EventEmitter<any> = new EventEmitter();
  sigDarkMode = signal<boolean>(false)

  constructor() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.changeTheme()
    }
  }

  toggle() {
    this.sidenav.emit();
  }

  changeTheme() {
    document.body.classList.toggle('dark-theme');
    this.sigDarkMode.set(document.body.classList.contains('dark-theme'))
  }
}
