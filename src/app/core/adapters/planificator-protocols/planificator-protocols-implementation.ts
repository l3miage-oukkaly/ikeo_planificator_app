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
    return firstValueFrom(this.http.get<SetupBundle>(environment.localhostUrl+environment.getSetupBundleUrl));
  }

  async getDay(date:string): Promise<Day> {
    return firstValueFrom(this.http.get<Day>(environment.localhostUrl+environment.getDayUrl+"?date="+date))
  }

  async sendDay(date: string, day: Day) {
    return firstValueFrom(this.http.post(environment.localhostUrl+environment.postDayUrl+"?date="+date, day))
  }
}
