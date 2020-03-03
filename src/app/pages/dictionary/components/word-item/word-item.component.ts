import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { AlertService } from '../../../../services/alert/alert.service';
import { Word } from '../../../../models/word.model';

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordItemComponent {

  @Input() word: Word;

  @Output() itemEdit = new EventEmitter<Word>();
  @Output() itemClick = new EventEmitter<Word>();
  @Output() itemRemove = new EventEmitter<string>();

  constructor(
    private alertService: AlertService,
    public tts: TextToSpeech,
  ) { }

  public async speak(word: string) {
    await this.tts.speak({
      text: word,
      rate: 0.9
    });
  }

  public onItemEdit(word: Word) {
    this.itemEdit.emit(word);
  }

  public onItemClick(word: Word) {
    this.itemClick.emit(word);
  }

  public async onItemRemove(id: string) {
    const result = await this.alertService.openAlert('delete');

    if (result === 1) {
      this.itemRemove.emit(id);
    }
  }

}
