import { Injectable } from '@angular/core';
import {
  PlanificatorProtocolsImplementation
} from "../../core/adapters/planificator-protocols/planificator-protocols-implementation";
import {Day} from "../../core/models/day.models";

@Injectable({
  providedIn: 'root'
})
export class PlanificatorService {
  private planificatorProtocols: PlanificatorProtocolsImplementation = new PlanificatorProtocolsImplementation()

  constructor() { }

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
