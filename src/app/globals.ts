import { Injectable } from '@angular/core';
import { Platform, ModalController, MenuController } from '@ionic/angular';

@Injectable()

export class Globals {
  constructor(
    private menuController: MenuController,
    private modalController: ModalController,
    private platform: Platform,
  ) {}

  /* CUSTOMIZABLE VARIABLES */

  /* app version */
  public app_version: string = '6.0.0';
  public update_version: string = '2023011000';

  /* basic information */
  public catalog_host: string = 'apiv4.catalog.tadl.org'; /* hostname for catalog api */
  public catalog_covers_host: string = 'catalog.tadl.org'; /* hostname for catalog extras */
  public website_host: string = 'www.tadl.org'; /* hostname for website */
  public system_short_name: string = 'TADL';
  public all_locations_value: string = '22';

  /* feature toggles */
  public multi_location: boolean = true;
  public use_melcat: boolean = true;
  public has_audiences: boolean = true;

  /* customizable strings */
  public server_error_msg: string = "Whoops. Something went wrong. Please check your internet connection and try again in a minute.";
  public reset_card_label: string = "Username or Card #";

  /* static assets */
  public logo_url: string = '/assets/logo.png';
  public square_logo_url: string = '/assets/logo-clock-only.png';

  /* catalog things */
  public catalog_schema: string = 'https://';
  public catalog_api_base: string = this.catalog_schema + this.catalog_host;
  public catalog_covers_base: string = this.catalog_schema + this.catalog_covers_host + '/opac/extras/ac/jacket';

  public catalog_login_url: string = this.catalog_api_base + '/login.json';
  public catalog_logout_url: string = this.catalog_api_base + '/logout.json';
  public catalog_place_hold_url: string = this.catalog_api_base + '/place_hold.json';
  public catalog_holds_url: string = this.catalog_api_base + '/holds.json';
  public catalog_holds_pickup_url: string = this.catalog_api_base + '/holds_pickup.json';
  public catalog_checkouts_url: string = this.catalog_api_base + '/checkouts.json';
  public catalog_checkout_history_url: string = this.catalog_api_base + '/checkout_history.json';
  public catalog_search_url: string = this.catalog_api_base + '/search.json';
  public catalog_renew_url: string = this.catalog_api_base + '/renew_checkouts.json';
  public catalog_holds_manage_url: string = this.catalog_api_base + '/manage_hold.json';
  public catalog_change_hold_pickup_url: string = this.catalog_api_base + '/change_hold_pickup.json';
  public catalog_fines_url: string = this.catalog_api_base + '/fines.json';
  public catalog_featured_url: string = this.catalog_api_base + '/index.json';
  public catalog_preferences_url: string = this.catalog_api_base + '/preferences.json';
  public catalog_update_preferences_url: string = this.catalog_api_base + '/update_preferences.json';
  public catalog_password_reset_url: string = this.catalog_api_base + '/submit_password_reset.json';
  public catalog_square_covers_url: string = this.catalog_api_base + '/';

  public catalog_covers_small: string = this.catalog_covers_base + '/small/r/';
  public catalog_covers_medium: string = this.catalog_covers_base + '/medium/r/';
  public catalog_covers_large: string = this.catalog_covers_base + '/large/r/';

  /* website things */
  public website_schema: string = 'https://';
  public events_api_url: string = this.website_schema + this.website_host + '/events/feed/json';

  public hours_locations_url: string = this.website_schema + this.website_host + '/locations.json';
  public pay_fines_url: string = this.website_schema + this.website_host + '/pay/pay.cgi'; /* redirected by nginx */







  /* global vars */
  public api_loading: boolean = false;
  public net_status: string = "online";
  public net_type: string = "undefined";

  loading_show() {
    this.api_loading = true;
  }

}
