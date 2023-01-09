import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public about: string | null;

  constructor(
    public globals: Globals,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.about = this.activatedRoute.snapshot.paramMap.get('id')
  }

}
