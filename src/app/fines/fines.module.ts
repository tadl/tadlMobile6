import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinesPageRoutingModule } from './fines-routing.module';

import { FinesPage } from './fines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinesPageRoutingModule
  ],
  declarations: [FinesPage]
})
export class FinesPageModule {}
