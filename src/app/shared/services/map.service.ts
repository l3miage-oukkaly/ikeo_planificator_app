import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {Delivery} from "../../core/models/delivery.models";
import {LatLngTuple} from "leaflet";
import {first, firstValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {IOptimizedBundle} from "../../core/models/optimized-bundle.models";

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


  // From a setup bundle that contains an array of Deliveries, convert all addresses to coordinates.
  // Pass the coordinates to the OpenRoute API to request the matrix of distances.
  // Pass the distance matrix obtained to the RO API to optimize the tours
  // Request routes for each tour to the OpenRoute API
  // Initialize the routes & markers layer on the map.
  // Return the optimized bundle.
  async test(deliveries: Delivery[], toursCount: number) {
    return Promise.all(deliveries.map(async (delivery) => await this.addressToCoords(delivery))).then((coords) => {
      this._sigCoords.update(() => coords)
      console.log(this.sigCoords())
    }).then(() => firstValueFrom(this.requestMatrix(this.sigCoords())) .then((matrix: any) => {
       return this.optimizeRoutes(matrix.distances, toursCount)
    }))
  }

  async optimizeRoutes(distancesMatrix: number[][], toursCount: number) {
    const body = {
      distancesMatrix: distancesMatrix,
      toursCount,
      warehouseIndexInDistancesMatrix: 0
    };
    return await firstValueFrom(this.http.post(environment.roUrl, body)) as unknown as IOptimizedBundle
  }

  async addressToCoords(delivery: Delivery) {
    return await firstValueFrom(this.http.get("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1")).then((res:any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[1]
        const lon = c.geometry.coordinates[0]
        delivery.coordinates = [lat, lon]
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

  initMarker(map: L.Map, delivery: Delivery) {
    const marker = L.marker(delivery.coordinates!)
    marker.bindPopup(this.makePopup(delivery))
    marker.addTo(map)
  }

  initAllMarkers(map: L.Map, deliveries: Delivery[]) {
    deliveries.map((delivery) => this.initMarker(map, delivery))
  }

  makePopup(delivery: Delivery): string {
    return ``+
      `<div><u>Adresse:</u> ${ delivery.address }</div>`
  }

}
