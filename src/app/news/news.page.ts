import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  url: string = this.globals.news_api_url;
  news: any = [];
  page: any = 1;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private _location: Location,
  ) { }

  get_news() {
    this.globals.loading_show();
    this.http.get(this.url)
      .subscribe((data:any) => {
        this.globals.api_loading = false;
        if (data) {
          this.news = data;
        } else {
          this.toast.presentToast(this.globals.server_error_msg);
        }
    }, (err) => {
      this.globals.api_loading = false;
        this.toast.presentToast(this.globals.server_error_msg);
    });
  }

  ngOnInit() {
    this.get_news();
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

}
