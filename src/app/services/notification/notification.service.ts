import { Injectable } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Word } from '../../models/word.model';
import { Storage } from '@ionic/storage';
import { COLLECTIONS } from 'src/app/configs';
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
        .subscribe(async data => {
          const today = new Date();
          try {
            const state = await this.store.select(getAllWordsState).pipe(skip(1), take(1)).toPromise();

            const { id: notificationId, data: { word: { id, date, en, ua } } } = data;

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
              if (el.date.getFullYear() === today.getFullYear() &&
                  el.date.getMonth() === today.getMonth() &&
                  el.date.getDay() === today.getDay()) {
                el.status = true;
              }
              return el;
            });

            const editedCount = editedStatuses.filter(el => el.status === true).length;

            this.store.dispatch(new UpdateWord(new PayloadData(groupIndex, itemIndex, new Word(id, en, ua, date, editedStatuses, editedCount))));

            await this.firestoreService.updateDocument(id, en, ua, editedStatuses, editedCount);

            const user = await this.storage.get('user_uid');
            await this.firestoreService.addDocument({ notificationId, date, id, user }, COLLECTIONS.NOTIFICATIONS);
          } catch ({ message }) {
            console.log(message);
            const user = await this.storage.get('user_uid');
            await this.firestoreService.addDocument({ user, message, date: today }, COLLECTIONS.ERRORS);
          }
        });
  }

  public scheduleNotifications(word: Word) {
    for (const day of [1, 3, 5]) {
      this.localNotifications.schedule({
        id: new Date().getTime() + day,
        text: `${ word.en } => ${ word.ua }`,
        trigger: { in: day, unit: ELocalNotificationTriggerUnit.DAY },
        title: 'Time to repeat',
        lockscreen: true,
        smallIcon: 'file://assets/notification_icon.png',
        autoClear: false,
        data: {
          word
        }
      });
    }
  }

}
