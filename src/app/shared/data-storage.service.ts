import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { CatalogItem } from '../../classes/catalog-item.model';
import { ShoppingCartItem } from '../../classes/shopping-cart-item.model';
import { AuthService } from '../auth/auth.service';

import { CatalogService } from '../catalog/catalog.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  isLoading = new Subject<boolean>();

  constructor(
    private fireDatabase: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService,
    private catalogService: CatalogService,
    private authService: AuthService
  ) {}

  async saveShoppingCart(): Promise<void> {
    const products = this.shoppingCartService.items;
    const userId = this.authService.userId;

    this.isLoading.next(true);
    return await this.fireDatabase.database
      .ref(userId + '/shopping-cart')
      .set(products, (responseData) => {
        this.isLoading.next(false);
        if (responseData instanceof Error) {
          return throwError(responseData.message);
        }
      })
      .catch((errorResponse) => {
        // Send to Analytics
        return throwError(errorResponse);
      });
  }

  async fetchShoppingCart(): Promise<ShoppingCartItem[]> {
    const userId = this.authService.userId;

    this.isLoading.next(true);
    return await this.fireDatabase.database
      .ref(userId + '/shopping-cart')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.isLoading.next(false);

          this.shoppingCartService.updateShoppingCart(snapshot.val());
          return snapshot.val();
        } else {
          this.isLoading.next(false);
          this.shoppingCartService.updateShoppingCart([]);
          return [];
        }
      })
      .catch((errorResponse) => {
        // Send to Analytics
        console.log('ERROR');

        return throwError(errorResponse);
      });
  }

  async fetchCatalogProducts(): Promise<CatalogItem[]> {
    this.isLoading.next(true);
    return await this.fireDatabase.database
      .ref('catalog')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.isLoading.next(false);
          this.catalogService.updateCatalogItems(snapshot.val());
          return snapshot.val();
        } else {
          this.isLoading.next(false);
          this.catalogService.updateCatalogItems([]);
          return [];
        }
      })
      .catch((errorResponse) => {
        // Send to Analytics
        return throwError(errorResponse);
      });
  }

  async fetchCatalogItem(productId: string): Promise<CatalogItem> {
    this.isLoading.next(true);
    return await this.fireDatabase.database
      .ref('catalog/' + productId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.isLoading.next(false);
          return snapshot.val();
        } else {
          this.isLoading.next(false);
          return null;
        }
      })
      .catch((errorResponse) => {
        // Send to Analytics
        return throwError(errorResponse);
      });
  }
}
