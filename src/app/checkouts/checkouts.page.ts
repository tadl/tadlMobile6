import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { User } from '../user';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})
export class CheckoutsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    private http: HttpClient,
  ) { }


  ngOnInit() {
    this.user.get_checkouts()
    fromEvent(document, 'didDismiss')
    .subscribe(event => {
      this.user.get_checkouts();
    });
  }

}
