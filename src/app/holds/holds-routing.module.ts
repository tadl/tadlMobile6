import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoldsPage } from './holds.page';

const routes: Routes = [
  {
    path: '',
    component: HoldsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoldsPageRoutingModule {}
