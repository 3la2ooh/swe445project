import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCartItem } from '../../classes/shopping-cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private shoppingCartItems: ShoppingCartItem[] = [];
  public shoppingCartChanged = new BehaviorSubject<ShoppingCartItem[]>([]);

  public get items(): ShoppingCartItem[] {
    return this.shoppingCartItems.slice();
  }

  public get numItems(): number {
    return this.shoppingCartItems.length;
  }

  public get totalPrice(): number {
    let total = 0;
    for (const item of this.shoppingCartItems) {
      total += item.quantity * item.price;
    }
    return total;
  }

  public setQuantity(id: string, quantity: number): void {
    if (!this.contains(id)) {
      return;
    }

    const shoppingListItemIndex = this.shoppingCartItems.findIndex(
      (item) => item.id === id
    );
    this.shoppingCartItems[shoppingListItemIndex].quantity = quantity;
    this.shoppingCartChanged.next(this.shoppingCartItems.slice());
  }

  public addItem(newItem: ShoppingCartItem): number {
    const shoppingListItemIndex = this.shoppingCartItems.findIndex(
      (item) => item.id === newItem.id
    );
    if (shoppingListItemIndex >= 0) {
      this.shoppingCartItems[shoppingListItemIndex].quantity++;
      this.shoppingCartChanged.next(this.shoppingCartItems.slice());
      return shoppingListItemIndex;
    }

    this.shoppingCartItems.push(newItem);
    this.shoppingCartChanged.next(this.shoppingCartItems.slice());
    return this.numItems - 1;
  }

  public addItemAtIndex(newItem: ShoppingCartItem, index: number): void {
    const shoppingListItemIndex = this.shoppingCartItems.findIndex(
      (item) => item.id === newItem.id
    );
    if (shoppingListItemIndex >= 0) {
      this.shoppingCartItems[shoppingListItemIndex].quantity++;
      this.shoppingCartChanged.next(this.shoppingCartItems.slice());
    }

    this.shoppingCartItems.splice(index, 0, newItem);
    this.shoppingCartChanged.next(this.shoppingCartItems.slice());
  }

  public deleteItem(index: number): void {
    this.shoppingCartItems.splice(index, 1);
    this.shoppingCartChanged.next(this.shoppingCartItems.slice());
  }

  public contains(id: string): boolean {
    if (this.shoppingCartItems.find((item) => item.id === id)) {
      return true;
    } else {
      return false;
    }
  }

  public getQuantity(id: string): number {
    if (!this.contains(id)) {
      return 0;
    }

    return this.shoppingCartItems.find((item) => item.id === id).quantity;
  }

  updateShoppingCart(shoppingCartItems: ShoppingCartItem[]): void {
    this.shoppingCartItems = shoppingCartItems;
    this.shoppingCartChanged.next(this.shoppingCartItems.slice());
  }
}
