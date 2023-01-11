import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutsPageRoutingModule } from './checkouts-routing.module';

import { CheckoutsPage } from './checkouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutsPageRoutingModule
  ],
  declarations: [CheckoutsPage]
})
export class CheckoutsPageModule {}
