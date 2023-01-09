import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Globals } from './globals';
import { User } from './user';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonModal) modal: IonModal;
  card_modal = false;

  show_card(isOpen: boolean) {
    this.card_modal = isOpen;
  }

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

 ngOnInit() {
    this.storage.create();
    this.user.autolog();
  }

}
