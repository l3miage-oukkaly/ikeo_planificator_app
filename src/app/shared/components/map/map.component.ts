import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "../../services/map.service";
import {ShapeService} from "../../services/shape.service";
import {Delivery} from "../../../core/models/delivery.models";

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
  mapService = inject(MapService)
  private map!: L.Map
  testDeliveries: Delivery[] = [{orders:[], address:"10 rue des oiseaux"}, {orders:[], address:"76 rue des fleurs"},
    {orders:[], address:"11 avenue du bois"}, {orders:[], address:"12 rue des roses"},]

  constructor() {
  }

  ngAfterViewInit() {
    this.initMap()
  }

  initMap() {
    this.map = L.map('map', {
      center: [ 46.71109, 1.7191036 ],
      zoom: 4
    })
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.mapService.mapLayersInit(this.map, this.testDeliveries)
  }


}
