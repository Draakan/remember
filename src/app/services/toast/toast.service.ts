import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toast: Toast
  ) { }

  public showToast(message: string, color?: string) {
    this.toast.showWithOptions({
      message,
      duration: 2000,
      position: 'bottom',
      styling: {
        backgroundColor: color,
        textColor: '#FFFFFF',
        opacity: 1
      }
    }).toPromise();
  }

}
