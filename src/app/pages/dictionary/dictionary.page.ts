import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Group } from '../../models/group.model';
import { Word } from '../../models/word.model';

import { ToastService } from '../../services/toast/toast.service';
import { NotificationService } from '../../services/notification/notification.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ModalService } from '../../services/modal/modal.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: 'dictionary.page.html',
  styleUrls: ['dictionary.page.scss']
})
export class DictionaryPage implements OnInit, AfterViewInit {

  @ViewChild('content') content;

  public groupedWords: Group[] = [];

  public isLoadingData: boolean = false;
  public isEditingData: boolean = false;
  public isLoggedOutUser: boolean = false;

  public selectedId: string = '';
  public searchValue: string = '';

  constructor(
    private toastService: ToastService,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private modalService: ModalService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.init();

    this.authService.onLoggedOutUser$
        .subscribe(value => {
          if (value) {
            this.groupedWords = [];
          }

          this.isLoggedOutUser = value;
        });
  }

  async ionViewWillEnter() {
    if (this.isLoggedOutUser) {
      await this.init();
      this.authService.onLoggedOutUser$.next(false);
    }
  }

  ngAfterViewInit() {
    this.loaderService.preload.next(false);
  }

  public async init() {
    this.isLoadingData = true;
    this.groupedWords = await (await this.firestoreService.getData()).toPromise();
    await this.firestoreService.getUsersInfo();
    setTimeout(() => {
      this.isLoadingData = false;
    }, 350);
  }

  public async onAddButtonClick() {
    const modal = await this.modalService.openModal();
    let { data: { en, ua } } = await modal.onDidDismiss();

    if (en && ua) {
      const loading = await this.loaderService.showLoader();

      en = en.trim();
      ua = ua.trim();

      const word = { en, ua, date: new Date() };

      try {
        const { id } = await this.firestoreService.addDocument(word);

        const newWord = new Word(id, en, ua, new Date());
        const head = this.groupedWords[0];

        if (this.groupedWords.length &&
            newWord.date.getDay() === new Date(head.date).getDay() &&
            newWord.date.getMonth() === new Date(head.date).getMonth()) {
            head.words.push(newWord);
        } else {
          const newWordsArray: Word[] = [];
          newWordsArray.push(newWord);
          const newGroup = new Group(new Date().toString(), newWordsArray);
          this.groupedWords.unshift(newGroup);
        }

        this.scheduleNotifications(newWord);
        await loading.dismiss();
        await this.showToast('New word has been added', 'success');
      } catch (err) {
        console.log(err);
        await this.showToast('Server error', 'danger');
      }
    }
  }

  public async onItemEdit(idToEdit: string, groupIndex: number, itemIndex: number) {
    try {
      const selectedWords = this.groupedWords[groupIndex].words;
      const { id, date, en: enToEdit, ua: uaToEdit } = selectedWords[itemIndex];

      const modal = await this.modalService.openModal(enToEdit, uaToEdit);

      let { data: { en, ua } } = await modal.onDidDismiss();

      if (en && ua) {
        this.selectedId = id;
        this.isEditingData = true;

        en = en.trim();
        ua = ua.trim();

        await this.firestoreService.updateDocument(idToEdit, en, ua);

        this.groupedWords[groupIndex].words = [
          ...selectedWords.slice(0, itemIndex),
          { id, en, ua, date: new Date(date) },
          ...selectedWords.slice(itemIndex + 1),
        ];
        this.isEditingData = false;
        await this.showToast('Word has been updated', 'warning');
      }
    } catch (err) {
      console.log(err);
      await this.showToast('Server error', 'danger');
    }
  }

  public async onItemRemove(id: string, groupIndex: number, itemIndex: number) {
    try {
      this.selectedId = id;
      this.isEditingData = true;

      await this.firestoreService.deleteDocument(id);

      this.groupedWords[groupIndex].words.splice(itemIndex, 1);

      if (this.groupedWords[groupIndex].words.length === 0) {
        this.groupedWords.splice(groupIndex, 1);
      }

      this.isEditingData = false;
      await this.showToast('Word has been deleted', 'danger');
    } catch (err) {
      console.log(err);
      await this.showToast('Server error', 'danger');
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

  public async showToast(message: string, color: string) {
    await this.toastService.showToast(message, color);
  }

}
