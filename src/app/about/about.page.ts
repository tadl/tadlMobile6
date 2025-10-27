// src/app/about/about.page.ts
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

  platforms = '';
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

    // Initial value (before storage init event)
    this.storage_driver = this.computeStorageDriver();

    // Update after storage init (emitted by AppComponent)
    this.storageSub = this.events.subscribe('storage_setup_complete', () => {
      this.storage_driver = this.computeStorageDriver();
      this.storageSub?.unsubscribe();
      this.storageSub = undefined;
    });
  }

  ngOnDestroy() {
    this.storageSub?.unsubscribe();
  }

  ionViewDidEnter() {}
  ionViewWillLeave() {}

  private computeStorageDriver(): string {
    const isNative = this.platform.is('ios') || this.platform.is('android');
    if (isNative) return 'preferences';

    const d = (this.storage?.driver ?? '').toString().toLowerCase();
    if (d === 'indexeddb') return 'indexeddb';
    if (d === 'localstorage') return 'localstorage';
    return d || '(unknown)';
  }
}
