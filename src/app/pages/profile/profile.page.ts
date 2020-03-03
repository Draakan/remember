import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage {

  public title: string = 'Profile';

  constructor(
    private auth: AuthService,
    public firestoreService: FirestoreService,
  ) {}

  public getDate(seconds) {
    return new Date(seconds * 1000);
  }

  public signOut() {
    this.auth.signOut();
  }

}
