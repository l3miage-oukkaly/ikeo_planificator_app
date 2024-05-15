import { Routes } from '@angular/router';
import {authGuardActivate, authGuardAlreadyLoggedIn, authGuardRedirect} from "./shared/services/auth.guard";

export const routes: Routes = [
  {path:'', loadComponent: () => import('./views/homepage/homepage.component').then(m => m.HomepageComponent), canActivate: [authGuardRedirect]},
  {path:'auth', loadComponent: () => import('./views/auth/auth.component').then(m => m.AuthComponent), canActivate: [authGuardAlreadyLoggedIn]},
  {path:'main-menu', loadComponent: () => import('./views/main-menu/main-menu.component').then(m => m.MainMenuComponent), canActivate: [authGuardActivate]},
  {path:'day-planner', loadComponent: () => import('./views/day-planner/day-planner.component').then(m => m.DayPlannerComponent), canActivate: [authGuardActivate]},
  {path:'day-displayer', loadComponent: () => import('./views/day-displayer/day-displayer.component').then(m => m.DayDisplayerComponent), canActivate: [authGuardActivate]},
  {path:'day-previewer', loadComponent: () => import('./views/day-preview/day-preview.component').then(m => m.DayPreviewComponent), canActivate: [authGuardActivate]}
];
