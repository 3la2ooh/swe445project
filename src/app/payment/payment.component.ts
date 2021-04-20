import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import firebase from 'firebase/app';
import ConfirmationResult = firebase.auth.ConfirmationResult;

import { CatalogItem } from '../../classes/catalog-item.model';
import { ShoppingCartItem } from '../../classes/shopping-cart-item.model';
import { CatalogService } from '../catalog/catalog.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  shoppingCartItems: ShoppingCartItem[] = [];
  catalogItems: CatalogItem[] = [];
  subtotal = 0;
  readonly shippingCost = 15;
  isPaid = false;

  allowSignIn = false;
  otpSent = false;
  isPhoneVerified = false;
  windowRef: any;
  confirmationResult: ConfirmationResult;
  phoneCredential: firebase.auth.UserCredential;

  paymentDataForm = new FormGroup({
    cardHolder: new FormControl('', [Validators.required]),
    expirationDate: new FormGroup({
      mm: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2),
      ]),
      yy: new FormControl('', [
        Validators.required,
        Validators.maxLength(2),
        Validators.minLength(2),
      ]),
    }),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      Validators.pattern('^([0-9]{4}[- ]?){3}[0-9]{4}$'),
    ]),
    cvc: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3),
    ]),
    code: new FormControl('', []),
  });

  constructor(
    private shoppingCartService: ShoppingCartService,
    private dataStorageService: DataStorageService,
    private catalogService: CatalogService,
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) {
    this.windowRef = window;
  }

  ngOnInit(): void {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response: any) => {
          // console.log('allowSignIn', response);
          this.allowSignIn = true;
        },
      }
    );

    this.shoppingCartService.shoppingCartChanged
      .pipe(take(1))
      .subscribe((items) => {
        this.shoppingCartItems = items;
        this.catalogItems = [];
        this.shoppingCartItems.forEach((item) =>
          this.catalogItems.push(this.catalogService.getItem(item.id))
        );
        this.subtotal = this.shoppingCartService.totalPrice;
      });

    this.subscriptions.push(
      this.paymentDataForm.get('code').valueChanges.subscribe((newVal) => {
        this.onCheckCode();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async onProceed() {
    const appVerifier = this.windowRef.recaptchaVerifier;

    this.authService.getPhoneNumber().then(async (phoneNumber) => {
      if (!phoneNumber || phoneNumber.length !== 13 || !appVerifier) {
        alert('Unable to authorize. Contact admin');
        return;
      }

      // const phoneNumber = '+966' + phone;
      await this.fireAuth
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(async (confirmationResult) => {
          this.confirmationResult = confirmationResult;
          this.otpSent = true;
        })
        .catch((e) => alert(e));
    });
  }

  async onCheckCode() {
    const code = this.paymentDataForm.get('code').value;

    if (!code || code.length !== 6) {
      return;
    }

    await this.confirmationResult
      .confirm(code)
      .then(async (credential) => {
        this.phoneCredential = credential;
        this.isPhoneVerified = true;
        this.paymentDataForm.get('code').disable();
        this.shoppingCartService.updateShoppingCart([]);
        await this.dataStorageService.saveShoppingCart();
        this.paymentDataForm.disable();
        this.isPaid = true;
      })
      .catch((e) => {
        alert(e);
      });

    await this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/catalog']);
    }, 2000);
  }
}
