import { Component} from '@angular/core';
import { Globals } from './globals';
import { User } from './user';
import { Storage } from '@ionic/storage';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { fromEvent } from 'rxjs';

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
    public globals: Globals,
    public user: User,
    public platform: Platform,
    private storage: Storage,
  ) {}

  card_modal = false;

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
    console.log(status);
  }

  ngOnInit() {
    this.getNetworkStatus();
    Network.addListener('networkStatusChange', status => {
      this.getNetworkStatus();
      console.log('Network status changed ', status);
    });
    this.platform.resume.subscribe(async () => {
      this.user.autolog();
    });
    this.storage.create();
    this.user.autolog();
    fromEvent(document, 'didDismiss').subscribe(event => {
      this.card_modal = false;
    });
  }
}
