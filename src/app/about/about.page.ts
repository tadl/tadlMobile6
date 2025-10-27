import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Globals } from '../globals';
import { User } from '../user';
import { Events } from '../services/event.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, OnDestroy {

  platforms: string = '';
  storage_driver: string | null = null;
  creds_migrated: 'yes' | 'no' | 'pending' = 'pending';

  private storageSub?: { unsubscribe: () => void };

  constructor(
    public globals: Globals,
    public user: User,
    public platform: Platform,
    private _location: Location,
    private storage: Storage,
    private events: Events,
  ) {
    this.platforms = this.platform.platforms().join('/');
  }

  async ngOnInit() {
    // Show whether the one-time migration already ran
    const { value } = await Preferences.get({ key: 'creds_migrated_v1' });
    this.creds_migrated = value === 'yes' ? 'yes' : 'no';

    // If storage was already created, this will be set; otherwise wait for the event.
    this.storage_driver = this.storage?.driver ?? null;

    // Update once storage init (and migration) completes.
    this.storageSub = this.events.subscribe('storage_setup_complete', () => {
      this.storage_driver = this.storage.driver || '(unknown)';
      // Only need this once
      this.storageSub?.unsubscribe();
      this.storageSub = undefined;
    });
  }

  ngOnDestroy() {
    this.storageSub?.unsubscribe();
  }

  ionViewDidEnter() {}
  ionViewWillLeave() {}
}
