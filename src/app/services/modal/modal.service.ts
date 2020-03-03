import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  public async openComponent(comp, data?) {
    const modal = await this.modalCtrl.create({
      component: comp,
      componentProps: { ...data }
    });

    await modal.present();
    return modal;
  }
}
