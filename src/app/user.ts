import { Globals } from './globals';
import { Component, ViewChild, NgZone, Injectable } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, NavController} from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { format, formatDistance, parseISO, isSameDay, isBefore, isAfter } from 'date-fns';
import { Md5 } from 'ts-md5';
import { Storage } from '@ionic/storage-angular';
import {Events} from './event_service'
import { ToastService } from './services/toast.service';

@Injectable({ providedIn: 'root' })

export class User {
  username: string;
  password: any = ''
  hashed_password: any = ''
  logged_in: boolean = false;
  full_name: string;
  ils_username: string;
  checkout_count: string;
  checkouts: Array<any> = [];
  holds: Array<any> = [];
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
  item:{};

  constructor(
    public events: Events,
    public actionSheetController: ActionSheetController,
    public globals: Globals,
    public toast: ToastService,
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
    this.toast.presentToast(message);
    this.globals.api_loading = false;
  }

  async load_user_data(data: any={}) {
    console.log(data);
    if (data.error) {
      this.show_error_message("Invalid username and/or password. Please try again.");
    } else {
      this.update_user_object(data.user);
      this.process_checkouts(data)
      this.process_holds(data)
    }
    this.globals.api_loading = false;
  }

  async update_user_object(data : any={}) {
    //not all API calls return the full user so check to see and if not fetch the user
    if(data['checkouts'] == null){
      console.log('full user not returned fetching user...')
      this.login(true);
      return 
    }
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
    this.globals.api_loading = false;
    if(this.logged_in == false){
      this.logged_in = true
      this.events.publish('logged in');
    }
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
    this.checkouts = [];
    this.storage.remove('hashed_password');
    this.storage.remove('username');
  }

  get_checkouts(){
    if(this.logged_in){
      console.log('trying to get checkouts...');
      let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
      this.globals.loading_show();
      this.http.get(this.globals.catalog_checkouts_url, {params: params})
        .subscribe({
          next: (response) => this.process_checkouts(response),
          error: (error) => this.show_error_message("Could not reach server. Please verify you have a data connection or try again later."),
        });
    }
  }

