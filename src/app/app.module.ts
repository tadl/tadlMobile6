import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Globals } from './globals';
import { User } from './user';
import { IonicModule, IonicRouteStrategy, isPlatform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NgxBarcode6Module } from 'ngx-barcode6';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: isPlatform('ios') ? 'ios' : 'md'
    }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxBarcode6Module,
    IonicStorageModule.forRoot({
      name: '__db',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Globals,
    User,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
