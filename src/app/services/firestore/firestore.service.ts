import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { Word } from '../../models/word.model';
import { Group } from '../../models/group.model';

import { take, map } from 'rxjs/operators';
import { groupBy } from 'underscore';
import { COLLECTIONS } from 'src/app/configs';

// tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private user: Promise<any>;

  private _user_uid: string = '';

  constructor(
    private db: AngularFirestore,
    private storage: Storage,
  ) { }

  public async getData() {
    this._user_uid = await this.storage.get('user_uid');
    return this.db.collection<any>(this._user_uid)
        .snapshotChanges()
        .pipe(
          take(1),
          map(data => data.map(doc => {
            const { en, ua, date: { seconds } } = doc.payload.doc.data();
            const { id } = doc.payload.doc;
            const unixToDate = new Date(seconds * 1000);
            const newDateStr = `${ unixToDate.getFullYear() }-${ unixToDate.getMonth() + 1 }-${ unixToDate.getDate() }`;
            return new Word(id, en, ua, new Date(newDateStr));
          })),
          map(words => {
            const array: Group[] = [];

            for (const [key, value] of Object.entries(groupBy(words, 'date'))) {
              array.push(new Group(key, value));
            }

            array.sort((a, b) => (new Date(a.date) < new Date(b.date)) ? 1 : ((new Date(b.date) < new Date(a.date)) ? -1 : 0));

            return [...array];
          }));
  }

  public async getUsersInfo() {
    this.user = new Promise(async res => {
      res((await this.db.firestore.collection(`${ COLLECTIONS.USERS }`).doc(this._user_uid).get()).data());
    });
  }

  public get user$() {
    return this.user;
  }

  public async addDocument(data, collection?) {
    return await this.db.collection<any>(collection ? collection : this._user_uid).add({ ...data });
  }

  public async updateDocument(id: string, en, ua) {
    return await (await this.db.doc<Word>(`${ this._user_uid }/${ id }`)).update({ en, ua });
  }

  public async deleteDocument(id: string) {
    return await this.db.collection(this._user_uid).doc(id).delete();
  }
}
