import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Location } from '@angular/common';
import { ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  url: string = this.globals.events_api_url;
  web_events: any;
  location: any = '';

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private http: HttpClient,
  ) { }

  get_events(loc?:string) {
    let params = new HttpParams();
    if (loc) { params = params.append("venue", loc); }
    this.globals.loading_show()
    this.http.get<any[]>(this.url, {params: params})
      .subscribe((data:any) => {
        this.globals.api_loading = false;
        if (data['events']) {
          this.web_events = data['events'];
        } else {
          this.toast.presentToast(this.globals.server_error_msg);
        }
      }, (err) => {
        this.globals.api_loading = false;
        this.toast.presentToast(this.globals.server_error_msg);
      });
  }


  ngOnInit() {
    this.get_events(this.location);
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

}
