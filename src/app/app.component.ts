import { Component} from '@angular/core';
import { Globals } from './globals';
import { User } from './user';
import { Storage } from '@ionic/storage-angular';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
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
    private storage: Storage,
  ) {}

  card_modal = false;

  show_card(isOpen: boolean) {
    this.card_modal = isOpen;
  }

  ngOnInit() {
    this.storage.create();
    this.user.autolog();
    fromEvent(document, 'didDismiss')
      .subscribe(event => {
        this.card_modal = false;
      });
  }
}
