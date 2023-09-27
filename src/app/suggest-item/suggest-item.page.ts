import { Component, OnInit } from '@angular/core';
import { Events } from '../services/event.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-suggest-item',
  templateUrl: './suggest-item.page.html',
  styleUrls: ['./suggest-item.page.scss'],
})
export class SuggestItemPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public toast: ToastService,
    private http: HttpClient,
  ) { }

  item_title: string;
  author_name: string;
  preferred_format: string;
  show_confirmation: boolean = false;
  suggest_item_url = 'https://catalog.tadl.org/main/suggest_an_item.json'
  patron_name: string = this.user.full_name; 
  patron_email: string = this.user.preferences.email;
  patron_card: string = this.user.card;

  async submit_suggestion() {
    const data = {
      title: this.item_title,
      author: this.author_name,
      item_format: this.preferred_format,
      patron_name: this.patron_name,
      patron_email: this.patron_email,
      card_number: this.patron_card,
    };

    try {
      const response = await this.http.post(this.suggest_item_url, data).toPromise();
      this.show_confirmation = true;
    } catch (error) {
      const toast = await this.toast.presentToast('Error submitting suggestion. Please try again.', 5000);
    }
  }

  reset_form() {
    this.item_title = '';
    this.author_name = '';
    this.preferred_format = '';
    this.show_confirmation = false;
  }



  ngOnInit() {
  }

}
