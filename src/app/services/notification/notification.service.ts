import { Injectable } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Word } from '../../models/word.model';
import { Storage } from '@ionic/storage';
import { COLLECTIONS } from 'src/app/configs';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private localNotifications: LocalNotifications,
    private storage: Storage,
    private firestoreService: FirestoreService,
  ) { }

  public initNotificationListener() {
    this.localNotifications.on('trigger')
        .subscribe(async data => {
          const { id, data: { wordId } } = data;
          const date = new Date();
          const user = await this.storage.get('user_uid');
          await this.firestoreService.addDocument({ id, date, wordId, user }, COLLECTIONS.NOTIFICATIONS);
        });
  }

  public scheduleNotifications(word: Word) {
    for (const day of [1, 3, 5]) {
      this.localNotifications.schedule({
        id: new Date().getTime() + day,
        text: `${ word.en } => ${ word.ua }`,
        trigger: { in: day, unit: ELocalNotificationTriggerUnit.DAY },
        title: 'Time to repeat',
        foreground: true,
        lockscreen: true,
        smallIcon: 'file://assets/notification_icon.png',
        autoClear: false,
        data: {
          wordId: word.id
        }
      });
    }
  }

}
