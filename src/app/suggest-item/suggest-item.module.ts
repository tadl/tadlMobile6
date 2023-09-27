import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestItemPageRoutingModule } from './suggest-item-routing.module';

import { SuggestItemPage } from './suggest-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestItemPageRoutingModule
  ],
  declarations: [SuggestItemPage]
})
export class SuggestItemPageModule {}
