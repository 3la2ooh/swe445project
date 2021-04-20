import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared/data-storage.service';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  loggingIn = false;
  error = '';
  signInDataForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$'
      ),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {}

  onLogin(): void {
    this.loggingIn = true;
    this.authService
      .login(
        this.signInDataForm.get('email').value,
        this.signInDataForm.get('password').value
      )
      .then(() => {
        this.loggingIn = false;
        // this.dataStorageService.fetchShoppingCart();
        this.router.navigate(['/catalog']);
      })
      .catch((error) => {
        this.loggingIn = false;
        this.error = this.authService.handleError(error);
      });
  }

  getPasswordError(): string {
    return this.authService.getPasswordError(
      this.signInDataForm.get('password').value
    );
  }
}
