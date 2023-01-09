import { Globals } from './globals';
import { Component, ViewChild, NgZone, Injectable } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, NavController, ToastController} from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })

export class User {
  username: string;
  password: any = ''
  hashed_password: any = ''
  logged_in: boolean = false;
  full_name: string;
  ils_username: string;
  checkout_count: string;
  holds_count: string;
  holds_ready_count: string;
  overdue: string;
  fines_amount: string;
  fines_exist: boolean = false;
  card: string;
  token: string;
  default_pickup: string;
  id: string;
  fines: any;
  action_retry: any;
  preferences: any;

  constructor(
    public toast: ToastController,
    public actionSheetController: ActionSheetController,
    public globals: Globals,
    private http: HttpClient,
    private zone: NgZone,
    private storage: Storage,
  ){ }

  async login(saved: boolean) {
    if (saved != true) {
      if (!this.username || !this.password) {
        this.show_error_message("Username and password are required.");
        return;
      }
      this.hashed_password = Md5.hashStr(this.password);
    }
    let params = new HttpParams()
    .set("username", this.username)
    .set("md5password", this.hashed_password)
    .set("full", "true")
    .set("v", "5");
    this.globals.loading_show();
    this.http.get('https://apiv4.catalog.tadl.org/login.json', {params: params})
      .subscribe({
        next: (response) => this.load_user_data(response),
        error: (error) => this.show_error_message("Could not reach login server. Please verify you have a data connection or try again later."),
      });
  }

  async show_error_message(message = '') {
    const error_msg = await this.toast.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    this.globals.api_loading = false;
    error_msg.present();
  }

  async load_user_data(data: any={}) {
    console.log(data);
    if (data.error) {
      this.show_error_message("Invalid username and/or password. Please try again.");
    } else {
      this.update_user_object(data.user);
    }
    this.globals.api_loading = false;
  }

  async update_user_object(data : any={}) {
    this.zone.run(() => {
      this.logged_in = true;
      this.token = data['token'];
      this.full_name = data['full_name'];
      this.checkout_count = data['checkouts'];
      this.holds_count = data['holds'];
      this.holds_ready_count = data['holds_ready'];
      this.fines_amount = data['fine'];
      this.id = data['melcat_id'];
      if (parseFloat(this.fines_amount) != parseFloat('0.00')) { this.fines_exist = true; }
      this.card = data['card'];
      this.overdue = data['overdue'];
      this.default_pickup = data['pickup_library'];
      this.storage.set('username', this.username);
      this.storage.set('hashed_password', this.hashed_password);
    });
  }

  async confirm_logout() {
    const actionSheet = await this.actionSheetController.create({
      header: "Please confirm you'd like to log out.",
      buttons: [{
        text: 'Log Out',
        role: 'destructive',
        handler: () => {
          this.logout();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  logout() {
    console.log('trying to logout...');
    let params = new HttpParams()
    .set("token", this.token)
    .set("v", "5");
    this.http.get('https://apiv4.catalog.tadl.org/logout.json', {params: params})
    .subscribe({
      next: (response) => this.clear_user(response),
      error: (error) => this.show_error_message("Could not reach login server. Please verify you have a data connection or try again later."),
    })
  }

  autolog() {
    console.log('trying to auto login...');
    this.storage.get('username').then((val: string) => {
      if (val) {
        this.username = val;
        this.storage.get('hashed_password').then((val: string) => {
          this.hashed_password = val;
          this.login(true);
        });
      } else {
        this.username = '';
      }
    });
  }

  clear_user(data : any={}) {
    console.log('trying to clear user...');
    this.zone.run(() => {
      this.logged_in = false;
      this.username = '';
      this.password = '';
      this.hashed_password = '';
      this.token = '';
      this.full_name = '';
      this.checkout_count = '';
      this.holds_count = '';
      this.holds_ready_count = '';
      this.fines_amount = '';
      this.card = '';
      this.overdue = '';
      this.id = '';
      this.fines_exist = false;
      this.default_pickup = '';
      this.preferences = {};
      this.fines = [];
      this.storage.remove('hashed_password');
      this.storage.remove('username');
    });
  }
}
