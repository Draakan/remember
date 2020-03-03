import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Group } from '../../models/group.model';
import { Word } from '../../models/word.model';

import { ToastService } from '../../services/toast/toast.service';
import { NotificationService } from '../../services/notification/notification.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ModalService } from '../../services/modal/modal.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StartLoadingWords, StopLoadingWords } from '../../state/ui/ui.actions';
import { SetLogined } from '../../state/auth/auth.actions';
import { CreateWord, UpdateWord, PayloadData, SetAllWords, DeleteWord } from 'src/app/state/words/words.actions';

import { State, getIsLoading, getIsAuthState, getAllWordsState } from '../../app.reducer';
import { skip } from 'rxjs/operators';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { DetailComponent } from 'src/app/components/detail/detail.component';

// tslint:disable: variable-name

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss'],
  animations: [
    trigger('changeVisibility', [
      state('initial', style({
        opacity: 0,
      })),
      state('final', style({
        opacity: 1
      })),
      transition('initial=>final', animate('2500ms ease-in'))
    ]),
    trigger('changeVisibilitySearch', [
      state('initial', style({
        opacity: 0,
      })),
      state('final', style({
        opacity: 1
      })),
      transition('initial=>final', animate('4000ms'))
    ]),
    trigger('changeVisibilitySpinner', [
      state('initial', style({
        opacity: 1,
      })),
      state('final', style({
        opacity: 0,
        display: 'none'
      })),
      transition('initial=>final', animate('2000ms'))
    ]),
  ]
})
export class DictionaryPage implements OnInit {

  @ViewChild('content') content;

  public groupedWordsAsync: Observable<Group[]>;

  public isLoadingData$: Observable<boolean>;

  public isLoadingData: boolean = false;
  public isEditingData: boolean = false;
  public isLoggedOutUser: boolean = false;

  public selectedId: string = '';
  public searchValue: string = '';
  public animationState: string = 'initial';
  public animationStateSearch: string = 'initial';
  public animationStateSpinner: string = 'initial';

  constructor(
    private toastService: ToastService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private firestoreService: FirestoreService,
    private spinnerDialog: SpinnerDialog,
    private store: Store<State>
  ) {}

  async ngOnInit() {
    this.init();
    this.isLoadingData$ = this.store.select(getIsLoading);
    this.store.select(getAllWordsState).pipe(skip(1))
        .subscribe(_ => {
          this.animationState = 'final';
          this.animationStateSearch = 'final';
          this.animationStateSpinner = 'final';
        });

    this.store.select(getIsAuthState)
        .subscribe(value => {
          if (value) {
            this.store.dispatch(new SetAllWords([]));
          }
          this.isLoggedOutUser = value;
        });
  }

  async ionViewWillEnter() {
    if (this.isLoggedOutUser) {
      await this.init();
      this.store.dispatch(new SetLogined());
    }
  }

  public async init() {
    this.store.dispatch(new StartLoadingWords());
    this.loaderService.preload.next(false);
    await this.firestoreService.getData();
    this.firestoreService.getUsersInfo();
    this.groupedWordsAsync = this.store.select(getAllWordsState).pipe(skip(1));
    this.store.dispatch(new StopLoadingWords());
  }

  public async onAddButtonClick() {
    const modal = await this.modalService.openComponent(ModalComponent);
    let { data: { en, ua } } = await modal.onDidDismiss();

    if (en && ua) {
      this.spinnerDialog.show(null, 'Please wait...', true);

      en = en.trim();
      ua = ua.trim();

      const today = new Date();

      const repeatDates = [
        {
          status: false,
          date:  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        },
        {
          status: false,
          date:   new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
        },
        {
          status: false,
          date:  new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
        }
      ];

      const wordToSave = { en, ua, date: new Date(), repeatDates, count: 0 };

      try {
        const { id } = await this.firestoreService.addDocument(wordToSave);

        const newWord = new Word(id, en, ua, new Date(), repeatDates, 0);

        this.store.dispatch(new CreateWord(newWord));

        this.scheduleNotifications(newWord);

        this.spinnerDialog.hide();
        this.showToast('New word has been added', '#10dc60');
      } catch (err) {
        console.log(err);
        this.showToast('Server error', '#ec5252');
      }
    }
  }

  public async onItemEdit(word: Word, groupIndex: number, itemIndex: number) {
    try {
      const { id, date, en: enToEdit, ua: uaToEdit, repeatDates, count } = word;

      const modal = await this.modalService.openComponent(ModalComponent, { en: enToEdit, ua: uaToEdit });

      let { data: { en, ua } } = await modal.onDidDismiss();

      if (en && ua) {
        this.selectedId = id;
        this.isEditingData = true;

        en = en.trim();
        ua = ua.trim();

        await this.firestoreService.updateDocument(id, en, ua, repeatDates, count);

        this.store.dispatch(new UpdateWord(new PayloadData(groupIndex, itemIndex, new Word(id, en, ua, date, repeatDates, count))));

        this.isEditingData = false;
        this.showToast('Word has been updated', '#ffce00');
      }
    } catch (err) {
      console.log(err);
      this.showToast('Server error', '#ec5252');
    }
  }

  public async onItemRemove(id: string, groupIndex: number, itemIndex: number) {
    try {
      this.selectedId = id;
      this.isEditingData = true;

      await this.firestoreService.deleteDocument(id);

      this.store.dispatch(new DeleteWord(new PayloadData(groupIndex, itemIndex)));

      this.isEditingData = false;
      this.showToast('Word has been deleted', '#ec5252');
    } catch (err) {
      console.log(err);
      this.showToast('Server error', '#ec5252');
    }
  }

  public onItemClick(word: Word) {
    if (word.repeatDates && word.repeatDates.length) {
      this.modalService.openComponent(DetailComponent, { word });
    }
  }

  public onSearch(query) {
    this.searchValue = query;
  }

  public onCancelSearch() {
    this.searchValue = '';
  }

  public getVisibilityWord(word: string) {
    return word.indexOf(this.searchValue) > -1;
  }

  public getVisibilityGroup(group: Group) {
    const allValues = [];

    for (const { en } of group.words) {
      allValues.push(this.getVisibilityWord(en));
    }

    return allValues.some(el => el === true);
  }

  public scheduleNotifications(word: Word) {
    this.notificationService.scheduleNotifications(word);
  }

  public showToast(message: string, color: string) {
    this.toastService.showToast(message, color);
  }

}
