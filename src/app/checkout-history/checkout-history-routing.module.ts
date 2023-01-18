import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutHistoryPage } from './checkout-history.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutHistoryPageRoutingModule {}
