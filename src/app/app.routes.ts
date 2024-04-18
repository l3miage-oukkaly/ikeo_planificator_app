import { Routes } from '@angular/router';
import {HomepageComponent} from "./views/homepage/homepage.component";
import {DayDisplayerComponent} from "./views/day-displayer/day-displayer.component";
import {DayPlannerComponent} from "./views/day-planner/day-planner.component";

export const routes: Routes = [
  {path:'', component: HomepageComponent},
  {path:'day-planner', component:DayPlannerComponent},
  {path:'day-displayer', component:DayDisplayerComponent}
];
