import { Events } from '../services/event.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-fines',
  templateUrl: './fines.page.html',
  styleUrls: ['./fines.page.scss'],
})
export class FinesPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    private _location: Location,
  ) { }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_fines();
    }
    let subscription = this.events.subscribe('logged in', () => {
      this.user.get_fines();
      subscription.unsubscribe();
    });
  }

  ngOnDestroy() {
    let subscription = this.events.subscribe('logged in', () => {
      subscription.unsubscribe();
    });
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

}
