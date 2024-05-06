import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {SideMenuComponent} from "./shared/components/side-menu/side-menu.component";
import {HeaderComponent} from "./shared/components/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDrawerContent, MatDrawer, MatDrawerContainer, SideMenuComponent, HeaderComponent, MatIcon, MatIconButton, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ikeo-planificator-app';

  constructor() {}
}
