import { Component} from '@angular/core';
import { Globals } from './globals';
import { User } from './user';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@capacitor/network';
import { fromEvent } from 'rxjs';
import { Events } from './services/event.service';
import { Platform } from '@ionic/angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

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
  ) {}

  card_modal:boolean = false;

  show_card(isOpen: boolean) {
    this.card_modal = isOpen;
  }

  async getNetworkStatus() {
    let status = await Network.getStatus();
    if (status.connected == true) {
      this.globals.net_status = "online";
      this.globals.net_type = status.connectionType;
    } else {
      this.globals.net_status = "offline";
      this.globals.net_type = status.connectionType;
    }
  }

  async setup_storage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
    this.events.publish('storage_setup_complete');
  }

  async do_init() {
    await this.platform.ready().then(() => {
      this.setup_storage();
      this.getNetworkStatus();
      this.user.autolog();
      Network.addListener('networkStatusChange', status => {
        this.getNetworkStatus();
        console.log('Network status changed ', status);
      });
      App.addListener('backButton', ( { canGoBack }) => {
        if (canGoBack) {
          this.globals.go_back();
        } else {
          this.globals.confirm_exit();
        }
      });
      this.platform.resume.subscribe(async () => {
        this.user.autolog();
      });
      fromEvent(document, 'didDismiss').subscribe(event => {
        this.card_modal = false;
      });
      this.globals.getDeviceInfo();
    });
  }


  ngOnInit() {
    this.do_init();
    console.log('init complete');
  }
}
