import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.reducer';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(
    private store: Store<{ ui: State }>,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    /* this.store.dispatch({ type: 'START_LOADING' }); */
  }

}
