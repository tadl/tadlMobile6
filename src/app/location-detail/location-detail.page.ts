import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.page.html',
  styleUrls: ['./location-detail.page.scss'],
})
export class LocationDetailPage implements OnInit {

  location: any;
  address: string;

  constructor(
    public globals: Globals,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.address = this.location['address'] + ', ' + this.location['citystatezip'];
  }

}
