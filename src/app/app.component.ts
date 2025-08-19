import { Component } from '@angular/core';
import { Globals } from './globals';
import { User } from './user';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@capacitor/network';
import { fromEvent } from 'rxjs';
import { Events } from './services/event.service';
import { Platform } from '@ionic/angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  model: string = '';

  public appPages:any = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Search', url: '/search', icon: 'search' },
    { title: 'Locations', url: '/locations', icon: 'compass' },
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'News', url: '/news', icon: 'megaphone' },
    { title: 'Featured', url: '/featured', icon: 'star' },
    { title: 'About', url: '/about', icon: 'phone-portrait' },
  ];

  constructor(
    public events: Events,
    public globals: Globals,
    public user: User,
    public platform: Platform,
    private storage: Storage,
  ){
    if (this.globals.system_short_name === 'TADL') {
      this.appPages.splice(2, 0, { title: 'Suggest an Item', url: '/suggest-item', icon: 'bulb' });
    }
  }

  card_modal:boolean = false;

  show_card(isOpen: boolean) { this.card_modal = isOpen; }

  async getNetworkStatus() {
    const status = await Network.getStatus();
    this.globals.net_status = status.connected ? 'online' : 'offline';
    this.globals.net_type = status.connectionType;
  }

  async setup_storage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.events.publish('storage_setup_complete');
  }

  private async configureChrome() {
    try {
      if (this.platform.is('android')) {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.show(); // ensure status bar is visible
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        await StatusBar.setStyle({ style: dark ? Style.Light : Style.Dark });
      } else {
        // iOS
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        await StatusBar.setStyle({ style: dark ? Style.Light : Style.Dark });
      }
    } catch (e) {
      console.log('StatusBar configuration skipped:', e);
    }
  }

  ngOnInit() {
    this.setup_storage();
    this.getNetworkStatus();
    Network.addListener('networkStatusChange', () => this.getNetworkStatus());

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) this.globals.go_back();
      else this.globals.confirm_exit();
    });

    this.platform.ready().then(() => this.configureChrome());

    this.platform.resume.subscribe(async () => {
      await this.configureChrome();
      this.user.autolog();
    });

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) this.configureChrome();
    });
    window.addEventListener('focus', () => this.configureChrome());

    this.user.autolog();

    fromEvent(document, 'didDismiss').subscribe(() => { this.card_modal = false; });

    this.globals.getDeviceInfo();

    const theme = window.matchMedia('(prefers-color-scheme: dark)');
    theme.addEventListener('change', () => this.configureChrome());
  }
}
