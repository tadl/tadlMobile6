import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { NewsDetailPage } from '../news-detail/news-detail.page';

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

  async view_details(news:any) {
    const modal = await this.modalController.create({
      component: NewsDetailPage,
      componentProps: {
        "news": news,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    this.globals.modal_open = true;
    return await modal.present();
  }

  ngOnInit() {
    this.get_news();
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

}
