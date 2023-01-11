import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationDetailPageRoutingModule } from './location-detail-routing.module';

import { LocationDetailPage } from './location-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationDetailPageRoutingModule
  ],
  declarations: [LocationDetailPage]
})
export class LocationDetailPageModule {}
