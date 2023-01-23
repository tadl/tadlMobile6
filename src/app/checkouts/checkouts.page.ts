import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { ModalController } from '@ionic/angular';
import { ItemDetailPage } from '../item-detail/item-detail.page';
import { Events } from '../services/event.service';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})

export class CheckoutsPage implements OnInit {

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
    return await modal.present();
  }

  refresh_checkouts(event: any) {
    this.user.get_checkouts();
    let subscription = this.events.subscribe('process_checkouts_complete', () => {
      event.target.complete();
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.user.get_checkouts()
  }

  ionViewWillLeave() {
  }

}
