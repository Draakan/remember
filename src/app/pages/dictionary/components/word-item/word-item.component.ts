import { Component, ChangeDetectionStrategy, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { AlertService } from '../../../../services/alert/alert.service';
import { Word } from '../../../../models/word.model';

@Component({
  selector: 'app-word-item',
  templateUrl: './word-item.component.html',
  styleUrls: ['./word-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordItemComponent implements DoCheck {
  static checkCounter: number = 0;

  @Input() word: Word;

  @Output() itemEdit = new EventEmitter<string>();
  @Output() itemRemove = new EventEmitter<string>();

  localCounter: number = 0;

  constructor(
    private alertService: AlertService,
    public tts: TextToSpeech,
  ) { }

  ngDoCheck() {
    this.localCounter = WordItemComponent.checkCounter;
    WordItemComponent.checkCounter++;
  }

  public async speak(word: string) {
    await this.tts.speak({
      text: word,
      rate: 0.9
    });
  }

  public onItemEdit(id: string) {
    this.itemEdit.emit(id);
  }

  public async onItemRemove(id: string) {
    await this.alertService.openAlert('delete', () => this.itemRemove.emit(id));
  }

}
