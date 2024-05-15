import {computed, inject, Injectable, signal} from '@angular/core';
import {
  PlanificatorProtocolsImplementation
} from "../../core/adapters/planificator-protocols/planificator-protocols-implementation";
import {Day} from "../../core/models/day.models";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {concat, map, Observable, range, Subject, tap, timer, zip} from "rxjs";
import {DatePipe} from "@angular/common";
import {DeliveryTour} from "../../core/models/delivery-tour.models";
import {MapService} from "./map.service";
import {IOptimizedBundle} from "../../core/models/optimized-bundle.models";
import {Router} from "@angular/router";

export function maxFrequency<T>(nb: number, ms: number): (input: Observable<T>) => Observable<T> {
  return inputObs => {
    const newToken = new Subject<void>();
    const obsTokens = concat(range(1, nb), newToken )
    return zip(obsTokens, inputObs).pipe(
      tap(() => timer(ms).subscribe( () => newToken.next()) ),
      map( ([_, value]) => value )
    )
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlanificatorService {
  private planificatorProtocols: PlanificatorProtocolsImplementation = new PlanificatorProtocolsImplementation()
  private datePipe = inject(DatePipe)
  private mapService = inject(MapService)
  private router = inject(Router)
  currentDate = (new Date)
  private _sigPlanifiedDay = signal<Day>({date: this.getTomorrowDate(), tours: []})
  sigPlanifiedDay = computed(() => this._sigPlanifiedDay())

  private _sigSetupBundle = signal<SetupBundle>({ multipleOrders: [], deliverymen: [], trucks: [] , coordinates: [0, 0]})
  sigSetupBundle = computed(() => this._sigSetupBundle())

  constructor() {}

  getDayID(date: string): string{
      let currentDate = new Date(date);
      let dateSent = new Date(date.substring(0, 4)+"-01-01");

      const diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
      if (diff.toString().length == 1) {
        return "J00"+(diff + 1)+"G"
      } else if (diff.toString().length == 2) {
        return "J0"+(diff + 1)+"G"
      }
      return "J"+(diff + 1)+"G"
  }

  changeDayStates(date: string) {
      this.planificatorProtocols.changeDayState('PLANNED', this.getDayID(date))
  }

  async getSetupBundle() {
    this.resetValues()
    this._sigSetupBundle.set(await this.planificatorProtocols.getSetupBundle())
  }

  async buildDayAutomatically(toursCount: number) {
    this.planificatorProtocols.getSetupBundle().then((setupBundle) => {
      this._sigSetupBundle.set(setupBundle)
      return this.mapService.test(setupBundle, toursCount)
    }).then((optimizedBundle) => {
      console.log(optimizedBundle)
      this.buildDayFromOptimizedBundle(optimizedBundle, this._sigSetupBundle())})
  }

  buildDayFromOptimizedBundle(bundle: IOptimizedBundle, setupBundle: SetupBundle) {
    const day: Day = {date: this.getTomorrowDate(), tours: bundle.tournees.map((tournee, index) => {
       tournee.splice(0, 1)
       return {deliveries: (tournee.map((delivery) => {return setupBundle.multipleOrders[delivery-1]})), truck: setupBundle.trucks[index],
       deliverymen: [setupBundle.deliverymen[index]], distanceToCover: 0}
      })}
    day.tours.map((tour) => tour.deliveries.map((delivery) => {delivery.distanceToCover = 0}))
    console.log(day)
    this._sigPlanifiedDay.set(day)
    this.router.navigate(['/day-previewer'])
  }

  async getDay(date: string) {
    this.resetValues()
    this._sigPlanifiedDay.set(await this.planificatorProtocols.getDay(date))
  }

  async sendDayOrUpdate(day: Day) {
    this._sigPlanifiedDay().tours.map((tour) => {
      delete tour.coordinates
    })
    await this.sendDay(day).then(() => console.log("Day created"), (error) => {
      if (error.status === 406) {
        this.planificatorProtocols.updateDay(day, this.getDayID(day.date))
      }})
  }

  async sendDay(day: Day) {
    return await this.planificatorProtocols.sendDay(day).then(() => this.resetValues())
  }

  async sendTodayDay(day: Day) {
    this._sigPlanifiedDay().date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')!
    console.log(this._sigPlanifiedDay())
    return await this.sendDayOrUpdate(day)
  }

  getTomorrowDate(): string {
    const dateToReturn = new Date()
    return this.datePipe.transform(dateToReturn.setDate(dateToReturn.getDate() + 1), 'yyyy-MM-dd')!
  }

  resetValues() {
    this._sigPlanifiedDay.set({date: this.getTomorrowDate(), tours: []})
    this._sigSetupBundle.set({ multipleOrders: [], deliverymen: [], trucks: [], coordinates: [0, 0]})
  }

  addTour() {
    const updateArray = this._sigPlanifiedDay().tours
    if (this._sigPlanifiedDay().tours.length === 0) {
      updateArray.push({
        deliverymen: [], truck: '', distanceToCover: 0,
        deliveries: this._sigSetupBundle().multipleOrders.map((delivery) => {
          return { orders: delivery.orders as unknown as string[], address: delivery.address, distanceToCover: 0 }
        })
      })
    } else {
      updateArray.push({ deliverymen: [], truck: '', distanceToCover: 0, deliveries: [] })
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
    this._sigPlanifiedDay().tours[tourIndex].deliverymen.map((deliveryMan) => {
      this._sigSetupBundle().deliverymen.push(deliveryMan)
    })
  }

  removeTruck(tourIndex: number) {
    if (this._sigPlanifiedDay().tours[tourIndex].truck != '') {
      this._sigSetupBundle.update((setupBundle) => {
        return { multipleOrders: setupBundle.multipleOrders, deliverymen: setupBundle.deliverymen, trucks: setupBundle.trucks.concat(this._sigPlanifiedDay().tours[tourIndex].truck), coordinates: setupBundle.coordinates}
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
      trucks, coordinates: this._sigSetupBundle().coordinates
    })
    this.addTruck(index, tourIndex)
  }

  addDeliveryMan(delIndex: number, tourIndex: number) {
    const tours = this._sigPlanifiedDay().tours
    tours[tourIndex].deliverymen.push(this._sigSetupBundle().deliverymen.at(delIndex)!)
    this._sigPlanifiedDay.set({ date: this._sigPlanifiedDay().date, tours })
    this._sigSetupBundle().deliverymen.splice(delIndex, 1)
  }

  removeDeliveryMan(index: number, tourIndex: number) {
    this._sigSetupBundle().deliverymen.push(this._sigPlanifiedDay().tours[tourIndex].deliverymen.at(index)!)
    const tours = this._sigPlanifiedDay().tours
    tours[tourIndex].deliverymen.splice(index, 1)
    this._sigPlanifiedDay.set({ date: this._sigPlanifiedDay().date, tours })
  }

  setSigDay(day : Day){
    this._sigPlanifiedDay.set(day);
  }
  setSigSB(setup : SetupBundle){
    this._sigSetupBundle.set(setup);
  }
  updSig(setup : SetupBundle){
    this._sigSetupBundle.update(() => setup);
  }

  getSigDay(){
    return this._sigPlanifiedDay();
  }
}
