import { Component, OnInit } from '@angular/core';
import { Platform, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';
import { Events } from '../services/event.service';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-checkout-history',
  templateUrl: './checkout-history.page.html',
  styleUrls: ['./checkout-history.page.scss'],
})

export class CheckoutHistoryPage implements OnInit {

  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
    private platform: Platform,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  async details(item:any) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
        this.subscription = this.platform.backButton.subscribe(() => {
          this._location.back();
        });
      }
    });
    return await modal.present();
  }

  refresh_checkout_history(event:any) {
    return;
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_preferences();
      this.user.get_checkout_history();
    }
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this._location.back();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
