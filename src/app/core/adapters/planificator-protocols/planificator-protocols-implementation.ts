import {PlanificatorProtocols} from "../../ports/planificator-protocols/planificator-protocols";
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SetupBundle} from "../../models/setup-bundle.models";
import {firstValueFrom} from "rxjs";
import {environment} from "../../../../environments/environment";
import {Day} from "../../models/day.models";

export class PlanificatorProtocolsImplementation extends PlanificatorProtocols {
  private http = inject(HttpClient)

  async getSetupBundle(): Promise<SetupBundle> {
    return firstValueFrom(this.http.get<SetupBundle>("http://localhost:8080/api/v3.0/planner/Grenis/bundle"))
  }

  async getDay(date:string): Promise<Day> {
    return firstValueFrom(this.http.get<Day>("http://localhost:8080/api/v3.0/planner/day?date="+date))
  }

  async sendDay(day: Day) {
    return firstValueFrom(this.http.post("http://localhost:8080/api/v3.0/planner/day/plan", day))
  }

  async changeDayState(state: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED', dayID: string) {
    return firstValueFrom(this.http.patch("http://localhost:8080/api/v3.0/planner/days/"+dayID+"/updateState?newDayState="+state, null))
  }

  async updateDay(day: Day, dayID: string) {
    return firstValueFrom(this.http.put("http://localhost:8080/api/v3.0/planner/days/"+dayID+"/edit", day))
  }
}
