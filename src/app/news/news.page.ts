import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Platform, ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
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
  news: any;
  page: any = 1;
  loading_more: boolean = false;
  infinite: any;
  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private platform: Platform,
    private _location: Location,
  ) { }

  get_news(page:number, refresher?:string) {
    let params = new HttpParams()
  }







  ngOnInit() {
  }

}
