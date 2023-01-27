import { Injectable } from '@angular/core';
import { AlertController, Platform, ModalController, MenuController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Browser } from '@capacitor/browser';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';

@Injectable()

export class Globals {
  constructor(
    private menuController: MenuController,
    private modalController: ModalController,
    private alertController: AlertController,
    private platform: Platform,
  ) {}

  /* CUSTOMIZABLE VARIABLES */

  /* app version */
  public app_version: string = '6.0.7';
  public update_version: string = '2023012700';

  public device_info: any;

  /* basic information */
  public catalog_host: string = 'apiv4.catalog.tadl.org'; /* hostname for catalog api */
  public catalog_covers_host: string = 'catalog.tadl.org'; /* hostname for catalog extras */
  public website_host: string = 'www.tadl.org'; /* hostname for website */
  public tools_host: string = 'tools.app.tadl.org'; /* hostname for tools TODO: UPDATE */
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

  /* melcat link */
  public melcat_url: string = 'https://www.mel.org';

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
  public events_api_url: string = this.website_schema + this.tools_host + '/mobile_events.json';

  public news_api_url: string = this.website_schema + this.tools_host + '/posts';

  public hours_locations_url: string = this.website_schema + this.tools_host + '/locations.json?group=tadl';
  public pay_fines_url: string = this.website_schema + this.website_host + '/pay/pay.cgi'; /* redirected by nginx */

  /* global vars */
  public api_loading: boolean = false;
  public net_status: string = "online";
  public net_type: string = "undefined";
  public modal_open: boolean = false;

  /* Arrays and Maps to handle multi-location things */
  /* Used for changing pickup locations on holds */
  public pickup_locations: Array<{name: string, code: string}> = [
    { name: 'Traverse City', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' },
  ];

  /* Used for searching */
  public search_locations: Array<{name: string, code: string}> = [
    { name: 'All Locations', code: '22' },
    { name: 'Traverse City', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' },
  ];

  /* Used for displaying location name on item details */
  public short_to_friendly_name = new Map<string, string>([
    ['TADL-EBB', 'East Bay'],
    ['TADL-KBL', 'Kingsley'],
    ['TADL-PCL', 'Peninsula'],
    ['TADL-IPL', 'Interlochen'],
    ['TADL-FLPL', 'Fife Lake'],
    ['TADL-WOOD', 'Traverse City'],
  ]);

  /* Used for filtering events by location */
  public event_venues: Array<{venue: number, name: string}> = [
    { venue: 89, name: 'Traverse City' },
    { venue: 132, name: 'East Bay' },
    { venue: 133, name: 'Fife Lake' },
    { venue: 134, name: 'Kingsley' },
    { venue: 135, name: 'Interlochen' },
    { venue: 136, name: 'Peninsula' },
    { venue: 160, name: 'Online' },
  ];

  /* Formats */
  public formats: string[] = [
    'All Formats',
    'Books',
    'Books - Fiction',
    'Books - Non-fiction',
    'Large Print',
    'Large Print - Fiction',
    'Large Print - Non-fiction',
    'Audiobooks',
    'Audiobooks - Fiction',
    'Audiobooks - Non-fiction',
    'eBooks',
    'eBooks - Fiction',
    'eBooks - Non-fiction',
    'Movies / TV',
    'Music',
    'Video Games',
    'STEM Kits',
    'Library of Things',
  ];

  item_type = new Map<string, string>([
    ['text', 'book'],
    ['notated music', 'musical-notes'],
    ['cartographic', 'map'],
    ['moving image', 'film'],
    ['sound recording-nonmusical', 'disc'],
    ['sound recording-musical', 'disc'],
    ['still image', 'image'],
    ['software, multimedia', 'document'],
    ['kit', 'briefcase'],
    ['mixed-material', 'briefcase'],
    ['three dimensional object', 'archive'],
  ]);

  /* Sort Options */
  public sort_options: Array<string[]> = [
    ['Relevance', 'relevance'],
    ['Newest to Oldest', 'pubdateDESC'],
    ['Oldest to Newest', 'pubdateASC'],
    ['Title A to Z', 'titleAZ'],
    ['Title Z to A', 'titleZA'],
  ];

  /* Audiences */
  public audiences: Array<string> = [ "All", "Adult", "Young Adult", "Juvenile" ];

  /* FUNctions */

  /* to open links in a browser */
  async open_page(url:string) {
    await Browser.open({ url: url });
  }

  /* date formatter */
  format_date(str:string, fmt?:string) {
    if (fmt == "event") {
      return format(parseISO(str), 'EEE LLLL do, h:mm a');
    } else if (fmt == "eventdetailday") {
      return format(parseISO(str), 'EEEE');
    } else if (fmt == "eventdetaildate") {
      return format(parseISO(str), 'LLLL do');
    } else if (fmt == "eventdetailtime") {
      return format(parseISO(str), 'h:mm a');
    } else if (fmt == "news") {
      return format(parseISO(str), 'LLLL do, h:mm a');
    } else return null;
  }

  /* returns today's day, for displaying hours today */
  day_today() {
    return format(new Date(), 'EEEE');
  }


  show_more(id:string, type:string) {
    var div_to_hide = id + '-' + type;
    var div_to_show = div_to_hide + '-full';
    const show_this = document.getElementById(div_to_show)
    if(show_this != null){
      show_this.setAttribute('style', 'display: block');
    }
    const hide_this = document.getElementById(div_to_hide)
    if(hide_this != null){
      hide_this.setAttribute('style', 'display: none');
    }
  }
  show_less(id:string, type:string) {
    var div_to_show = id + '-' + type
    var div_to_hide = div_to_show + '-full'
    const show_this = document.getElementById(div_to_show)
    if(show_this != null){
      show_this.setAttribute('style', 'display: block');
    }
    const hide_this = document.getElementById(div_to_hide)
    if(hide_this != null){
      hide_this.setAttribute('style', 'display: none');
    }
  }


  /* opens account menu */
  open_account_menu() {
    this.menuController.open('end');
  }

  /* toggle account menu */
  toggleMenu(menu:string) {
    this.menuController.toggle(menu);
  }

  /* closes modals */
  async close_modal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
    this.modal_open = false;
  }
  async go_back() {
    if (this.modal_open == true) {
      this.close_modal();
      return;
    } else {
      window.history.back();
    }
  }

  /* api loading indicator */
  loading_show() {
    this.api_loading = true;
  }

  /* populate device_info */
  async getDeviceInfo() {
    this.device_info = await Device.getInfo();
  }

  /* confirm exit */
  async confirm_exit() {
    if (this.modal_open == true) {
      this.close_modal();
      return;
    } else {
      const alert = await this.alertController.create({
        header: 'Exit the app?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Exit App',
          handler: () => {
            App.exitApp();
          }
        }]
      });
      await alert.present();
    }
  }

}
