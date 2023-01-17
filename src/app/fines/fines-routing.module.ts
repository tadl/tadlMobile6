import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinesPage } from './fines.page';

const routes: Routes = [
  {
    path: '',
    component: FinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinesPageRoutingModule {}
