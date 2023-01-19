import { Component, OnInit } from '@angular/core';
import { Events } from '../services/event.service';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public toast: ToastService,
    private http: HttpClient,
    private platform: Platform,
    private _location: Location,
  ) { }

  subscription: any;
  ignore_change: boolean = false;

  async update_hold_pickup_location(event: any) {
    let new_pickup_library = event.detail.value;
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("circ_prefs_changed", "true")
      .set("pickup_library", new_pickup_library)
      .set("default_search", this.user.preferences.default_search)
      .set("keep_circ_history", this.user.preferences.keep_circ_history)
      .set("keep_hold_history", this.user.preferences.keep_hold_history)
      .set("v", "5");
    this.user.update_preferences(params, null);
  }

  async update_default_search_location(event: any) {
    let new_search_location = event.detail.value;
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("circ_prefs_changed", "true")
      .set("pickup_library", this.user.preferences.pickup_library)
      .set("default_search", new_search_location)
      .set("keep_circ_history", this.user.preferences.keep_circ_history)
      .set("keep_hold_history", this.user.preferences.keep_hold_history)
      .set("v", "5");
    this.user.update_preferences(params, null);
  }

  async toggle_circ_history(event: any) {
    if (event.detail.checked == false) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Warning! Turning off your checkout history will delete your existing history. It can not be recovered.',
        buttons: [{
          text: 'Delete Checkout History',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.update_circ_history(event.detail.checked);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.ignore_change = true;
            this.user.preferences.keep_circ_history = true;
          }
        }]
      });
      await actionSheet.present();
    } else {
      if (this.ignore_change == true) {
        this.ignore_change = false;
      } else {
        this.update_circ_history(event.detail.checked);
      }
    }
  }

  update_circ_history(val: any) {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("circ_prefs_changed", "true")
      .set("pickup_library", this.user.preferences.pickup_library)
      .set("default_search", this.user.preferences.default_search)
      .set("keep_circ_history", val.toString())
      .set("keep_hold_history", this.user.preferences.keep_hold_history)
      .set("v", "5");
    this.user.update_preferences(params, null);
  }

  async update_username() {
    const alert = await this.alertController.create({
      header: 'Change Username',
      message: 'Enter your desired new username along with your current password to change your username.',
      inputs: [{
        name: 'username',
        type: 'text',
        placeholder: 'New Username',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values) => {
          if (values.username != this.user.preferences.username && values.current_password) {
            let params = new HttpParams()
              .set("token", this.user.token)
              .set("user_prefs_changed", "true")
              .set("username_changed", "true")
              .set("username", values.username)
              .set("current_password", values.current_password)
              .set("v", "5");
            this.user.update_preferences(params, null);
          } else {
          }
        }
      }]
    });
    await alert.present();
  }

  async update_alias() {
    const alert = await this.alertController.create({
      header: 'Change Holdshelf Alias',
      message: 'Enter a new holdshelf alias along with your current password to change your holdshelf alias.',
      inputs: [{
        name: 'hold_shelf_alias',
        type: 'text',
        placeholder: 'New Holdshelf Alias',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values) => {
          if (values.hold_shelf_alias != this.user.preferences.hold_shelf_alias && values.current_password) {
            let params = new HttpParams()
              .set("token", this.user.token)
              .set("user_prefs_changed", "true")
              .set("hold_shelf_alias_changed", "true")
              .set("hold_shelf_alias", values.hold_shelf_alias)
              .set("current_password", values.current_password)
              .set("v", "5");
            this.user.update_preferences(params, null);
          } else {
          }
        }
      }]
    });
    await alert.present();
  }

  async update_email() {
    const alert = await this.alertController.create({
      header: 'Change Email Address',
      message: 'Enter your new email address along with your current password to change your email address.',
      inputs: [{
        name: 'email',
        type: 'email',
        placeholder: 'Email Address',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values) => {
          if (values.email != this.user.preferences.email && values.current_password) {
            let params = new HttpParams()
              .set("token", this.user.token)
              .set("user_prefs_changed", "true")
              .set("email_changed", "true")
              .set("email", values.email)
              .set("current_password", values.current_password)
              .set("v", "5");
            this.user.update_preferences(params, null);
          } else {
          }
        }
      }]
    });
    await alert.present();
  }

  async update_password() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      message: 'Enter your new password (twice) along with your current password to change your password.',
      inputs: [{
        name: 'new_password1',
        type: 'password',
        placeholder: 'New Password',
      }, {
        name: 'new_password2',
        type: 'password',
        placeholder: 'New Password Again',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values) => {
          if (values.new_password1 != values.new_password2) {
            this.toast.presentToast("Passwords did not match, please try again.", 5000);
          } else {
            if (values.new_password1 == values.new_password2 && values.current_password) {
              let params = new HttpParams()
                .set("token", this.user.token)
                .set("user_prefs_changed", "true")
                .set("password_changed", "true")
                .set("new_password", values.new_password1)
                .set("current_password", values.current_password)
                .set("v", "5");
              this.user.update_preferences(params, values.new_password1);
            } else {
            }
          }
        }
      }]
    });
    await alert.present();
  }

  async update_phone_notify_number() {
    const alert = await this.alertController.create({
      header: 'Change Phone Notify Number',
      message: "Enter a new phone number where you'd like to receive voice notifications.",
      inputs: [{
        name: 'phone_notify_number',
        type: 'tel',
        placeholder: '231-111-1111',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values: any) => {
          if (values.phone_notify_number != this.user.preferences.phone_notify_number) {
            let temp_number = values.phone_notify_number.replace(/\D/g, '');
            if (temp_number.length == 10) {
              temp_number = temp_number.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '$1-$2-$3');
            } else {
              this.toast.presentToast("Please enter a 10-digit phone number.", 5000);
              return;
            }
            let params = new HttpParams()
              .set("token", this.user.token)
              .set("notify_prefs_changed", "true")
              .set("phone_notify_number", temp_number)
              .set("text_notify_number", this.user.preferences.text_notify_number)
              .set("email_notify", this.user.preferences.email_notify)
              .set("phone_notify", this.user.preferences.phone_notify)
              .set("text_notify", this.user.preferences.text_notify)
              .set("v", "5");
            this.user.update_preferences(params, null);
            return;
          } else {
            this.toast.presentToast("New number matches current number. Enter a new number or press Cancel to cancel.", 5000);
            return false;
          }
        }
      }]
    });
    await alert.present();
  }

  async update_text_notify_number() {
    const alert = await this.alertController.create({
      header: 'Change Text Notify Number',
      message: "Enter a new phone number where you'd like to receive text notifications.",
      inputs: [{
        name: 'text_notify_number',
        type: 'tel',
        placeholder: '231-111-1111',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (values: any) => {
          if (values.text_notify_number != this.user.preferences.text_notify_number) {
            let temp_number = values.text_notify_number.replace(/\D/g, '');
            if (temp_number.length == 10) {
              temp_number = temp_number.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '$1-$2-$3');
            } else {
              this.toast.presentToast("Please enter a 10-digit phone number.", 5000);
              return;
            }
            let params = new HttpParams()
              .set("token", this.user.token)
              .set("notify_prefs_changed", "true")
              .set("phone_notify_number", this.user.preferences.phone_notify_number)
              .set("text_notify_number", temp_number)
              .set("email_notify", this.user.preferences.email_notify)
              .set("phone_notify", this.user.preferences.phone_notify)
              .set("text_notify", this.user.preferences.text_notify)
              .set("v", "5");
            this.user.update_preferences(params, null);
            return;
          } else {
            this.toast.presentToast("New number matches current number. Enter a new number or press Cancel to cancel.", 5000);
            return false;
          }
        }
      }]
    });
    await alert.present();
  }

  async toggle_notify_method(event: any) {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("notify_prefs_changed", "true")
      .set("phone_notify_number", this.user.preferences.phone_notify_number)
      .set("text_notify_number", this.user.preferences.text_notify_number)
      .set(event.target.id, event.detail.checked.toString())
      .set("v", "5");
    if (event.target.id == "email_notify") {
      params = params.append("phone_notify", this.user.preferences.phone_notify);
      params = params.append("text_notify", this.user.preferences.text_notify);
    } else if (event.target.id == "phone_notify") {
      params = params.append("email_notify", this.user.preferences.email_notify);
      params = params.append("text_notify", this.user.preferences.text_notify);
    } else if (event.target.id == "text_notify") {
      params = params.append("phone_notify", this.user.preferences.phone_notify);
      params = params.append("email_notify", this.user.preferences.email_notify);
    }
    this.user.update_preferences(params, null);
  }


  ngOnInit() {
    if (this.user.token) {
      this.user.get_preferences();
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
