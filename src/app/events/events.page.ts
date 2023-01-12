import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Location } from '@angular/common';
import { Platform, ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
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
  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
  ) { }
  
  get_events(loc?:string) {
    let params = new HttpParams()
      .set("ongoing_events", "show")
      .set("start", "12:00am")
      .set("end", "1month");
    if (loc) { params = params.append("branches", loc); }
    this.globals.loading_show()
    this.http.get<any[]>(this.url, {params: params})
      .subscribe(data => {
        this.globals.api_loading = false;
        if (data) {
          data.forEach(function(item, index) {
            if (item.branch) {
              data[index]['branchid'] = Object.keys(item.branch)[0];
              data[index]['branchname'] = Object.values(item.branch)[0];
            }
          });
          this.web_events = data;
          console.log(this.web_events);
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
    this.subscription = this.platform.backButton.subscribe(() => {
      this._location.back();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
