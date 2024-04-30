import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {
  PlanificatorProtocolsImplementation
} from "../../core/adapters/planificator-protocols/planificator-protocols-implementation";
import {Day} from "../../core/models/day.models";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {Subject} from "rxjs";
import {DatePipe} from "@angular/common";
import {DeliveryTour} from "../../core/models/delivery-tour.models";

@Injectable({
  providedIn: 'root'
})
export class PlanificatorService {
  private planificatorProtocols: PlanificatorProtocolsImplementation = new PlanificatorProtocolsImplementation()
  private datePipe = inject(DatePipe)
  currentDate = (new Date)
  private _daySig = signal<Day>({date: this.getTomorrowDate(), tours: []})
  daySig = computed(() => this._daySig())

  private _bundleSig = signal<SetupBundle>({ multipleOrders: [], deliverymen: [], trucks: [] })
  bundleSig = computed(() => this._bundleSig())

  constructor() {}

  async getSetupBundle() {
    // Reset enlevable lorsqu'il y aura cohérence entre les données demandées & reçues
    this.resetValues()
    this._bundleSig.set(await this.planificatorProtocols.getSetupBundle())
  }

  async getDay(date: string) {
    this._daySig.set(await this.planificatorProtocols.getDay(date))
  }

  async sendDay(date: string, day: Day) {
    return await this.planificatorProtocols.sendDay(date, day).then(() => this.resetValues())
  }

  getTomorrowDate(): string {
    return this.datePipe.transform(this.currentDate.setDate(this.currentDate.getDate() + 1), 'yyyy-MM-dd')!
  }

  resetValues() {
    this._daySig.set({date: this.getTomorrowDate(), tours: []})
    this._bundleSig.set({ multipleOrders: [], deliverymen: [], trucks: [] })
  }

  addTour() {
    const updateArray = this._daySig().tours
    if (this._daySig().tours.length === 0) {
      updateArray.push({
        deliveryMen: [], truck: '', distanceToCover: 0,
        deliveries: this._bundleSig().multipleOrders.map((delivery) => {
          return { orders: delivery as unknown as string[], distanceToCover: 0 }
        })
      })
    } else {
      updateArray.push({ deliveryMen: [], truck: '', distanceToCover: 0, deliveries: [] })
    }
    this._daySig.update((day) => {return {date: day.date, tours: updateArray}})
  }

  removeTour(tourIndex: number) {
    this.removeAllDeliveryMen(tourIndex)
    this.removeTruck(tourIndex)
    let tours : DeliveryTour[] = []
    if (this._daySig().tours.length != 1) {
      if (tourIndex != 0) {
      this._daySig().tours[tourIndex].deliveries.map((delivery) => this._daySig().tours[0].deliveries.push(delivery))
      } else {
      this._daySig().tours[tourIndex].deliveries.map((delivery) => this._daySig().tours[1].deliveries.push(delivery))
      }
      tours = this._daySig().tours.filter((tour, index) => index != tourIndex)
    }
    this._daySig.set({ date: this._daySig().date, tours })
  }

  removeAllDeliveryMen(tourIndex: number) {
    this._daySig().tours[tourIndex].deliveryMen.map((deliveryMan) => {
      this._bundleSig().deliverymen.push(deliveryMan)
    })
  }

  removeTruck(tourIndex: number) {
    if (this._daySig().tours[tourIndex].truck != '') {
      this._bundleSig().trucks.push(this._daySig().tours[tourIndex].truck)
    }
  }

  addTruck(truckIndex: number, tourIndex: number) {
    this._daySig.set({
      date: this._daySig().date, tours: this._daySig().tours.map((tour, index) => {
        if (index === tourIndex) {
          tour.truck = this._bundleSig().trucks.at(truckIndex)!
        }
        return tour
      })
    })
    this._bundleSig().trucks.splice(truckIndex, 1)
  }

  replaceTruck(index: number, tourIndex: number) {
    const trucks = this._bundleSig().trucks
    trucks.push(this._daySig().tours[tourIndex].truck)
    this._bundleSig.set({
      multipleOrders: this._bundleSig().multipleOrders, deliverymen: this._bundleSig().deliverymen,
      trucks
    })
    this.addTruck(index, tourIndex)
  }

  addDeliveryMan(delIndex: number, tourIndex: number) {
    const tours = this._daySig().tours
    tours[tourIndex].deliveryMen.push(this._bundleSig().deliverymen.at(delIndex)!)
    this._daySig.set({ date: this._daySig().date, tours })
    this._bundleSig().deliverymen.splice(delIndex, 1)
  }

  removeDeliveryMan(index: number, tourIndex: number) {
    this._bundleSig().deliverymen.push(this._daySig().tours[tourIndex].deliveryMen.at(index)!)
    const tours = this._daySig().tours
    tours[tourIndex].deliveryMen.splice(index, 1)
    this._daySig.set({ date: this._daySig().date, tours })
  }
}
