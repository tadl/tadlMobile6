import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutsPage } from './checkouts.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutsPageRoutingModule {}
