import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class EmptyShoppingCartGuard implements CanActivate {
  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.shoppingCartService.numItems <= 0) {
        return this.router.createUrlTree(['/catalog']);
      }

      return true;
  }

}
