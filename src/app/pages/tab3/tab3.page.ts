import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

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
