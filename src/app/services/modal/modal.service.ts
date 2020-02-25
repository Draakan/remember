import { Injectable } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  public async openModal(en?, ua?) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { en, ua }
    });

    await modal.present();
    return modal;
  }
}
