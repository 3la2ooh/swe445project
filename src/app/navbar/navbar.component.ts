import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  isLoggedIn = false;
  numShoppingCartItems: number;

  constructor(
    private location: Location,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private fireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.shoppingCartService.shoppingCartChanged.subscribe(
        (items) =>
          (this.numShoppingCartItems = this.shoppingCartService.numItems)
      )
    );

    this.subscriptions.push(
      this.fireAuth.user.subscribe((user) => {
        if (user) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get isOnCatalog(): boolean {
    return this.location.path() === '/catalog';
  }

  get isOnShoppingCart(): boolean {
    return this.location.path() === '/shopping-cart';
  }

  get isOnLogin(): boolean {
    return this.location.path() === '/login';
  }

  login(): Promise<boolean> {
    return this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/catalog']);
      })
      .catch((error) => {
        window.alert('Something went wrong!');
      });
  }
}
