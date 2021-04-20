import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ShoppingCartItem } from 'src/classes/shopping-cart-item.model';

import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartResolver implements Resolve<ShoppingCartItem[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private shoppingCartService: ShoppingCartService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | ShoppingCartItem[]
    | Observable<ShoppingCartItem[]>
    | Promise<ShoppingCartItem[]> {
    if (this.shoppingCartService.numItems <= 0) {
      return this.dataStorageService.fetchShoppingCart();
    } else {
      return this.shoppingCartService.items;
    }
  }
}
