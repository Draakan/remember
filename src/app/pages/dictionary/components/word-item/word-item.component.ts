import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { AlertService } from '../../../../services/alert/alert.service';
import { Word } from '../../../../models/word.model';
import { Store } from '@ngrx/store';
import { State, getIsOnlineState } from 'src/app/app.reducer';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TOAST_COLORS } from 'src/app/configs';

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

  private isOnline: boolean = true;

  constructor(
    public tts: TextToSpeech,
    private alertService: AlertService,
    private toastService: ToastService,
    private store: Store<State>
  ) {
    this.store.select(getIsOnlineState)
        .subscribe(status => this.isOnline = status);
  }

  public async speak(word: string) {
    await this.tts.speak({
      text: word,
      rate: 0.9
    });
  }

  public onItemEdit(word: Word) {
    if (!this.isOnline) {
      this.toastService.showToast('You are offline', TOAST_COLORS.WARNING);
      return;
    }

    this.itemEdit.emit(word);
  }

  public onItemClick(word: Word) {
    this.itemClick.emit(word);
  }

  public async onItemRemove(id: string) {
    if (!this.isOnline) {
      this.toastService.showToast('You are offline', TOAST_COLORS.WARNING);
      return;
    }

    const result = await this.alertService.openAlert('delete');

    if (result === 1) {
      this.itemRemove.emit(id);
    }
  }

}
