import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
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
    CdkAccordionModule
  ],
  templateUrl: './day-planner.component.html',
  styleUrl: './day-planner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPlannerComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  bundle! : SetupBundle
  setupBundleTest : SetupBundle = {multipleOrders: [{orders: ['C1', 'C2']}, {orders: ['C3']}],
    deliveryMen: ['AWS','ABB','TEL','POL'], trucks: ['XP-098-IO', 'PO-374-BN', 'AE-473-AD']};
  day : Day = {date: this.planificatorService.getTomorrowDate(), tours: []}

  constructor() {}

  addTour() {
    if (this.day.tours.length === 0) {
      this.day.tours.push({
        deliveryMen: [], truck: '', distanceToCover: 0,
        deliveries: this.setupBundleTest.multipleOrders.map((delivery) => {
          return {orders: delivery.orders, distanceToCover: 0}
        })
      })
    } else {
      this.day.tours.push({deliveryMen: [], truck: '', distanceToCover: 0, deliveries: []})
    }
  }

  addDeliveryMan(index: number, tour: DeliveryTour) {
    tour.deliveryMen.push(this.setupBundleTest.deliveryMen.at(index)!)
    this.setupBundleTest.deliveryMen.splice(index, 1)
  }

  removeDeliveryMan(index:number, tour: DeliveryTour) {
    this.setupBundleTest.deliveryMen.push(tour.deliveryMen.at(index)!)
    tour.deliveryMen.splice(index, 1)
  }

  addTruck(index: number, tour: DeliveryTour) {
    tour.truck = this.setupBundleTest.trucks.at(index)!
    this.setupBundleTest.trucks.splice(index, 1)
  }

  removeTruck(tour: DeliveryTour) {
    this.setupBundleTest.trucks.push(tour.truck)
    tour.truck = ''
  }

  replaceTruck(index: number, tour: DeliveryTour) {
    this.setupBundleTest.trucks.push(tour.truck)
    this.addTruck(index, tour)
  }

  ngOnInit() {
    this.planDayPlusOne_Dev()
  }

  // GETs the SetupBundle from the server
  // Will be used when endpoints will be implemented
  async planDayPlusOne() {
    this.bundle = await this.planificatorService.getSetupBundle()
  }

  planDayPlusOne_Dev() {
    this.bundle = this.setupBundleTest
  }
}
