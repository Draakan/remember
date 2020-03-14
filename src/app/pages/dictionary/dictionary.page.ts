import { Component, OnInit, ViewChild } from '@angular/core';

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

import { State, getIsLoading, getIsAuthState, getAllWordsState, getIsOnlineState } from '../../app.reducer';
import { skip } from 'rxjs/operators';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { DetailComponent } from 'src/app/components/detail/detail.component';

import { TOAST_COLORS, DATES_TO_REPEAT } from 'src/app/configs';
import { Animations } from 'src/app/animations';

// tslint:disable: variable-name

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss'],
  animations: [
    Animations.changeVisibilityDictionary,
    Animations.changeVisibilitySearch,
    Animations.changeVisibilitySpinner,
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

  private isOnline: boolean = true;

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
    this.store.select(getIsOnlineState)
        .subscribe(status => this.isOnline = status);
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
    await this.firestoreService.getData();
    this.loaderService.preload.next(false);
    this.firestoreService.getUsersInfo();
    this.groupedWordsAsync = this.store.select(getAllWordsState).pipe(skip(1));
    this.store.dispatch(new StopLoadingWords());
  }

  public async onAddButtonClick() {
    if (!this.isOnline) {
      this.toastService.showToast('You are offline', TOAST_COLORS.WARNING);
      return;
    }

    const modal = await this.modalService.openComponent(ModalComponent);
    let { data: { en, ua } } = await modal.onDidDismiss();

    if (en && ua) {
      this.spinnerDialog.show(null, 'Please wait...', true);

      en = en.trim();
      ua = ua.trim();

      const today = new Date(), repeatDates = [];

      for (const day of DATES_TO_REPEAT) {
        repeatDates.push({
          status: false,
          date:  new Date(today.getFullYear(), today.getMonth(), today.getDate() + day)
        });
      }

      const wordToSave = { en, ua, date: new Date(), repeatDates, count: 0 };

      try {
        const { id } = await this.firestoreService.addDocument(wordToSave);

        const newWord = new Word(id, en, ua, new Date(), repeatDates, 0);

        this.store.dispatch(new CreateWord(newWord));

        this.scheduleNotifications(newWord);

        this.spinnerDialog.hide();
        this.showToast('New word has been added', TOAST_COLORS.SUCCESS);
      } catch (err) {
        console.log(err);
        this.showToast('Server error', TOAST_COLORS.DANGER);
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
        this.showToast('Word has been updated', TOAST_COLORS.WARNING);
      }
    } catch (err) {
      console.log(err);
      this.showToast('Server error', TOAST_COLORS.DANGER);
    }
  }

  public async onItemRemove(id: string, groupIndex: number, itemIndex: number) {
    try {
      this.selectedId = id;
      this.isEditingData = true;

      await this.firestoreService.deleteDocument(id);

      this.store.dispatch(new DeleteWord(new PayloadData(groupIndex, itemIndex)));

      this.isEditingData = false;
      this.showToast('Word has been deleted', TOAST_COLORS.DANGER);
    } catch (err) {
      console.log(err);
      this.showToast('Server error', TOAST_COLORS.DANGER);
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
    this.notificationService.scheduleNotifications(word, 'custom');
  }

  public showToast(message: string, color: string) {
    this.toastService.showToast(message, color);
  }

}
