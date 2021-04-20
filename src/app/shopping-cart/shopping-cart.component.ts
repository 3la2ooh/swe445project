import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartItem } from '../../classes/shopping-cart-item.model';
import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  shoppingCartItems: ShoppingCartItem[] = [];
  subtotal = 0;
  readonly shippingCost = 15;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.shoppingCartService.shoppingCartChanged.subscribe((items) => {
        this.shoppingCartItems = items;
        this.subtotal = this.shoppingCartService.totalPrice;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async onChangeQuantity(event: any, index: number): Promise<void> {
    const newQuantity = event.target.value;

    const deletedItem = this.shoppingCartItems[index];
    try {
      if (newQuantity <= 0) {
        this.shoppingCartService.deleteItem(index);

        await this.dataStorageService.saveShoppingCart();
        return;
      }
    } catch (error) {
      this.shoppingCartService.addItemAtIndex(deletedItem, index);
    }

    const oldQuantity = this.shoppingCartItems[index].quantity;
    try {
      this.shoppingCartService.setQuantity(
        this.shoppingCartItems[index].id,
        newQuantity
      );

      await this.dataStorageService.saveShoppingCart();
    } catch (error) {
      this.shoppingCartService.setQuantity(
        this.shoppingCartItems[index].id,
        oldQuantity
      );
    }
  }

  onCheckout(): Promise<boolean> {
    if (this.shoppingCartItems.length <= 0) {
      return;
    }

    return this.router.navigate(['/pay']);
  }
}
