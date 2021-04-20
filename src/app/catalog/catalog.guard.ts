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
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogGuard implements CanActivate {
  constructor(
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private dataStorageService: DataStorageService,
    private router: Router
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
        if (user) {
          if (!user.emailVerified) {
            return this.router.createUrlTree(['/verify-email']);
          } else {
            if (this.shoppingCartService.numItems <= 0) {
              this.authService.userId = user.uid;
              this.dataStorageService.fetchShoppingCart();
            }
          }
        }

        return true;
      })
    );
  }
}
