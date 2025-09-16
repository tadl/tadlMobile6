// src/app/locations/locations.page.ts
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Globals } from '../globals';
import { formatDistance } from 'date-fns';
import { ToastService } from '../services/toast.service';
import { LocationDetailPage } from '../location-detail/location-detail.page';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  url: string = this.globals.hours_locations_url;
  locations: any[] = [];
  offline_updated: string | undefined;

  // preference keys
  private readonly LOCATIONS_KEY = 'locations';
  private readonly LOCATIONS_TS_KEY = 'locations_timestamp';

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private _location: Location,
  ) {}

  ngOnInit() {
    this.get_locations();
  }

  get_locations() {
    if (this.globals.net_status === 'online') {
      this.globals.loading_show();
      this.http.get(this.url).subscribe({
        next: (data: any) => {
          this.globals.api_loading = false;
          this.locations = data?.locations ?? [];
          // persist for offline use
          void this.persistLocations(this.locations);
        },
        error: () => {
          this.globals.api_loading = false;
          this.toast.presentToast(this.globals.server_error_msg);
        },
      });
    } else {
      // offline: read from Preferences
      this.loadOfflineLocations();
    }
  }

  private async persistLocations(locations: any[]) {
    try {
      await Preferences.set({
        key: this.LOCATIONS_KEY,
        value: JSON.stringify(locations),
      });
      await Preferences.set({
        key: this.LOCATIONS_TS_KEY,
        value: new Date().toISOString(),
      });
    } catch {
      // non-fatal; just log if you like
      console.warn('Failed to persist locations');
    }
  }

  private async loadOfflineLocations() {
    const { value: locJson } = await Preferences.get({ key: this.LOCATIONS_KEY });
    if (locJson) {
      try {
        this.locations = JSON.parse(locJson);
      } catch {
        this.locations = [];
      }
    }
    const { value: ts } = await Preferences.get({ key: this.LOCATIONS_TS_KEY });
    if (ts) {
      this.offline_updated = formatDistance(new Date(ts), new Date()) + ' ago';
    }
  }

  async view_details(location: any) {
    const modal = await this.modalController.create({
      component: LocationDetailPage,
      componentProps: { location },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    this.globals.modal_open = true;
    return await modal.present();
  }

  ionViewDidEnter() {}
  ionViewWillLeave() {}
}
