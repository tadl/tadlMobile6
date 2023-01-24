import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Platform, ModalController } from '@ionic/angular';
import { ItemDetailPage } from '../item-detail/item-detail.page';
import { Events } from '../services/event.service';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit {

  constructor(
    public events: Events,
    public modalController: ModalController,
    public globals: Globals,
    public user: User,
    private _location: Location,
  ) { }

  async details(item:any) {
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    this.globals.modal_open = true;
    return await modal.present();
  }

  refresh_holds(event: any) {
    this.user.get_holds();
    let subscription = this.events.subscribe('process_holds_complete', () => {
      event.target.complete();
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.user.get_holds();
  }

  ionViewWillLeave() {
  }

}
