import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Device } from '@capacitor/device';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  platforms: string = this.platform.platforms().join('/');
  storage_driver: string | null = this.storage.driver;
  subscription: any;
  device_info: any = {};

  constructor(
    public globals: Globals,
    public user: User,
    public platform: Platform,
    private _location: Location,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.getDeviceInfo();
  }

  async getDeviceInfo() {
    this.device_info = await Device.getInfo();
    console.log(this.device_info);
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
