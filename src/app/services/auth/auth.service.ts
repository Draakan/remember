import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';

import { User } from '../../models/user.model';

import { COLLECTIONS } from '../../configs';

import { Store } from '@ngrx/store';
import { State } from 'src/app/app.reducer';
import { SetLogouted } from 'src/app/state/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private store: Store<State>,
    private storage: Storage,
  ) { }

  public async signInWithEmailAndPassword({ email, password }) {
    try {
      const { user: { uid } } = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      await this.storage.set('user_uid', uid);
      return 'ok';
    } catch {
      return 'fail';
    }
  }

  public async SignUp({ name, date, email, password }) {
    try {
      const { user } = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await this.updateUserData(user, name, date);
      return 'ok';
    } catch {
      return 'fail';
    }
  }

  private async updateUserData(user, name: string, date: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`${ COLLECTIONS.USERS }/${ user.uid }`);

    const data = {
      uid: user.uid,
      email: user.email,
      name,
      date: new Date(date),
    };

    await this.storage.set('user_uid', user.uid);

    return await userRef.set(data, { merge: true });
  }

  public async signOut() {
    this.store.dispatch( new SetLogouted());
    this.router.navigate(['/login']);
    await this.afAuth.auth.signOut();
    await this.storage.clear();
  }

}
