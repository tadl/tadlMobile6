import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutHistoryPageRoutingModule } from './checkout-history-routing.module';

import { CheckoutHistoryPage } from './checkout-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutHistoryPageRoutingModule
  ],
  declarations: [CheckoutHistoryPage]
})
export class CheckoutHistoryPageModule {}
