import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoldsPageRoutingModule } from './holds-routing.module';

import { HoldsPage } from './holds.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoldsPageRoutingModule
  ],
  declarations: [HoldsPage]
})
export class HoldsPageModule {}
