import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  async presentToast(message = "Acknowledged.", duration?:number) {
    let toast_duration = 1500;
    if (duration) {
      toast_duration = duration;
    }
    const toast = await this.toastController.create({
      message: message,
      duration: toast_duration,
      position: 'top',
      icon: 'alert-outline',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        }
      ],
    });
    await toast.present();
  }

}
