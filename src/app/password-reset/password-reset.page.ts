import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Globals } from '../globals';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  reset_name: string;
  request_sent: boolean = false;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    private http: HttpClient,
  ) { }

  reset_password() {
    let params = new HttpParams()
      .set("user", this.reset_name)
      .set("v", "5");
    let url = this.globals.catalog_password_reset_url;
    this.http.get(url, {params: params})
      .subscribe((data:any) => {
        console.log(data);
        this.request_sent = true;
      },
      (err) => {
        console.log(err);
        this.toast.presentToast(this.globals.server_error_msg);
      });
  }

  ngOnInit() {
  }

}
