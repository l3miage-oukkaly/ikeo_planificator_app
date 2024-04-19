import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {MatRow} from "@angular/material/table";
import {Day} from "../../core/models/day.models";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { MatCardModule} from "@angular/material/card";
import {NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import {DeliveryTour} from "../../core/models/delivery-tour.models";
import {
  CdkDrag,
  CdkDragDrop, CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {Delivery} from "../../core/models/delivery.models";
import {
  AccordionDeliverymenComponent
} from "../../shared/components/accordion-deliverymen/accordion-deliverymen.component";
import {AccordionTruckComponent} from "../../shared/components/accordion-truck/accordion-truck.component";

@Component({
  selector: 'app-day-planner',
  standalone: true,
  imports: [
    MatRow,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgClass,
    MatDivider,
    CdkAccordionModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    AccordionDeliverymenComponent,
    AccordionTruckComponent
  ],
  templateUrl: './day-planner.component.html',
  styleUrl: './day-planner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPlannerComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  setupBundleTest : SetupBundle = {multipleOrders: [{orders: ['C1', 'C2']}, {orders: ['C3']}],
    deliveryMen: ['AWS','ABB','TEL','POL'], trucks: ['XP-098-IO', 'PO-374-BN', 'AE-473-AD']};
  BundleSig = signal<SetupBundle>(this.setupBundleTest)
  DaySig = signal<Day>({date: this.planificatorService.getTomorrowDate(), tours: []})

  constructor() {}

  addTour() {
    if (this.DaySig().tours.length === 0) {
      this.DaySig().tours.push({
        deliveryMen: [], truck: '', distanceToCover: 0,
        deliveries: this.setupBundleTest.multipleOrders.map((delivery) => {
          return {orders: delivery.orders, distanceToCover: 0}
        })
      })
    } else {
      this.DaySig().tours.push({deliveryMen: [], truck: '', distanceToCover: 0, deliveries: []})
    }
    this.DaySig.set(this.DaySig())
  }

  // Must remove truck, deliveryMen and move all deliveries to the first tour
  // If was first tour, just remove truck & deliveryMen
  removeTour(tourIndex: number) {
    this.removeAllDeliveryMen(tourIndex)
    this.removeTruck(tourIndex)
    if (this.DaySig().tours.length === 1) {
      this.DaySig.set({date: this.DaySig().date, tours: []})
    } else if (tourIndex != 0) {
      this.DaySig().tours[tourIndex].deliveries.map((delivery) => this.DaySig().tours[0].deliveries.push(delivery))
      const tours = this.DaySig().tours.filter((tour, index) => index != tourIndex)
      this.DaySig.set({date: this.DaySig().date, tours})
    } else {
      this.DaySig().tours[tourIndex].deliveries.map((delivery) => this.DaySig().tours[1].deliveries.push(delivery))
      const tours = this.DaySig().tours.filter((tour, index) => index != tourIndex)
      this.DaySig.set({date: this.DaySig().date, tours})
    }
  }

  removeDeliveryMan(delIndex:number, tourIndex: number) {
    this.BundleSig().deliveryMen.push(this.DaySig().tours[tourIndex].deliveryMen.at(delIndex)!)
    const delMen = this.DaySig().tours[tourIndex].deliveryMen.splice(delIndex, 1)
    this.DaySig.set({date:this.DaySig().date, tours: this.DaySig().tours.map((tour, index) => {
        if (index === tourIndex) {
          tour.deliveryMen = delMen
        }
        return tour
      })})
  }

  removeAllDeliveryMen(tourIndex: number) {
    this.DaySig().tours[tourIndex].deliveryMen.map((deliveryMan , index) => {
      this.removeDeliveryMan(index, tourIndex)
    })
  }

  removeTruck(tourIndex: number) {
    if (this.DaySig().tours[tourIndex].truck != '') {
      this.BundleSig().trucks.push(this.DaySig().tours[tourIndex].truck)
      this.DaySig.set({date:this.DaySig().date, tours: this.DaySig().tours.map((tour, index) => {
          if (index === tourIndex) {
            tour.truck = ''
          }
          return tour
        })})
    }
  }

  moveDelivery(event : CdkDragDrop<Delivery[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  isValidTour(tour: DeliveryTour): boolean {
    return (tour.deliveries.length != 0 && tour.truck != '' && tour.deliveryMen.length != 0)
  }

  isValidDay() {
    if (this.DaySig().tours.length === 0) {
      return true
    }
    return this.DaySig().tours.map((tour) => this.isValidTour(tour)).filter((bool) =>  !bool).length != 0
  }

  ngOnInit() {
  }

  // GETs the SetupBundle from the server
  // Will be used when endpoints will be implemented
  async planDayPlusOne() {
    this.BundleSig.set(await this.planificatorService.getSetupBundle())
  }

  sendDay_Dev(date: string, day: Day) {
    console.log(day)
  }
}
