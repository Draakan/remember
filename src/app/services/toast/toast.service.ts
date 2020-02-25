import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
  ) { }

  public async showToast(message: string, color: string) {
    await (await this.toastController.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
      cssClass: 'customToast',
    })).present();
  }

}
