import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { User } from '../user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public home: string | null;

  constructor(
    public globals: Globals,
    public user: User,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.home = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
