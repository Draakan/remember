import { Injectable } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialogs: Dialogs
  ) { }

  public async openAlert(action: string) {
    return await this.dialogs.confirm(
      `Do you want to ${action} it?`,
      'Confirm'
    );
  }
}
