import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { User } from '../user';
import { ToastService } from '../services/toast.service';
import { ItemDetailPage } from '../item-detail/item-detail.page';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  query: string | null;
  prev_query: string | null;
  type: string = "keyword";
  advanced: any;
  sort: string = this.globals.sort_options[0][1];
  format: string = "All Formats";
  location: string = this.globals.all_locations_value;
  page: number;
  audiences: any = "All";
  audience: any;
  limit_available: boolean = false;
  limit_physical: boolean = false;
  results: any = [];
  new_results: any = [];
  more_results: boolean = false;
  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    public toast: ToastService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private platform: Platform,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  get_results(page?:number, more?:boolean) {
    if (!this.query) { this.query = ''}
    if (this.type == "keyword") {
      this.sort = this.globals.sort_options[0][1];
    }
    if (!page || this.query != this.prev_query) {
      this.page = 0;
    }
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
    let params = new HttpParams()
      .set("v", "5")
      .set("type", this.type)
      .set("query", this.query)
      .set("location", this.location)
      .set("sort", this.sort)
      .set("page", this.page)
      .set("limit_physical", this.limit_physical.toString())
      .set("limit_available", this.limit_available.toString())
      .set("fmt", this.format);
    if (this.globals.has_audiences == true) {
      params = params.append("audiences", this.audiences);
    }
    var url = this.globals.catalog_search_url;
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data:any) => {
        this.globals.api_loading = false;
        this.prev_query = this.query;
        if (data) {
          if (data['type']) { this.type = data['type']; }
          if (data['more_results']) {
            this.more_results = true;
          } else {
            this.more_results = false;
          }
          this.new_results = data['results'];
          if (more == true) {
            for (let i = 0; i < this.new_results.length; i++) {
              this.results.push(this.new_results[i]);
            }
          } else {
            this.results = this.new_results;
          }
        } else {
          this.toast.presentToast(this.globals.server_error_msg);
        }
      },
      (err) => {
        this.globals.api_loading = false;
        this.toast.presentToast(this.globals.server_error_msg);
      });
  }

  detect_search_option() {
    if (this.query) {
      this.get_results();
    }
  }

  async details(item:any) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
        this.subscription = this.platform.backButton.subscribe(() => {
          this._location.back();
        });
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.query = this.route.snapshot.paramMap.get('query');
    this.detect_search_option();
  }

  onIonInfinite(ev:any) {
    if (this.more_results) {
      this.page++;
      this.get_results(this.page, true);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 10);
    }
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
