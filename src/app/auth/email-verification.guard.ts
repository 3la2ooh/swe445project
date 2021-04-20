import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.fireAuth.user.pipe(
      take(1),
      map((user) => {
        const isAuth = user ? true : false;
        if (isAuth) {
          if (!user.emailVerified) {
            this.authService.user = user;
            return true;
          } else {
            return this.router.createUrlTree(['/catalog']);
          }
        }

        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
