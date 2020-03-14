import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Storage } from '@ionic/storage';
import { Word } from '../../models/word.model';
import { Group } from '../../models/group.model';

import { take, map } from 'rxjs/operators';
import { groupBy } from 'underscore';
import { COLLECTIONS } from 'src/app/configs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.reducer';
import { SetAllWords } from 'src/app/state/words/words.actions';
import { WordSet } from 'src/app/models/set';

// tslint:disable: variable-name

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private user: Promise<any>;

  private _user_uid: string = '';

  constructor(
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private storage: Storage,
    private store: Store<State>
  ) { }

  public async getData() {
    this._user_uid = await this.storage.get('user_uid');

    this.db.collection<any>(this._user_uid)
        .snapshotChanges()
        .pipe(
          take(1),
          map(data => data.map(doc => {
            const { en, ua, date: { seconds }, repeatDates, count } = doc.payload.doc.data();
            const { id } = doc.payload.doc;

            let dates = [];

            if (repeatDates && repeatDates.length) {
              dates = repeatDates.map(el => {
                return {
                  status: el.status,
                  date: new Date(el.date.seconds * 1000)
                };
              });
            }

            const unixToDate = new Date(seconds * 1000);
            const newDateStr = `${ unixToDate.getFullYear() }-${ unixToDate.getMonth() + 1 }-${ unixToDate.getDate() }`;
            return new Word(id, en, ua, new Date(newDateStr), repeatDates ? dates : undefined, count);
          })),
          map(words => {
            const array: Group[] = [];

            for (const [key, value] of Object.entries(groupBy(words, 'date'))) {
              array.push(new Group(key, value));
            }

            array.sort((a, b) => (new Date(a.date) < new Date(b.date)) ? 1 : ((new Date(b.date) < new Date(a.date)) ? -1 : 0));

            this.store.dispatch(new SetAllWords(array));
          })).toPromise();
  }

  public async getSet(collection: string) {
    return this.db.collection<any>(collection)
        .snapshotChanges()
        .pipe(
          take(1),
          map(data => data.map(doc => {
            const { en, ua, date: { seconds }, repeatDates, count, isLearn, example } = doc.payload.doc.data();
            const { id } = doc.payload.doc;

            let dates = [];

            if (repeatDates && repeatDates.length) {
              dates = repeatDates.map(el => {
                return {
                  status: el.status,
                  date: new Date(el.date.seconds * 1000)
                };
              });
            }

            const unixToDate = new Date(seconds * 1000);
            const newDateStr = `${ unixToDate.getFullYear() }-${ unixToDate.getMonth() + 1 }-${ unixToDate.getDate() }`;
            return new WordSet(id, en, ua, new Date(newDateStr), repeatDates, count, isLearn, example);
          }))).toPromise();
  }

  public async getUsersInfo() {
    let user = JSON.parse(await this.storage.get('user_info'));

    if (user) {
      this.user = Promise.resolve(user);
      return;
    }

    user = (await this.db.firestore.collection(`${ COLLECTIONS.USERS }`).doc(this._user_uid).get()).data();
    this.storage.set('user_info', JSON.stringify(user));
    this.user = Promise.resolve(user);
  }

  public get user$() {
    return this.user;
  }

  public async addDocument(data, collection?) {
    return await this.db.collection<any>(collection ? collection : this._user_uid).add({ ...data });
  }

  public async updateDocument(id: string, en, ua, repeatDates, count) {
    return await (await this.db.doc<Word>(`${ this._user_uid }/${ id }`)).update({ en, ua, repeatDates, count });
  }

  public async updateWordSet(collection: string, id: string, isLearn: boolean, repeatDates) {
    return await (await this.db.doc<WordSet>(`${ collection }/${ id }`)).update({ isLearn, repeatDates });
  }

  public async deleteDocument(id: string) {
    return await this.db.collection(this._user_uid).doc(id).delete();
  }
}
