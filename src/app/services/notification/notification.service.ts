import { Injectable } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Word } from '../../models/word.model';
import { Storage } from '@ionic/storage';
import { COLLECTIONS, DATES_TO_REPEAT } from 'src/app/configs';
import { FirestoreService } from '../firestore/firestore.service';
import { Store } from '@ngrx/store';
import { State, getAllWordsState } from 'src/app/app.reducer';
import { take, skip } from 'rxjs/operators';
import { UpdateWord, PayloadData } from 'src/app/state/words/words.actions';
// tslint:disable: max-line-length

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private localNotifications: LocalNotifications,
    private storage: Storage,
    private firestoreService: FirestoreService,
    private store: Store<State>
  ) { }

  public initNotificationListener() {
    this.localNotifications.on('trigger')
        .subscribe(async notification => {
          const { data } = notification;
          const { kind } = data;

          if (kind === 'custom') {
            await this.updateCustomWord(data);
          } else if (kind === 'phrasal') {
            await this.updatePrasalWord(data);
          }
        });
  }

  public async updateCustomWord(data) {
    const today = new Date();
    try {
      let state = await this.store.select(getAllWordsState).pipe(take(1)).toPromise();

      if (state && !state.length) {
        state = await this.store.select(getAllWordsState).pipe(skip(1), take(1)).toPromise();
      }

      const { word: { id, date, en, ua } } = data;

      let groupIndex, itemIndex;

      for (let i = 0; i < state.length; i++) {
        for (let k = 0; k < state[i].words.length; k++) {
          if (state[i].words[k].id === id) {
            groupIndex = i;
            itemIndex = k;
            break;
          }
        }

        if (groupIndex && itemIndex) {
          break;
        }
      }

      const editedStatuses = state[groupIndex].words[itemIndex].repeatDates.map(el => {
        if ((el.date.getFullYear() === today.getFullYear() &&
            el.date.getMonth() === today.getMonth() &&
            el.date.getDate() === today.getDate()) ||
            (el.date.getFullYear() < today.getFullYear() ||
            el.date.getMonth() < today.getMonth() ||
            el.date.getDate() < today.getDate())) {
            el.status = true;
        }
        return el;
      });

      const editedCount = editedStatuses.reduce((acc, cur) => cur.status ? acc + 1 : acc, 0);

      this.store.dispatch(new UpdateWord(new PayloadData(groupIndex, itemIndex, new Word(id, en, ua, date, editedStatuses, editedCount))));

      this.firestoreService.updateDocument(id, en, ua, editedStatuses, editedCount);

      setTimeout(() => {
        this.localNotifications.getAll().then(notifications => this.storage.set(COLLECTIONS.NOTIFICATIONS, notifications));
      }, 1000);

    } catch ({ message }) {
      this._catchError(message);
    }
  }

  public async updatePrasalWord(data) {
    try {
      const today = new Date();

      const { word: { id, repeatDates }, collection } = data;

      const editedStatuses = repeatDates.map(el => {
        el.date = new Date(el.date);
        if ((el.date.getFullYear() === today.getFullYear() &&
            el.date.getMonth() === today.getMonth() &&
            el.date.getDate() === today.getDate()) ||
            (el.date.getFullYear() < today.getFullYear() ||
            el.date.getMonth() < today.getMonth() ||
            el.date.getDate() < today.getDate())) {
            el.status = true;
            console.log(el);
        }
        return el;
      });

      const editedCount = editedStatuses.reduce((acc, cur) => cur.status ? acc + 1 : acc, 0);

      this.firestoreService.updateWordSetStatus(collection, id, editedCount, editedStatuses);
    } catch ({ message }) {
      this._catchError(message);
    }
  }

  public async scheduleNotifications(word: Word, kind: string, collection?: string) {
    const today = new Date();

    for (const day of DATES_TO_REPEAT) {
      const id = today.getTime() + day;

      this.localNotifications.schedule({
        id,
        text: `${ word.en } => ${ word.ua }`,
        trigger: { in: day, unit: ELocalNotificationTriggerUnit.DAY },
        title: 'Time to repeat',
        lockscreen: true,
        foreground: true,
        smallIcon: 'file://assets/notification_icon.png',
        autoClear: false,
        data: {
          word,
          kind,
          collection
        }
      });
    }

    setTimeout(() => {
      this.localNotifications.getAll().then(notifications => this.storage.set(COLLECTIONS.NOTIFICATIONS, notifications));
    }, 1000);
  }

  private async _catchError(message) {
    console.log(message);
    const user = await this.storage.get('user_uid');
    await this.firestoreService.addDocument({ user, message, date: new Date() }, COLLECTIONS.ERRORS);
  }

}
