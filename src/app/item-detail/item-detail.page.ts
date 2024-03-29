import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { User } from '../user';
import { Events } from '../services/event.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: any;
  items: string;

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
  ) { }

  place_hold_from_details(){
    this.user.place_hold(this.item.id, 'false')
    let subscription = this.events.subscribe('process_holds_complete', () => {
      this.item = this.user.holds.find( hold => hold['id'] == this.item['id']);
      subscription.unsubscribe();
   });
  }

  showContents(item: any) {
    var output = '';
    if (item.contents_array[1] == null) {
      output = item.contents;
    } else {
      output = item.contents_array.join('</p><p>');
    }
    return output;
  }

  showAbstract(item: any) {
    var output = '';
    if (item.abstract_array[1] == null) {
      output = item.abstract;
    } else {
      output = item.abstract_array.join('</p><p>');
    }
    return output;
  }

  renew_from_details(){
    this.user.renew(this.item.checkout_id)
    const subscription = this.events.subscribe('renew_attempt_complete', () => {
      this.item = this.user.checkouts.find( checkout => checkout['id'] == this.item['id']);
      console.log('I fired')
      subscription.unsubscribe();
    });
  }

  manage_hold_from_details(task: any){
    this.user.manage_hold(this.item, task)
    let subscription = this.events.subscribe('manage_hold_complete', () => {
      this.item = this.user.holds.find( hold => hold['id'] == this.item['id']);
      console.log('I fired to actually cancel')
      subscription.unsubscribe();
   });
  }

  cancel_hold_from_details(){
    this.user.cancel_hold(this.item)
    let subscription = this.events.subscribe('manage_hold_complete', () => {
      this.item.hold_id = this.user.holds.find( hold => hold['id'] == this.item['id']);
      console.log('I fired to cancel')
      subscription.unsubscribe();
   });
  }

  ngOnInit() {
    this.items = this.item.availability.copies_all_available > 0 ? 'Available' : 'All Copies';
  }

}
