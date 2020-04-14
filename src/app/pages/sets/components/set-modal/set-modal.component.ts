import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { WordSet } from 'src/app/models/set';
import { TOAST_COLORS, DATES_TO_REPEAT } from 'src/app/configs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DetailComponent } from 'src/app/components/detail/detail.component';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-set-modal',
  templateUrl: './set-modal.component.html',
  styleUrls: ['./set-modal.component.scss'],
})
export class SetModalComponent implements OnInit {

  @Input() name: string = '';

  public wordsOfSet: WordSet[] = [];

  public isLoading: boolean = false;
  public isLoadingAllWords: boolean = true;

  public selectedId: string = '';

  constructor(
    private modalCtrl: ModalController,
    private firestoreService: FirestoreService,
    private toastService: ToastService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    public tts: TextToSpeech,
  ) { }

  async ngOnInit() {
    this.wordsOfSet = await this.firestoreService.getSet(this.name);
    this.isLoadingAllWords = false;
  }

  public async speak(word: string) {
    await this.tts.speak({
      text: word,
      rate: 0.9
    });
  }

  public onItemClick(wordSet: WordSet) {
    if (!wordSet.isLearn) {
      this.toastService.showToast('At first you have to learn this word', TOAST_COLORS.WARNING);
      return;
    } else {
      this.modalService.openComponent(DetailComponent, { word: wordSet });
    }
  }

  public async toLearn(wordSet: WordSet) {
    try {
      this.selectedId = wordSet.id;
      this.isLoading = true;

      const today = new Date(), repeatDates = [];

      for (const day of DATES_TO_REPEAT) {
        repeatDates.push({
          status: false,
          date:  new Date(today.getFullYear(), today.getMonth(), today.getDate() + day)
        });
      }

      this.selectedId = '';
      this.isLoading = false;

      wordSet.isLearn = true;
      wordSet.repeatDates = repeatDates;

      await this.firestoreService.updateWordSet(this.name, wordSet.id, true, repeatDates);

      this.toastService.showToast('Word has been updated', TOAST_COLORS.SUCCESS);

      this.notificationService.scheduleNotifications(wordSet, 'phrasal', this.name);
    } catch (err) {
      console.log(err);
      this.toastService.showToast('Server error', TOAST_COLORS.DANGER);
    }
  }

  public async close() {
    await this.modalCtrl.dismiss();
  }

}
