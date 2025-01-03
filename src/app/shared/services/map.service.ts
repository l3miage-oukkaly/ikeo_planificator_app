import {computed, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {Delivery} from "../../core/models/delivery.models";
import {LatLngTuple} from "leaflet";
import {
  firstValueFrom,
  from,
  Observable
} from "rxjs";
import {environment} from "../../../environments/environment";
import {IOptimizedBundle} from "../../core/models/optimized-bundle.models";
import {maxFrequency} from "./planificator.service";
import {SetupBundle} from "../../core/models/setup-bundle.models";

export const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Injectable({
  providedIn: 'root'
})
export class MapService {
  routes!: any;
  private _sigCoords = signal<LatLngTuple[]>([]);
  sigCoords = computed<LatLngTuple[]>(() => this._sigCoords());

  constructor(private http: HttpClient) { }

  // From a setup bundle that contains an array of Deliveries, convert all addresses to coordinates.
  // Pass the coordinates to the OpenRoute API to request the matrix of distances.
  // Pass the distance matrix obtained to the RO API to optimize the tours
  // Request routes for each tour to the OpenRoute API
  // Initialize the routes & markers layer on the map.
  // Return the optimized bundle.
  async test(setupBundle: SetupBundle, toursCount: number) {
    this._sigCoords.set([[setupBundle.coordinates[1], setupBundle.coordinates[0]]])
    return Promise.all(setupBundle.multipleOrders.map(async (delivery) => await this.addressToCoords(delivery))).then((coords) => {
      this._sigCoords.update((coordinates) => [...coordinates, ...coords])
      console.log(this.sigCoords())
    }).then(() => firstValueFrom(this.requestMatrix(this.sigCoords())).then((matrix: any) => {
       return this.optimizeRoutes(matrix.distances, toursCount)
    }))
  }

  async testTemp(deliveries: Delivery[], toursCount: number) {
    return Promise.all(deliveries.map(async (delivery) => await this.addressToCoords(delivery))).then((coords) => {
      this._sigCoords.set(coords)
      console.log(this.sigCoords())
    })
  }

  testAddressToCoords(delivery: Delivery) {
    return this.http.get("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1")
  }

  async testTest(toursCount: number) {
    return await firstValueFrom(this.requestMatrix(this.sigCoords())).then((matrix: any) => {
      return this.optimizeRoutes(matrix.distances, toursCount)
    })
  }

  testAllAdressesToCoords(deliveries: Delivery[], toursCount: number) {
    const obs = (maxFrequency(2, 1000)(from(deliveries))) as Observable<Delivery[]>
    obs.subscribe((delivery) => {
      this.testAddressToCoords(delivery as unknown as Delivery).subscribe({next: (res:any) => {
          for (const c of res.features) {
            const del = delivery as unknown as Delivery
            const lat = c.geometry.coordinates[1]
            const lon = c.geometry.coordinates[0]
            del.coordinates = [lat, lon]
            this._sigCoords.update((coords) => [...coords, [lon, lat]] as LatLngTuple[])
            deliveries.splice(0, 1)
            if (deliveries.length === 0) {
              this.testTest(toursCount).then((optimizedBundle) => {console.log(optimizedBundle)})
            }
          }
        }})
    })
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

  getTourCoords(tour: Delivery[], warehouseCoords: LatLngTuple) {
    return [[warehouseCoords[1], warehouseCoords[0]], ...tour.map((delivery) => [delivery.coordinates![1], delivery.coordinates![0]])] as LatLngTuple[]
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

  initWarehouseMarker(map: L.Map, warehouseCoords: LatLngTuple) {
    const marker = L.marker(warehouseCoords, {icon: greenIcon})
    marker.bindPopup(this.makeWarehousePopup())
    marker.addTo(map)
  }

  makeWarehousePopup(): string {
    return ``+
      `<h4 style="text-align: center;">Entrepôt Grenis</h4>`
  }

  initAllMarkers(map: L.Map, deliveries: Delivery[], warehouseCoords: LatLngTuple) {
    this.initWarehouseMarker(map, warehouseCoords)
    deliveries.map((delivery) => this.initMarker(map, delivery))
  }

  makePopup(delivery: Delivery): string {
    return ``+
      `<div><u>Adresse:</u> ${ delivery.address }</div>`
  }

}
