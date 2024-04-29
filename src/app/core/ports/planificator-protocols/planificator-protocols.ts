import {SetupBundle} from "../../models/setup-bundle.models";
import {Day} from "../../models/day.models";

export abstract class PlanificatorProtocols {

  abstract getSetupBundle(): Promise<SetupBundle>;

  abstract getDay(date: string): Promise<Day>

  // Return type needs to be readjusted
  abstract sendDay(date: string, day: Day): any;
}
