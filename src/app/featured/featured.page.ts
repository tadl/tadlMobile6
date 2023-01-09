import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.page.html',
  styleUrls: ['./featured.page.scss'],
})
export class FeaturedPage implements OnInit {

  constructor(
    public globals: Globals,
  ) { }

  ngOnInit() {
  }

}
