import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CatalogItem, OS } from '../../classes/catalog-item.model';
import { ShoppingCartItem } from '../../classes/shopping-cart-item.model';
import { AuthService } from '../auth/auth.service';
import { CatalogService } from '../catalog/catalog.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  productId: string;
  product: CatalogItem;
  isProductInShoppingCart = false;
  quantity = 0;

  get isAllowedToAddToCart(): boolean {
    return !!this.authService.userId;
  }

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private shoppingCartService: ShoppingCartService,
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.product = this.catalogService.getItem(this.productId);

    if (!this.product) {
      this.subscriptions.push(
        this.route.data.subscribe((resolverData) => {
          this.product = resolverData[this.productId];
        })
      );
    }

    this.subscriptions.push(
      this.shoppingCartService.shoppingCartChanged.subscribe((items) => {
        this.isProductInShoppingCart = this.shoppingCartService.contains(
          this.productId
        );
        this.quantity = this.shoppingCartService.getQuantity(this.productId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getObjectKey(object: number): string {
    // tslint:disable-next-line:radix
    const enums = Object.keys(OS).filter((x) => !(parseInt(x) >= 0));
    return enums[object];
  }

  async onAddToCart(): Promise<void> {
    if (!this.isAllowedToAddToCart) {
      this.router.navigate(['/login']);
      return;
    }

    let index = -1;
    try {
      index = this.shoppingCartService.addItem(
        new ShoppingCartItem(
          this.productId,
          this.product.name,
          this.product.specifications,
          this.product.price,
          this.product.imageUrl,
          1
        )
      );

      await this.dataStorageService.saveShoppingCart();
    } catch (error) {
      this.shoppingCartService.deleteItem(index);
    }
  }
}
