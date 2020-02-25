import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public preload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private loadingController: LoadingController,
  ) { }

  get preload$() {
    return this.preload.asObservable();
  }

  public async showLoader() {
    const loading = await this.loadingController.create({
        message: 'Please wait...',
    });

    await loading.present();
    return loading;
  }
}
