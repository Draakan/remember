import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { shuffle } from 'underscore';
import { Word } from 'src/app/models/word.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { isEqual } from 'underscore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {

  @Input() word: any;

  public title: string = 'Details';
  public buttons: any[] = [];

  constructor(
    private modalCtrl: ModalController,
  ) { }

  public async close() {
    await this.modalCtrl.dismiss();
  }

  public async practice() {
    const splitted = this.word.en.split('');

    this.buttons = shuffle(splitted);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.buttons, event.previousIndex, event.currentIndex);

    console.log(isEqual(this.buttons, this.word.en.split('')))
  }

  /* public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  } */

}
