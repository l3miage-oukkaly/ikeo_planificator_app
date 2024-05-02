import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {Delivery} from "../../core/models/delivery.models";
import {LatLngTuple} from "leaflet";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  routes!: any;
  private _sigCoords = signal<LatLngTuple[]>([]);
  sigCoords = computed<LatLngTuple[]>(() => this._sigCoords());

  constructor(private http: HttpClient) {
  }

  //From an array of deliveries, initialize markers and set up an array of coordinates (signal).
  //From the array of coordinates, initialize the routes.
  //RO can easily be plugged in between.
  mapLayersInit(map: L.Map, deliveries: Delivery[]) {
    Promise.all(deliveries.map(async (delivery) => await this.addressToCoords(map, encodeURIComponent(delivery.address!)))).then(() => {
      this.requestRoutes(this.sigCoords()).subscribe(routes => {
        this.routes = routes
        this.initRoutesLayer(map)
      })
    })
  }

  async addressToCoords(map: L.Map, address: string) {
    await firstValueFrom(this.http.get("https://api-adresse.data.gouv.fr/search/?q="+address+"&limit=1")).then((res:any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[1]
        const lon = c.geometry.coordinates[0]
        this._sigCoords.update((coords) => [...coords, [lon, lat]])
        this.initMarker([lat, lon], map)
      }
    })
  }

  requestRoutes(coords: LatLngTuple[]) {
    return this.http.post("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {'coordinates':coords},
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

  initMarker(latlon: LatLngTuple, map: L.Map) {
    const marker = L.marker(latlon)
    marker.addTo(map)
  }

}
