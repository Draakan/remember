import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() en: string = '';
  @Input() ua: string = '';

  public form: FormGroup;

  public title: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.title = this.en && this.ua ? 'Change word' : 'Add new word';
    this.form = new FormGroup({
      en: new FormControl(this.en, [Validators.required, Validators.minLength(2)]),
      ua: new FormControl(this.ua, [Validators.required, Validators.minLength(2)])
    });
   }

  public async close() {
    await this.modalCtrl.dismiss({ en: '', ua: '' });
  }

  public async onFormSubmit() {
    await this.modalCtrl.dismiss(this.form.value);
  }
}
