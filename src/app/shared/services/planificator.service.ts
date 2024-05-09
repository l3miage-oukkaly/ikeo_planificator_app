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
  private _sigPlanifiedDay = signal<Day>({date: this.getTomorrowDate(), tours: []})
  sigPlanifiedDay = computed(() => this._sigPlanifiedDay())

  private _sigSetupBundle = signal<SetupBundle>({ multipleOrders: [], deliverymen: [], trucks: [] })
  sigSetupBundle = computed(() => this._sigSetupBundle())

  constructor() {}

  async getSetupBundle() {
    // Reset enlevable lorsqu'il y aura cohérence entre les données demandées & reçues
    this.resetValues()
    this._sigSetupBundle.set(await this.planificatorProtocols.getSetupBundle())
  }

  async getDay(date: string) {
    this._sigPlanifiedDay.set(await this.planificatorProtocols.getDay(date))
  }

  async sendDay(date: string, day: Day) {
    return await this.planificatorProtocols.sendDay(day).then(() => this.resetValues())
  }

  getTomorrowDate(): string {
    const dateToReturn = new Date()
    return this.datePipe.transform(dateToReturn.setDate(dateToReturn.getDate() + 1), 'yyyy-MM-dd')!
  }

  resetValues() {
    this._sigPlanifiedDay.set({date: this.getTomorrowDate(), tours: []})
    this._sigSetupBundle.set({ multipleOrders: [], deliverymen: [], trucks: [] })
  }

  addTour() {
    const updateArray = this._sigPlanifiedDay().tours
    if (this._sigPlanifiedDay().tours.length === 0) {
      updateArray.push({
        deliveryMen: [], truck: '', distanceToCover: 0,
        deliveries: this._sigSetupBundle().multipleOrders.map((delivery) => {
          return { orders: delivery.orders as unknown as string[], address: delivery.address, distanceToCover: 0 }
        })
      })
    } else {
      updateArray.push({ deliveryMen: [], truck: '', distanceToCover: 0, deliveries: [] })
    }
    this._sigPlanifiedDay.update((day) => {return {date: day.date, tours: updateArray}})
  }

  removeTour(tourIndex: number) {
    this.removeAllDeliveryMen(tourIndex)
    this.removeTruck(tourIndex)
    let tours : DeliveryTour[] = []
    if (this._sigPlanifiedDay().tours.length != 1) {
      if (tourIndex != 0) {
      this._sigPlanifiedDay().tours[tourIndex].deliveries.map((delivery) => this._sigPlanifiedDay().tours[0].deliveries.push(delivery))
      } else {
      this._sigPlanifiedDay().tours[tourIndex].deliveries.map((delivery) => this._sigPlanifiedDay().tours[1].deliveries.push(delivery))
      }
      tours = this._sigPlanifiedDay().tours.filter((tour, index) => index != tourIndex)
    }
    this._sigPlanifiedDay.set({ date: this._sigPlanifiedDay().date, tours })
  }

  removeAllDeliveryMen(tourIndex: number) {
    this._sigPlanifiedDay().tours[tourIndex].deliveryMen.map((deliveryMan) => {
      this._sigSetupBundle().deliverymen.push(deliveryMan)
    })
  }

  removeTruck(tourIndex: number) {
    if (this._sigPlanifiedDay().tours[tourIndex].truck != '') {
      this._sigSetupBundle.update((setupBundle) => {
        return { multipleOrders: setupBundle.multipleOrders, deliverymen: setupBundle.deliverymen, trucks: setupBundle.trucks.concat(this._sigPlanifiedDay().tours[tourIndex].truck) }
      })
      this._sigPlanifiedDay.update((day) => {return {date: day.date, tours: day.tours.map((tour, index) => {
          if (index === tourIndex) {
            tour.truck = ''
          }
          return tour
        })
      }})
    }
  }

  addTruck(truckIndex: number, tourIndex: number) {
    this._sigPlanifiedDay.set({
      date: this._sigPlanifiedDay().date, tours: this._sigPlanifiedDay().tours.map((tour, index) => {
        if (index === tourIndex) {
          tour.truck = this._sigSetupBundle().trucks.at(truckIndex)!
        }
        return tour
      })
    })
    this._sigSetupBundle().trucks.splice(truckIndex, 1)
  }

  replaceTruck(index: number, tourIndex: number) {
    const trucks = this._sigSetupBundle().trucks
    trucks.push(this._sigPlanifiedDay().tours[tourIndex].truck)
    this._sigSetupBundle.set({
      multipleOrders: this._sigSetupBundle().multipleOrders, deliverymen: this._sigSetupBundle().deliverymen,
      trucks
    })
    this.addTruck(index, tourIndex)
  }

  addDeliveryMan(delIndex: number, tourIndex: number) {
    const tours = this._sigPlanifiedDay().tours
    tours[tourIndex].deliveryMen.push(this._sigSetupBundle().deliverymen.at(delIndex)!)
    this._sigPlanifiedDay.set({ date: this._sigPlanifiedDay().date, tours })
    this._sigSetupBundle().deliverymen.splice(delIndex, 1)
  }

  removeDeliveryMan(index: number, tourIndex: number) {
    this._sigSetupBundle().deliverymen.push(this._sigPlanifiedDay().tours[tourIndex].deliveryMen.at(index)!)
    const tours = this._sigPlanifiedDay().tours
    tours[tourIndex].deliveryMen.splice(index, 1)
    this._sigPlanifiedDay.set({ date: this._sigPlanifiedDay().date, tours })
  }
}
