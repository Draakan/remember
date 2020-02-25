import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    public alertCtrl: AlertController,
  ) { }

  public async openAlert(action: string, handler) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: `Do you want to ${action} it?`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler
        }
      ]
    });
    await alert.present();
    return alert;
  }
}
