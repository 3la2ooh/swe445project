import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegisterationComponent } from './auth/registeration/registeration.component';
import { LoginComponent } from './auth/login/login.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { MaxCharacterDirective } from './shared/max-character.directive';
import { NumberOnlyDirective } from './shared/numbers-only.directive';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PaymentComponent } from './payment/payment.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CatalogItemComponent } from './catalog/catalog-item/catalog-item.component';
import { RatingComponent } from './shared/rating/rating.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';

@NgModule({
  declarations: [
    AppComponent,

    RegisterationComponent,
    LoginComponent,
    CatalogComponent,
    ProductComponent,
    ShoppingCartComponent,
    PaymentComponent,
    FooterComponent,
    NavbarComponent,
    CatalogItemComponent,
    RatingComponent,
    NumberOnlyDirective,
    MaxCharacterDirective,
    EmailVerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
