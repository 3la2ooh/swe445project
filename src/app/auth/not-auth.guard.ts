import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotAuthGuard implements CanActivate {
  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.fireAuth.user.pipe(
      take(1),
      map((user) => {
        const isAuth = user ? true : false;
        if (!isAuth) {
          this.authService.userId = null;
          return true;
        }

        this.authService.userId = user.uid;
        return this.router.createUrlTree(['/catalog']);
      })
    );
  }
}
