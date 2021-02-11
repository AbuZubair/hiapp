import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { AuthService } from "../auth/auth.service";
import { SharedService } from "../shared.service";
import { Storage } from '@ionic/storage';
import { NavController, Platform  } from '@ionic/angular';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public authenticationService: AuthService, private sharedService: SharedService,public storage: Storage, private router: Router,
    private navController: NavController, private platform: Platform) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authenticationService.authenticationState.pipe(
      take(1),
      map((isLoggedIn: any) => {
        if (!isLoggedIn) {
          if(state.url=='/login' || state.url.includes("/login/otp")){
            return true
          }
          return false;
        }
        
        if(state.url=='/login' || state.url.includes("/login/otp")){
          return false;
        }

        return true;
        

      })
    );
  }

}
