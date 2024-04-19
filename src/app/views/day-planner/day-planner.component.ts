import {Component, inject, Input, OnInit} from '@angular/core';
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {PlanificatorService} from "../../shared/services/planificator.service";
import {MatRow} from "@angular/material/table";
import {Day} from "../../core/models/day.models";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { MatCardModule} from "@angular/material/card";
import {NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-day-planner',
  standalone: true,
  imports: [
    MatRow,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgClass,
    MatDivider
  ],
  templateUrl: './day-planner.component.html',
  styleUrl: './day-planner.component.css'
})
export class DayPlannerComponent implements OnInit {
  planificatorService = inject(PlanificatorService)
  bundle! : SetupBundle
  setupBundleTest : SetupBundle = {multipleOrders: [{orders: ['C1', 'C2']}, {orders: ['C3']}],
    deliveryMen: ['AWS','ABB','TEL','POL'], trucks: ['XP-098-IO', 'PO-374-BN', 'AE-473-AD']};
  day : Day = {date: this.planificatorService.tomorrowDate!, tours: []}

  constructor() {}

  addTour() {
    if (this.day.tours.length === 0) {
      this.day.tours.push({
        deliveryMen: ['AWS'], truck: '', distanceToCover: 0,
        deliveries: this.setupBundleTest.multipleOrders.map((delivery) => {
          return {orders: delivery.orders, distanceToCover: 0}
        })
      })
    } else {
      this.day.tours.push({deliveryMen: [], truck: '', distanceToCover: 0, deliveries: []})
    }
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
