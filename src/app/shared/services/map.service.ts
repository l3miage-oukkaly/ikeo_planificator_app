import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {Delivery} from "../../core/models/delivery.models";
import {LatLngTuple} from "leaflet";
import {firstValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  routes!: any;
  private _sigCoords = signal<LatLngTuple[]>([]);
  sigCoords = computed<LatLngTuple[]>(() => this._sigCoords());

  private _sigDeliveries = signal<Delivery[]>([]);
  sigDeliveries = computed<Delivery[]>(() => this._sigDeliveries());

  constructor(private http: HttpClient) {
  }

  setDeliveries(deliveries: Delivery[]) {
    this._sigDeliveries.set(deliveries)
  }

  //From an array of deliveries, initialize markers and set up an array of coordinates (signal).
  //From the array of coordinates, initialize the routes.
  //RO can easily be plugged in between.
  mapLayersInit(map: L.Map, deliveries: Delivery[]) {
    Promise.all(deliveries.map(async (delivery) => await this.addressToCoords(map, delivery))).then((coords) => {
      this._sigCoords.update(() => coords)
      this.requestMatrix(this.sigCoords()).subscribe((matrix: any) => this.optimizeRoutes(map, matrix.distances))
      this.requestRoutes(this.sigCoords()).subscribe(routes => {
        this.routes = routes
        this.initRoutesLayer(map)
      })
    })
  }

  async optimizeRoutes(map: L.Map, distancesMatrix: number[][]) {
    const body = {
      distancesMatrix: distancesMatrix,
      toursCount: 2,
      warehouseIndexInDistancesMatrix: 0
    };
    this.http.post(environment.roUrl, body).subscribe((res: any) => {console.log(res)})
  }

  async addressToCoords(map: L.Map, delivery: Delivery) {
    return await firstValueFrom(this.http.get("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1")).then((res:any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[1]
        const lon = c.geometry.coordinates[0]
        this.initMarker([lat, lon], map, delivery)
      }
      return [res.features[0].geometry.coordinates[0], res.features[0].geometry.coordinates[1]] as LatLngTuple
    })
  }

  requestRoutes(coords: LatLngTuple[]) {
    return this.http.post("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {'coordinates':coords},
      {headers: {'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': '5b3ce3597851110001cf6248941cf3dd3298435b825d39a1afde6112',
          'Content-Type': 'application/json; charset=utf-8'
        }})
  }

  requestMatrix(coords: LatLngTuple[]) {
    return this.http.post("https://api.openrouteservice.org/v2/matrix/driving-car", {'locations':coords, 'metrics':['distance'], 'units':'km'},
      {headers: {'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': '5b3ce3597851110001cf6248941cf3dd3298435b825d39a1afde6112',
          'Content-Type': 'application/json; charset=utf-8'
        }})
  }

  initRoutesLayer(map: L.Map) {
    const routesLayer = L.geoJSON(this.routes, {
      style: (feature) => ({
        weight: 3,
        opacity: 1,
        color: 'purple',
        fillOpacity: 0.8,
        fillColor: 'black'
      })
    });
    map.addLayer(routesLayer);
  }

  initMarker(latlon: LatLngTuple, map: L.Map, delivery: Delivery) {
    const marker = L.marker(latlon)
    marker.bindPopup(this.makePopup(delivery))
    marker.addTo(map)
  }

  makePopup(delivery: Delivery): string {
    return ``+
      `<div><u>Adresse:</u> ${ delivery.address }</div>`
  }

}
