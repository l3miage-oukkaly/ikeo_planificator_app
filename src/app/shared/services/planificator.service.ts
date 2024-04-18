import {inject, Injectable, signal} from '@angular/core';
import {
  PlanificatorProtocolsImplementation
} from "../../core/adapters/planificator-protocols/planificator-protocols-implementation";
import {Day} from "../../core/models/day.models";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {Subject} from "rxjs";
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class PlanificatorService {
  private planificatorProtocols: PlanificatorProtocolsImplementation = new PlanificatorProtocolsImplementation()
  private datePipe = inject(DatePipe)
  currentDate = (new Date)
  tomorrowDate = this.datePipe.transform(this.currentDate.setDate(this.currentDate.getDate() + 1), 'yyyy-MM-dd')

  constructor() {}

  async getSetupBundle() {
    return await this.planificatorProtocols.getSetupBundle()
  }

  async getDay(date: string) {
    return await this.planificatorProtocols.getDay(date)
  }

  async sendDay(date: string, day: Day) {
    return await this.planificatorProtocols.sendDay(date, day)
  }
}
