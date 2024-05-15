import {PlanificatorProtocols} from "../../ports/planificator-protocols/planificator-protocols";
import {inject} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SetupBundle} from "../../models/setup-bundle.models";
import {firstValueFrom} from "rxjs";
import {Day} from "../../models/day.models";
import {AuthService} from "../../../shared/services/auth.service";

export class PlanificatorProtocolsImplementation extends PlanificatorProtocols {
  private http = inject(HttpClient)
  private authService = inject(AuthService)

  async getSetupBundle(): Promise<SetupBundle> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + await this.authService.getToken()
    })
    return firstValueFrom(this.http.get<SetupBundle>("http://localhost:8080/api/v3.0/planner/Grenis/bundle", {headers}))
  }

  async getDay(date:string): Promise<Day> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + await this.authService.getToken()
    })
    return firstValueFrom(this.http.get<Day>("http://localhost:8080/api/v3.0/planner/day?date="+date, {headers}))
  }

  async sendDay(day: Day) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + await this.authService.getToken()
    })
    return firstValueFrom(this.http.post("http://localhost:8080/api/v3.0/planner/day/plan", day, {headers}))
  }

  async changeDayState(state: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED', dayID: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + await this.authService.getToken()
    })
    return firstValueFrom(this.http.patch("http://localhost:8080/api/v3.0/planner/days/"+dayID+"/updateState?newDayState="+state, null,
      {headers}))
  }

  async updateDay(day: Day, dayID: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + await this.authService.getToken()
    })
    return firstValueFrom(this.http.put("http://localhost:8080/api/v3.0/planner/days/"+dayID+"/edit", day, {headers}))
  }
}
