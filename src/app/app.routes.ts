import { Routes } from '@angular/router';
import {HomepageComponent} from "./views/homepage/homepage.component";
import {DayDisplayerComponent} from "./views/day-displayer/day-displayer.component";
import {DayPlannerComponent} from "./views/day-planner/day-planner.component";

export const routes: Routes = [
  {path:'', loadComponent: () => import('./views/homepage/homepage.component').then(m => m.HomepageComponent)},
  {path:'day-planner', loadComponent: () => import('./views/day-planner/day-planner.component').then(m => m.DayPlannerComponent)},
  {path:'day-displayer', loadComponent: () => import('./views/day-displayer/day-displayer.component').then(m => m.DayDisplayerComponent)}
];
