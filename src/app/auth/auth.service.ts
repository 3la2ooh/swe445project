import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { User } from '../../classes/user.model';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userId: string = null;
  user: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private shoppingCartService: ShoppingCartService,
    private fireDatabase: AngularFireDatabase
  ) {}

  async signUp(
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<User> {
    return await this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        await this.savePhoneNumber(userCredential.user.uid, phoneNumber);
        await userCredential.user.sendEmailVerification();
        return new User(userCredential.user.email, userCredential.user.uid);
      });
  }

  async login(email: string, password: string): Promise<User> {
    return await this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return new User(userCredential.user.email, userCredential.user.uid);
      });
  }

  async logout(): Promise<User> {
    return await this.fireAuth.signOut().then(() => {
      this.shoppingCartService.updateShoppingCart([]);
      this.userId = null;
      return null;
    });
  }

  async savePhoneNumber(userId: string, phoneNumber: string) {
    return await this.fireDatabase.database
      .ref(userId + '/phone-number')
      .set(phoneNumber, (responseData) => {
        if (responseData instanceof Error) {
          return throwError(responseData.message);
        }
      })
      .catch((errorResponse) => {
        // Send to Analytics
        return throwError(errorResponse);
      });
  }

  async getPhoneNumber(): Promise<string> {
    return await this.fireDatabase.database
      .ref(this.userId + '/phone-number')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return null;
        }
      });
  }

  handleError(errorResponse): string {
    let error = 'An unknown error occured!';

    if (errorResponse.message) {
      return errorResponse.message;
    }

    if (!errorResponse.error || !errorResponse.error.error) {
      return error;
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        error = 'Error: This email already exists!';
        break;
      case 'EMAIL_NOT_FOUND':
        error = 'Error: Email not found! You have to sign up.';
        break;
      case 'INVALID_PASSWORD':
        error =
          'Error: The password is invalid or the user does not have a password';
        break;
      case 'USER_DISABLED':
        error = 'Error: The user account has been disabled by an administrator';
        break;
    }
    return error;
  }

  getPasswordError(password: string): string {
    if (password.length < 8) {
      return 'Password should contain at least 8 characters and at most 20 characters';
    } else if (!new RegExp('(?=.*[0-9])').test(password)) {
      return 'Password should contain at least one digit.';
    } else if (!new RegExp('(?=.*[a-z])').test(password)) {
      return 'Password should contain at least one lowercase alphabet.';
    } else if (!new RegExp('(?=.*[A-Z])').test(password)) {
      return 'Password should contain at least one uppercase alphabet.';
    } else if (!new RegExp('(?=.*[@#$%^&+=])').test(password)) {
      return 'Password should contain at least one special character.';
    } else if (!new RegExp('(?=\\S+$)').test(password)) {
      return 'Password should not contain any white space.';
    }
  }
}
