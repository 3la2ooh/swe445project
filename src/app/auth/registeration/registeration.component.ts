import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import ConfirmationResult = firebase.auth.ConfirmationResult;

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registeration',
  templateUrl: './registeration.component.html',
  styleUrls: ['./registeration.component.css'],
})
export class RegisterationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  signingUp = false;
  error = '';

  allowSignIn = false;
  otpSent = false;
  isPhoneVerified = false;
  windowRef: any;
  confirmationResult: ConfirmationResult;
  phoneNumber: string = '';
  phoneCredential: firebase.auth.UserCredential;

  registrationDataForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$'
      ),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^(5(\\d{8}))$'),
    ]),
    code: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fireAuth: AngularFireAuth
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

    this.subscriptions.push(
      this.registrationDataForm.get('code').valueChanges.subscribe((newVal) => {
        this.onCheckCode();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onRegister(): void {
    const appVerifier = this.windowRef.recaptchaVerifier;
    this.signingUp = true;

    this.authService
      .signUp(
        this.registrationDataForm.get('email').value,
        this.registrationDataForm.get('password').value,
        this.phoneNumber
      )
      .then(async () => {
        this.signingUp = false;
        this.router.navigate(['/catalog']);
      })
      .catch((error) => {
        this.signingUp = false;
        this.error = this.authService.handleError(error);
      });
  }

  getPasswordError(): string {
    return this.authService.getPasswordError(
      this.registrationDataForm.get('password').value
    );
  }

  async onSendOTP() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const phone = this.registrationDataForm.get('phone').value;

    if (!phone || phone.length !== 9 || !appVerifier) {
      alert(
        'Phone number has to be 9 digits (without the zero). E.g. 597070759'
      );
      return;
    }

    const phoneNumber = '+966' + phone;
    await this.fireAuth
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.phoneNumber = phoneNumber;
        this.confirmationResult = confirmationResult;
        this.registrationDataForm.get('phone').disable();
        this.otpSent = true;
        // console.log('confirmationResult', confirmationResult);
      })
      .catch((e) => alert(e));
  }

  async onCheckCode() {
    const code = this.registrationDataForm.get('code').value;

    if (!code || code.length !== 6) {
      return;
    }

    await this.confirmationResult
      .confirm(code)
      .then(async (credential) => {
        this.phoneCredential = credential;
        this.isPhoneVerified = true;
        this.registrationDataForm.get('code').disable();
        // await this.authService.logout();
      })
      .catch((e) => {
        alert(e);
      });
  }
}
