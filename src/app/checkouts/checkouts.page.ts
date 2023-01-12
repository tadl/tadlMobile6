import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Platform, ModalController } from '@ionic/angular';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})

export class CheckoutsPage implements OnInit {

  subscription: any;

  constructor(
    public modalController: ModalController,
    public globals: Globals,
    public user: User,
    private _location: Location,
    private platform: Platform,
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

  ngOnInit() {
    if(this.user.logged_in){
      this.user.get_checkouts()
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
