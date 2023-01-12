import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { IonicModule } from '@ionic/angular';

import { ItemDetailPageRoutingModule } from './item-detail-routing.module';

import { ItemDetailPage } from './item-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruncateModule,
    ItemDetailPageRoutingModule
  ],
  declarations: [ItemDetailPage]
})
export class ItemDetailPageModule {}
