import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Word } from 'src/app/models/word.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {

  @Input() word: Word;

  public title: string = 'Details';

  constructor(
    private modalCtrl: ModalController,
  ) { }

  public async close() {
    await this.modalCtrl.dismiss();
  }

}