  renew(cid = '') {
    let url = this.globals.catalog_renew_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("checkout_ids", cid)
      .set("v", "5");
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data: any) => {
        this.globals.api_loading = false;
        if (data['errors'].length == 0 && data['checkouts'] && data['user']) {
          this.process_checkouts(data);
          this.toast.presentToast(data['message']);
        } else if (data['checkouts'] && data['user']) {
          this.process_checkouts(data);
          let message = data['message'] + ': ';
          data['errors'].forEach(function(val: any) {
            message += val['title'] + ': ' + val['message'];
          });
          this.toast.presentToast(message);
        }
        this.events.publish('renew_attempt_complete');
      },
      (err) => {
        this.globals.api_loading = false;
        if (this.action_retry == true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.renew(cid);
            subscription.unsubscribe();
          });
          this.login(true);
        }
      });
  }

  async renew_all() {
    const actionSheet = await this.actionSheetController.create({
      header: "Attempt to renew all items?",
      buttons: [{
        text: 'Renew All',
        handler: () => {
          let to_renew = this.checkouts.filter(item => item['renew_attempts'] > 0).map(item => item['checkout_id']).join();
          if (to_renew.length > 0) {
            this.renew(to_renew);
          } else {
            this.toast.presentToast("No items eligible for renewal.", 5000);
          }
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

  get_holds(){
    if(this.logged_in){
      console.log('trying to get holds...');
      this.globals.loading_show();
      let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
      this.globals.loading_show();
      this.http.get(this.globals.catalog_holds_url, {params: params})
        .subscribe({
          next: (response) => this.process_holds(response),
          error: (error) => this.show_error_message("Could not reach server. Please verify you have a data connection or try again later."),
        });
    }
  }

  process_holds(data: any) {
    this.globals.api_loading = false;
    this.update_user_object(data['user'])
    data = data['holds']
    let existing = this.holds.map(item => item['hold_id'] + item['hold_status'] + item['queue_status'] + item['queue_state'][0] + item['queue_state'][1] + item['pickup_location_code']).join();
    let newdata = data.map((item: any) => item['hold_id'] + item['hold_status'] + item['queue_status'] + item['queue_state'][0] + item['queue_state'][1] + item['pickup_location_code']).join();
    if (existing != newdata) {
      this.zone.run(() => {
        this.holds = data;
      });
    }
  }

  manage_hold(hold: any, task: string) {
    let url = this.globals.catalog_holds_manage_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("hold_id", hold.hold_id)
      .set("task", task)
      .set("v", "5");
    if (task == "activate") { var action = "activated"; }
    else if (task == "suspend") { var action = "suspended"; }
    else if (task == "cancel") { var action = "canceled"; }
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data: any) => {
        this.globals.api_loading = false;
        if (data['holds'] && data['user']) {
          this.process_holds(data);
          this.update_user_object(data['user']);
          this.toast.presentToast("Successfully " + action + " hold on " + hold.title_display + ".", 5000);
        }
        this.events.publish('manage_hold_complete');
      },
      (err) => {
        this.globals.api_loading = false;
        if (this.action_retry == true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          let subscription = this.events.subscribe('action_retry', () => {
            this.manage_hold(hold, task);
            subscription.unsubscribe();
          });
          this.login(true);
        }
      });
  }

  async cancel_hold(hold: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel hold on ' + hold.title_display,
      buttons: [{
        text: 'Cancel Hold',
        role: 'destructive',
        handler: () => {
          this.manage_hold(hold, 'cancel');
        }
      }, {
        text: 'Nevermind',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  change_hold_pickup(hold: any, newloc: any) {
    let url = this.globals.catalog_change_hold_pickup_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("hold_id", hold.hold_id)
      .set("hold_status", hold.hold_status)
      .set("pickup_location", newloc.detail.value)
      .set("v", "5");
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe((data: any) => {
        this.globals.api_loading = false;
        if (data['hold_id'] == hold.hold_id) {
          this.zone.run(() => {
            this.holds.find(item => item['hold_id'] == data['hold_id'])['pickup_location'] = data['pickup_location'];
            this.holds.find(item => item['hold_id'] == data['hold_id'])['pickup_location_code'] = data['pickup_location_code'];
            this.toast.presentToast('Changed pickup location for ' + hold.title_display + ' to ' + data['pickup_location'], 5000);
          });
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          let subscrition = this.events.subscribe('action_retry', () => {
            this.change_hold_pickup(hold, newloc);
            subscrition.unsubscribe();
          });
          this.login(true);
        }
      });
  }

  process_checkouts(data: any={}) {
    this.globals.api_loading = false;
    let date_today = format(new Date(), 'MM/dd/yyyy');
    this.update_user_object(data['user'])
    data = data['checkouts']
    data.forEach(function(checkout: any={} , index = 0) {
      if (isBefore(new Date(checkout['due_date']), new Date(date_today)) && !isSameDay(new Date(checkout['due_date']), new Date(date_today))) {
        data[index]['overdue'] = true;
        data[index]['due_words'] = formatDistance(new Date(checkout['due_date']), new Date(date_today)) + ' ago';
      } else {
        data[index]['overdue'] = false;
        if (isSameDay(new Date(checkout['due_date']), new Date(date_today))) {
          data[index]['due_words'] = "today";
        } else {
          data[index]['due_words'] = 'in ' + formatDistance(new Date(checkout['due_date']), new Date(date_today));
        }
      }
    });
    let existing = this.checkouts.map(item => item['checkout_id'] + item['renew_attempts'] + item['due_date']).join();
    let newdata = data.map((item: any) => item['checkout_id'] + item['renew_attempts'] + item['due_date']).join();
    if (existing != newdata) {
      this.zone.run(() => {
        this.checkouts = data;
      });
    }
  }


}
