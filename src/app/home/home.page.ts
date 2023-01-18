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

  query: string;
  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  search() {
    if (this.query) {
      this.router.navigate(['/search', { query: this.query }]);
    }
  }

  ngOnInit() {
  }

}
