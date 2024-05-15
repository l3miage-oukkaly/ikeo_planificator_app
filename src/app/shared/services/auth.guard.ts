import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {PlanificatorService} from "./planificator.service";

export const authGuardActivate: CanActivateFn = (route, state) => {
  const authServ = inject(AuthService);
  const planificatorService = inject(PlanificatorService)
  const router = inject(Router);
  if (authServ.sigObsUser() === null) {
    router.navigate(['/'])
    return false
  } else if (router.url === '/auth') {
    return planificatorService.getDay(planificatorService.getTomorrowDate()).then(() => {
      console.log("Ok")
      return true
    }, async (error) => {
      if (error.status === 403) {
        console.log(error)
        console.log("ntm")
        await authServ.logout();
        return false;
      } else {
        console.log(error)
        return true
      }
    })
  } else {
    return true
  }
};

export const authGuardAlreadyLoggedIn: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authServ = inject(AuthService)
  if (authServ.sigObsUser() != null) {
    router.navigate(['/main-menu'])
    return false
  } else {
    return true
  }
}

export const authGuardRedirect: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authServ = inject(AuthService)
  return true
}
