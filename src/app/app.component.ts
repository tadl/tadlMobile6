import { Component } from '@angular/core';
import { User } from './user';
import { Storage } from '@ionic/storage-angular';
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
/*  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; */

  constructor(
    public user: User,
    private storage: Storage,
  ) {}

 ngOnInit() {
    this.storage.create();
    this.user.autolog();
  }
}
