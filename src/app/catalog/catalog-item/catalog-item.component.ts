import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ShoppingCartItem } from '../../../classes/shopping-cart-item.model';

import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { CatalogService } from '../catalog.service';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.css'],
})
export class CatalogItemComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() id: string;
  @Input() imageUrl: string;
  @Input() title: string;
  @Input() rating: number;
  @Input() price: number;
  isProductInShoppingCart = false;
  quantity = 0;

  get isAllowedToAddToCart(): boolean {
    return !!this.authService.userId;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private catalogService: CatalogService,
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.shoppingCartService.shoppingCartChanged.subscribe((items) => {
        this.isProductInShoppingCart = this.shoppingCartService.contains(
          this.id
        );
        this.quantity = this.shoppingCartService.getQuantity(this.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onClickItem(): Promise<boolean> {
    return this.router.navigate([this.id], { relativeTo: this.route });
  }

  async onAddToCart(): Promise<void> {
    if (!this.isAllowedToAddToCart) {
      this.router.navigate(['/login']);
      return;
    }

    const item = this.catalogService.getItem(this.id);

    let index = -1;
    try {
      this.shoppingCartService.addItem(
        new ShoppingCartItem(
          item.id,
          item.name,
          item.specifications,
          item.price,
          item.imageUrl,
          1
        )
      );

      await this.dataStorageService.saveShoppingCart();
    } catch (error) {
      this.shoppingCartService.deleteItem(index);
    }
  }
}
