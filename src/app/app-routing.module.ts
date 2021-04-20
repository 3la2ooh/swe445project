import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CatalogComponent } from './catalog/catalog.component';
import { LoginComponent } from './auth/login/login.component';
import { CatalogResolver } from './catalog/catalog.resolver';
import { EmptyShoppingCartGuard } from './payment/empty-shopping-cart.guard';
import { PaymentComponent } from './payment/payment.component';
import { ProductComponent } from './product/product.component';
import { RegisterationComponent } from './auth/registeration/registeration.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartResolver } from './shopping-cart/shopping-cart.resolver';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthGuard } from './auth/not-auth.guard';
import { ProductResolver } from './product/product.resolver';
import { CatalogGuard } from './catalog/catalog.guard';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { EmailVerificationGuard } from './auth/email-verification.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    component: CatalogComponent,
    canActivate: [CatalogGuard],
    resolve: [CatalogResolver],
  },
  {
    path: 'catalog/:id',
    component: ProductComponent,
    resolve: [ProductResolver],
  },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  {
    path: 'verify-email',
    component: EmailVerificationComponent,
    canActivate: [EmailVerificationGuard],
  },
  {
    path: 'pay',
    component: PaymentComponent,
    canActivate: [AuthGuard, EmptyShoppingCartGuard],
  },
  {
    path: 'register',
    component: RegisterationComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [AuthGuard],
    resolve: [ShoppingCartResolver],
  },
  { path: '**', redirectTo: 'catalog' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
