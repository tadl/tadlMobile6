import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Platform, ModalController } from '@ionic/angular';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public globals: Globals,
    public user: User,
    private _location: Location,
    private platform: Platform,
  ) { }

  ngOnInit() {
  }

}
