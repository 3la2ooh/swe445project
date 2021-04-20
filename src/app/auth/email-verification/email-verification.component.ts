import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
  emailSent = false;
  timeLeft = 0;
  private subscription: Subscription;
  private user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.user;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async onResendEmail() {
    if (this.user) {
      await this.user.sendEmailVerification();

      this.emailSent = true;
      for (let i = 30; i >= 0; i--) {
        this.timeLeft = i;
        await this.timeout(1000);
      }
      this.emailSent = false;
    }
  }

  timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
