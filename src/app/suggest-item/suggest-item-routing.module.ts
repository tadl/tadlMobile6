import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestItemPage } from './suggest-item.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestItemPageRoutingModule {}
