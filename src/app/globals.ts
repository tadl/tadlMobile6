import { Injectable } from '@angular/core';
import { Platform, ModalController, MenuController } from '@ionic/angular';

@Injectable()

export class Globals {
  constructor(
    private menuController: MenuController,
    private modalController: ModalController,
    private platform: Platform,
  ) {}










  public api_loading: boolean = false;

  loading_show() {
    this.api_loading = true;
  }

}
