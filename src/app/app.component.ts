import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {SideMenuComponent} from "./shared/components/side-menu/side-menu.component";
import {HeaderComponent} from "./shared/components/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {Delivery} from "./core/models/delivery.models";
import {MapService} from "./shared/services/map.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDrawerContent, MatDrawer, MatDrawerContainer, SideMenuComponent, HeaderComponent, MatIcon, MatIconButton, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ikeo-planificator-app';
  mapService = inject(MapService)
  deliveries: Delivery[] = [{address: "1 rue de la paix", orders: ["1", "2", "3"]},{address: "2 rue de la paix", orders: ["1", "2", "3"]},
    {address: "3 rue de la paix", orders: ["1", "2", "3"]},{address: "4 rue de la paix", orders: ["1", "2", "3"]}]

  constructor() {
    // this.mapService.testAllAdressesToCoords(this.deliveries, 2)
  }
}
