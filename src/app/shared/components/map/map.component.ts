import {AfterViewInit, ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "../../services/map.service";
import {Delivery} from "../../../core/models/delivery.models";
import {PlanificatorService} from "../../services/planificator.service";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit {
  planificatorService = inject(PlanificatorService)
  mapService = inject(MapService)
  @Input({required: true}) tourIndex!: number
  private map!: L.Map

  constructor() {}

  ngAfterViewInit() {
    this.initMap()
  }

  initMap() {
    this.map = L.map('map', {
      center: [ 45.16667, 5.71667 ],
      zoom: 12
    })
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    let wCoords: [number, number]
    if (this.planificatorService.sigSetupBundle().coordinates[0] === 0) {
      wCoords = [45.14852, 5.7369725]
    } else {
      wCoords = this.planificatorService.sigSetupBundle().coordinates
    }
    this.mapService.initAllMarkers(this.map, this.planificatorService.sigPlanifiedDay().tours[this.tourIndex].deliveries, wCoords)
    this.mapService.requestRoutes(this.mapService.getTourCoords(this.planificatorService.sigPlanifiedDay().tours[this.tourIndex].deliveries, wCoords)).subscribe((routes) => {
      this.mapService.routes = routes
      console.log(routes)
      this.mapService.initRoutesLayer(this.map)
    })
  }


}
