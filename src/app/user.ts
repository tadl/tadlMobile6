import { Globals } from './globals';
import { Component, ViewChild, NgZone, Injectable } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { format, formatDistance, parseISO, isSameDay, isBefore, isAfter } from 'date-fns';
import { Md5 } from 'ts-md5';
import { Events } from './services/event.service';
import { ToastService } from './services/toast.service';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class User {
  username: string;
  password: any = '';
  hashed_password: any = '';
  logged_in: boolean = false;
  full_name: string = '';
  ils_username: string;
  checkout_count: number;
  checkouts: Array<any> = [];
  holds: Array<any> = [];
  holds_count: number;
  holds_ready_count: number;
  overdue: number;
  fines_amount: string;
  fines_exist: boolean = false;
  card: string = '';
  token: string;
  default_pickup: string;
  id: number;
  fines: any;
  action_retry: any;
  preferences: any = '';
  item: any = {};
  stored_accounts: any = {};
  stored_accounts_keys: Array<string> = [];
  checkout_history: Array<any> = [];
  checkout_history_page: number = 0;
  more_checkout_history: boolean = false;
  logged_out_id: number;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public events: Events,
    public globals: Globals,
    public modalController: ModalController,
    public toast: ToastService,
    private http: HttpClient,
    private zone: NgZone,
    private router: Router,
  ) {}

  // ---- Preferences helpers ----
  private async prefGet(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value ?? null;
  }
  private async prefSet(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }
  private async prefRemove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async login(saved: boolean = false) {
    if (saved !== true) {
      if (!this.username || !this.password) {
        this.show_error_message('Username and password are required.');
        return;
      }
      this.hashed_password = Md5.hashStr(this.password);
    }

    const params = new HttpParams()
      .set('username', this.username)
      .set('md5password', this.hashed_password)
      .set('full', 'true')
      .set('v', '5');

    this.globals.loading_show();
    this.http.get(this.globals.catalog_login_url, { params })
      .subscribe({
        next: (response) => this.load_user_data(response),
        error: () =>
          this.show_error_message('Could not reach login server. Please verify you have a data connection or try again later.'),
      });
  }

  login_as(id: string) {
    this.username = this.stored_accounts[id]['username'];
    this.hashed_password = this.stored_accounts[id]['hashed_password'];
    this.login(true);
  }

  switch_user() {
    this.update_stored_accounts();
    this.logout(true);
  }

  async update_stored_accounts() {
    // Load current map
    let raw = await this.prefGet('stored_accounts');
    try {
      this.stored_accounts = raw ? JSON.parse(raw) : {};
    } catch {
      this.stored_accounts = {};
    }
    this.stored_accounts_keys = Object.keys(this.stored_accounts);

    // Upsert current user
    if (this.id) {
      const user = {
        hashed_password: this.hashed_password,
        username: this.username,
        full_name: this.full_name,
      };
      this.stored_accounts[this.id] = user;
      await this.prefSet('stored_accounts', JSON.stringify(this.stored_accounts));
      this.stored_accounts_keys = Object.keys(this.stored_accounts);
    }
  }

  async show_error_message(message = '') {
    this.toast.presentToast(message);
    this.globals.api_loading = false;
  }

  async load_user_data(data: any = {}) {
    if (data.error) {
      this.show_error_message('Invalid username and/or password. Please try again.');
    } else {
      await this.update_user_object(data);
      await this.update_stored_accounts();
      this.process_checkouts(data);
      this.process_holds(data);
      if (this.password.length === 4) {
        this.update_password();
      }
    }
    this.globals.api_loading = false;
  }

  async update_user_object(data: any = {}) {
    // Not all API calls return the full user; if missing, re-login with saved creds.
    if (data['user']['checkouts'] == null) {
      this.login(true);
      return;
    }

    this.token = data['user']['token'];
    this.full_name = data['user']['full_name'];
    if (data['preferences']) {
      this.preferences = data['preferences'];
    }
    this.checkout_count = data['user']['checkouts'];
    this.holds_count = data['user']['holds'];
    this.holds_ready_count = data['user']['holds_ready'];
    this.fines_amount = data['user']['fine'];
    this.id = data['user']['melcat_id'];
    if (parseFloat(this.fines_amount) !== parseFloat('0.00')) {
      this.fines_exist = true;
    }
    this.card = data['user']['card'];
    this.overdue = data['user']['overdue'];
    this.default_pickup = data['user']['pickup_library'];

    // Persist primary creds for auto-login
    await this.prefSet('username', this.username ?? '');
    await this.prefSet('hashed_password', this.hashed_password ?? '');

    this.globals.api_loading = false;
    if (this.logged_in === false) {
      this.logged_in = true;
      this.events.publish('logged in');
    }
  }

  async confirm_logout() {
    const actionSheet = await this.actionSheetController.create({
      header: "Please confirm you'd like to log out.",
      buttons: [
        {
          text: 'Log Out',
          role: 'destructive',
          handler: () => {
            this.logout(false);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  logout(token_only?: boolean) {
    const params = new HttpParams().set('token', this.token).set('v', '5');
    this.http.get(this.globals.catalog_logout_url, { params }).subscribe(
      async (data: any) => {
        this.globals.api_loading = false;
        if (data['success'] || data['error'] === 'not logged in or invalid token') {
          if (token_only === false) {
            if (this.stored_accounts) {
              delete this.stored_accounts[this.id];
              this.stored_accounts_keys = Object.keys(this.stored_accounts);
              await this.prefSet('stored_accounts', JSON.stringify(this.stored_accounts));
            }
          }
          this.zone.run(() => {
            this.clear_user();
            this.router.navigate(['/home']);
          });
        }
      },
      () => {
        this.toast.presentToast(this.globals.server_error_msg);
      }
    );
  }

  autolog() {
    // You already publish 'storage_setup_complete' after migration in app.component.ts
    const subscription = this.events.subscribe('storage_setup_complete', async () => {
      const uname = await this.prefGet('username');
      if (uname) {
        this.username = uname;
        const hpw = await this.prefGet('hashed_password');
        this.hashed_password = hpw || '';
        this.login(true);
      } else {
        this.username = '';
      }
      subscription.unsubscribe();
    });
  }

  clear_user(data: any = {}) {
    this.logged_in = false;
    this.username = '';
    this.password = '';
    this.hashed_password = '';
    this.token = '';
    this.full_name = '';
    this.checkout_count = Number.NaN;
    this.holds_count = Number.NaN;
    this.holds_ready_count = Number.NaN;
    this.fines_amount = '';
    this.card = '';
    this.overdue = Number.NaN;
    this.id = Number.NaN;
    this.fines_exist = false;
    this.default_pickup = '';
    this.preferences = {};
    this.fines = [];
    this.checkouts = [];
    this.holds = [];
    this.checkouts = [];

    // Remove persisted primary creds
    this.prefRemove('hashed_password');
    this.prefRemove('username');
  }

  get_checkouts() {
    if (this.logged_in) {
      const params = new HttpParams().set('token', this.token).set('v', '5');
      this.globals.loading_show();
      this.http.get(this.globals.catalog_checkouts_url, { params }).subscribe(
        (data: any) => {
          this.process_checkouts(data);
        },
        () => {
          this.globals.api_loading = false;
          if (this.action_retry === true) {
            this.toast.presentToast(this.globals.server_error_msg);
            this.action_retry = false;
          } else {
            this.action_retry = true;
            const subscription = this.events.subscribe('action_retry', () => {
              this.get_checkouts();
              subscription.unsubscribe();
            });
            this.login(true);
          }
        }
      );
    }
  }

  renew(cid = '') {
    const url = this.globals.catalog_renew_url;
    const params = new HttpParams().set('token', this.token).set('checkout_ids', cid).set('v', '5');
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data['errors'].length === 0 && data['checkouts'] && data['user']) {
          this.process_checkouts(data);
          this.toast.presentToast(data['message']);
        } else if (data['checkouts'] && data['user']) {
          this.process_checkouts(data);
          let message = data['message'] + ': ';
          data['errors'].forEach(function (val: any) {
            message += val['title'] + ': ' + val['message'];
          });
          this.toast.presentToast(message);
        }
        this.events.publish('renew_attempt_complete');
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
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
      }
    );
  }

  async renew_all() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Attempt to renew all items?',
      buttons: [
        {
          text: 'Renew All',
          handler: () => {
            const to_renew = this.checkouts
              .filter((item) => item['renew_attempts'] > 0)
              .map((item) => item['checkout_id'])
              .join();
            if (to_renew.length > 0) {
              this.renew(to_renew);
            } else {
              this.toast.presentToast('No items eligible for renewal.', 5000);
            }
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  get_holds() {
    if (this.logged_in) {
      this.globals.loading_show();
      const params = new HttpParams().set('token', this.token).set('v', '5');
      this.globals.loading_show();
      this.http.get(this.globals.catalog_holds_url, { params }).subscribe(
        (data: any) => {
          this.process_holds(data);
        },
        () => {
          this.globals.api_loading = false;
          if (this.action_retry === true) {
            this.toast.presentToast(this.globals.server_error_msg);
            this.action_retry = false;
          } else {
            this.action_retry = true;
            const subscription = this.events.subscribe('action_retry', () => {
              this.get_holds();
              subscription.unsubscribe();
            });
            this.login(true);
          }
        }
      );
    }
  }

  process_holds(data: any) {
    this.globals.api_loading = false;
    this.update_user_object(data);
    data = data['holds'];
    const existing = this.holds
      .map(
        (item) =>
          item['hold_id'] +
          item['hold_status'] +
          item['queue_status'] +
          item['queue_state'][0] +
          item['queue_state'][1] +
          item['pickup_location_code']
      )
      .join();
    const newdata = data
      .map(
        (item: any) =>
          item['hold_id'] +
          item['hold_status'] +
          item['queue_status'] +
          item['queue_state'][0] +
          item['queue_state'][1] +
          item['pickup_location_code']
      )
      .join();
    if (existing !== newdata) {
      this.zone.run(() => {
        this.holds = data;
      });
    }
    this.events.publish('process_holds_complete');
  }

  async login_and_place_hold(id: string) {
    const onClosedData: string = 'Wrapped up!';
    await this.modalController.dismiss(onClosedData);
    this.globals.open_account_menu();
    const subscription = this.events.subscribe('logged in', () => {
      this.place_hold(id, 'false');
      subscription.unsubscribe();
    });
  }

  place_hold(id: string, force: string) {
    let params = new HttpParams().set('token', this.token).set('id', id).set('v', '5');
    if (force === 'true') {
      params = params.append('force', 'true');
    }
    const url = this.globals.catalog_place_hold_url;
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data['user'] && data['hold']) {
          if (data['hold']['need_to_force'] === true) {
            this.force_needed(data['hold']['id'], data['hold']['error']);
          } else if (data['hold']['error']) {
            this.toast.presentToast(data['hold']['error'] + ' : ' + data['hold']['confirmation']);
          } else {
            this.toast.presentToast(data['hold']['confirmation'], 5000);
            this.update_user_object(data);
            this.events.publish('hold_placed');
          }
        }
        this.get_holds();
      },
      () => {
        if (this.action_retry === true) {
          this.globals.api_loading = false;
          this.toast.presentToast(this.globals.server_error_msg);
        } else {
          this.globals.api_loading = false;
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.place_hold(id, force);
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  async force_needed(id: string, error: string) {
    const alert = await this.alertController.create({
      header: 'Force hold?',
      message: error,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Force Hold',
          handler: () => {
            this.place_hold(id, 'true');
          },
        },
      ],
    });
    await alert.present();
  }

  manage_hold(hold: any, task: string) {
    const url = this.globals.catalog_holds_manage_url;
    const params = new HttpParams()
      .set('token', this.token)
      .set('hold_id', hold.hold_id)
      .set('task', task)
      .set('v', '5');
    let action: string;
    if (task === 'activate') action = 'activated';
    else if (task === 'suspend') action = 'suspended';
    else action = 'canceled';

    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data['holds'] && data['user']) {
          this.process_holds(data);
          this.update_user_object(data);
          this.toast.presentToast(`Successfully ${action} hold on ${hold.title_display}.`, 5000);
        }
        this.events.publish('manage_hold_complete');
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.manage_hold(hold, task);
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  async cancel_hold(hold: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel hold on ' + hold.title_display,
      buttons: [
        {
          text: 'Cancel Hold',
          role: 'destructive',
          handler: () => {
            this.manage_hold(hold, 'cancel');
          },
        },
        {
          text: 'Nevermind',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  change_hold_pickup(hold: any, newloc: any) {
    const url = this.globals.catalog_change_hold_pickup_url;
    const params = new HttpParams()
      .set('token', this.token)
      .set('hold_id', hold.hold_id)
      .set('hold_status', hold.hold_status)
      .set('pickup_location', newloc.detail.value)
      .set('v', '5');
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data['hold_id'] === hold.hold_id) {
          this.zone.run(() => {
            this.holds.find((item) => item['hold_id'] === data['hold_id'])['pickup_location'] = data['pickup_location'];
            this.holds.find((item) => item['hold_id'] === data['hold_id'])['pickup_location_code'] =
              data['pickup_location_code'];
            this.toast.presentToast('Changed pickup location for ' + hold.title_display + ' to ' + data['pickup_location'], 5000);
          });
        }
      },
      () => {
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscrition = this.events.subscribe('action_retry', () => {
            this.change_hold_pickup(hold, newloc);
            subscrition.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  process_checkouts(data: any = {}) {
    this.globals.api_loading = false;
    const date_today = format(new Date(), 'MM/dd/yyyy');
    this.update_user_object(data);
    data = data['checkouts'];
    data.forEach(function (checkout: any = {}, index = 0) {
      if (
        isBefore(new Date(checkout['due_date']), new Date(date_today)) &&
        !isSameDay(new Date(checkout['due_date']), new Date(date_today))
      ) {
        data[index]['overdue'] = true;
        data[index]['due_words'] = formatDistance(new Date(checkout['due_date']), new Date(date_today)) + ' ago';
      } else {
        data[index]['overdue'] = false;
        if (isSameDay(new Date(checkout['due_date']), new Date(date_today))) {
          data[index]['due_words'] = 'today';
        } else {
          data[index]['due_words'] = 'in ' + formatDistance(new Date(checkout['due_date']), new Date(date_today));
        }
      }
    });
    const existing = this.checkouts.map((item) => item['checkout_id'] + item['renew_attempts'] + item['due_date']).join();
    const newdata = data.map((item: any) => item['checkout_id'] + item['renew_attempts'] + item['due_date']).join();
    if (existing !== newdata) {
      this.zone.run(() => {
        this.checkouts = data;
      });
    }
    this.events.publish('process_checkouts_complete');
  }

  update_preferences(params: any, password: any) {
    this.globals.loading_show();
    const url = this.globals.catalog_update_preferences_url;
    this.http.get(url, { params }).subscribe(
      async (data: any) => {
        this.globals.api_loading = false;
        await this.update_user_object(data);
        this.preferences = data['preferences'];
        if (data['messages'][0]['error']) {
          this.toast.presentToast(data['messages'][0]['error'], 10000);
        } else {
          if (password) {
            this.hashed_password = Md5.hashStr(password);
            await this.update_stored_accounts();
          }
          if (data['messages'][0]['type'] !== 'circ_prefs' && data['messages'][0]['type'] !== 'notify_prefs') {
            this.toast.presentToast(data['messages'][0]['success'], 5000);
          }
        }
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.update_preferences(params, null);
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  get_preferences() {
    const params = new HttpParams().set('token', this.token).set('v', '5');
    const url = this.globals.catalog_preferences_url;
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      async (data: any) => {
        this.globals.api_loading = false;
        if (data) {
          await this.update_user_object(data);
          this.preferences = data['preferences'];
        }
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.action_retry = false;
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  get_fines() {
    const params = new HttpParams().set('token', this.token).set('v', '5');
    const url = this.globals.catalog_fines_url;
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data) {
          this.fines = data;
        }
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.get_fines();
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }

  async update_password() {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+\[\]{};:'",.<>/?\\|]{7,}$/;
    const alert = await this.alertController.create({
      header: 'Temporary Password Detected',
      message:
        'Password update is required when logging in with a temporary password. Please enter a new password (twice) then tap Ok.',
      inputs: [
        {
          name: 'new_password1',
          type: 'password',
          placeholder: 'New Password',
        },
        {
          name: 'new_password2',
          type: 'password',
          placeholder: 'New Password Again',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (values) => {
            if (values.new_password1 !== values.new_password2) {
              this.toast.presentToast('Passwords did not match, please try again.', 5000);
            } else {
              if (passwordRegex.test(values.new_password1)) {
                const params = new HttpParams()
                  .set('token', this.token)
                  .set('user_prefs_changed', 'true')
                  .set('password_changed', 'true')
                  .set('new_password', values.new_password1)
                  .set('current_password', this.password)
                  .set('v', '5');
                this.update_preferences(params, values.new_password1);
              } else {
                this.toast.presentToast(
                  'Password must be at least 7 characters in length, contain one number and one letter.',
                  10000
                );
                this.update_password();
              }
            }
          },
        },
      ],
    });
    await alert.present();
  }

  get_checkout_history(page?: number, more?: boolean) {
    if (!page) {
      this.checkout_history_page = 0;
    }
    const params = new HttpParams().set('token', this.token).set('v', '5').set('page', this.checkout_history_page);
    const url = this.globals.catalog_checkout_history_url;
    let new_items: any = [];
    this.globals.loading_show();
    this.http.get(url, { params }).subscribe(
      (data: any) => {
        this.globals.api_loading = false;
        if (data['user'] && data['checkouts']) {
          new_items = data['checkouts'];
          this.more_checkout_history = data['more_results'] === 'true';
          if (more === true) {
            for (let i = 0; i < new_items.length; i++) {
              this.checkout_history.push(new_items[i]);
            }
          } else {
            this.checkout_history = new_items;
          }
        }
        this.events.publish('process_checkout_history_complete');
      },
      () => {
        this.globals.api_loading = false;
        if (this.action_retry === true) {
          this.toast.presentToast(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          const subscription = this.events.subscribe('action_retry', () => {
            this.get_checkout_history();
            subscription.unsubscribe();
          });
          this.login(true);
        }
      }
    );
  }
}
