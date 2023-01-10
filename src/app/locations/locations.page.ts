import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Globals } from '../globals';
import { ToastService } from '../services/toast.service';
import { format, formatDistance, isBefore } from 'date-fns';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

/*  url: string = this.globals.hours_locations_url; */
  url: string = 'https://tools.app.tadl.org/locations.json?group=tadl';
  locations: any = [];
  subscription: any;
  offline_updated: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private platform: Platform,
    private _location: Location,
    private storage: Storage,
  ) { }

  get_locations() {
    if (this.globals.net_status == "online") {
      this.globals.loading_show();
      this.http.get(this.url)
        .subscribe(data => {
          if (data) {
            this.globals.api_loading = false;
            this.locations = JSON.parse(JSON.stringify(data))["locations"];
            this.storage.set('locations', JSON.stringify(this.locations)).then(() => {
              this.storage.set('locations_timestamp', new Date());
            });
            console.log(this.locations);
          } else {
            this.toast.presentToast(this.globals.server_error_msg);
          }
        }, (err) => {
          this.globals.api_loading = false;
          this.toast.presentToast(this.globals.server_error_msg);
        });
    } else {
      this.storage.get('locations').then((data) => {
        if (data) {
          this.locations = JSON.parse(data);
          this.storage.get('locations_timestamp').then((data) => {
            this.offline_updated = formatDistance(new Date(data), new Date()) + ' ago';
          });
        }
      });
    }
  }


  ngOnInit() {
    this.get_locations();
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
