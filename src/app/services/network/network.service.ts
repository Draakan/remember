import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastService } from '../toast/toast.service';
import { TOAST_COLORS } from 'src/app/configs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.reducer';
import { SetOnline, SetOffline } from 'src/app/state/network/network.actions';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private network: Network,
    private toastService: ToastService,
    private store: Store<State>
  ) {}

  public initNetworkListener() {
    this.network.onConnect()
        .subscribe(_ => {
          this.toastService.showToast('You are online', TOAST_COLORS.SUCCESS);
          this.store.dispatch(new SetOnline());
        });
    this.network.onDisconnect()
        .subscribe(_ => {
          this.toastService.showToast('You are offline', TOAST_COLORS.WARNING);
          this.store.dispatch(new SetOffline());
        });
  }
}
