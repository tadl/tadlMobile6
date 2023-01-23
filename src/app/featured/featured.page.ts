import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { Item } from '../item';
import { User } from '../user';
import { ToastService } from '../services/toast.service';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.page.html',
  styleUrls: ['./featured.page.scss'],
})

export class FeaturedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  fmt: string = "all";
  infinite: any;
  location: string = "22";
  page: any;
  query: any;
  results: any = '';
  search_title: any;
  size: string = "50";
  sort: string = "pubdateDESC";
  type: string = "shelving_location";

  constructor(
    public globals: Globals,
    public item: Item,
    public user: User,
    public toast: ToastService,
    private http: HttpClient,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  featured_search(search: string, title: string) {
    search += '&page=0';
    search += '&size=50';
    search += '&v=5';
    let params = JSON.parse('{"' + decodeURI(search.replace(/\/search\?/, '')).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    let url = this.globals.catalog_search_url;
    if (this.infinite) { this.infinite.target.disabled = false; }
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data: any) => {
        this.globals.api_loading = false;
        this.results = data['results'];
        this.search_title = title;
        this.update_vars(data);
      },
      (err) => {
        this.globals.api_loading = false;
        this.toast.presentToast(this.globals.server_error_msg);
      });
  }

  get_more_items(infiniteScroll: any) {
    this.page++;
    this.infinite = infiniteScroll;
    let params = new HttpParams()
      .set("fmt", this.fmt)
      .set("location", this.location)
      .set("page", this.page)
      .set("query", this.query)
      .set("size", this.size)
      .set("sort", this.sort)
      .set("type", this.type)
    let url = this.globals.catalog_search_url;
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data: any) => {
        this.globals.api_loading = false;
        this.results.push.apply(this.results, data['results']);
        this.infinite.target.complete();
        if (data['more_results'] == false) { this.infinite.target.disabled = true; }
        this.update_vars(data);
      },
      (err) => {
        this.globals.api_loading = false;
        this.toast.presentToast(this.globals.server_error_msg);
      });
  }

  update_vars(data: any) {
    this.fmt = data['fmt'];
    this.location = data['location'];
    this.page = data['page'];
    this.query = data['query'];
    this.size = data['size'];
    this.sort = data['sort'];
    this.type = data['type'];
  }

  async details(item: any) {
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.item.get_featured();
  }

  ionViewDidEnter() {
  }

  ionViewWillLeave() {
  }

}
