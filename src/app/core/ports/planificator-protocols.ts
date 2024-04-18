import {SetupBundle} from "../models/setup-bundle.models";
import {Day} from "../models/day.models";

export abstract class PlanificatorProtocols {

  abstract getSetupBundle(): Promise<SetupBundle>;

  abstract getDay(day: string): Promise<Day>

  // Return type needs to be readjusted
  abstract sendDay(day: string): any;
}
