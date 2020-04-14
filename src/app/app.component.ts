import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { NotificationService } from './services/notification/notification.service';
import { LoaderService } from './services/loader/loader.service';
import { NetworkService } from './services/network/network.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { Storage } from '@ionic/storage';

import { COLLECTIONS } from './configs';

// tslint:disable: variable-name

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private _statusBarColor: string = '#ec5252';

  constructor(
    public loaderService: LoaderService,
    public appVersion: AppVersion,
    private menuCtrl: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationService: NotificationService,
    private backgroundMode: BackgroundMode,
    private screenOrientation: ScreenOrientation,
    private networkService: NetworkService,
    private localNotifications: LocalNotifications,
    private storage: Storage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(_ => {
      this.notificationService.initNotificationListener();
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      try {
        this.localNotifications.getAll().then(async n => {
          const cachedNotifications = await this.storage.get(COLLECTIONS.NOTIFICATIONS);

          if (cachedNotifications) {
            const diff = this._arrayDiffByKey('id', n, cachedNotifications);

            for (const notification of diff) {
              const data = JSON.parse(notification.data);

              const { kind } = data;

              if (kind === 'custom') {
                await this.notificationService.updateCustomWord(data);
              } else if (kind === 'phrasal') {
                await this.notificationService.updatePrasalWord(data);
              }
            }

            await this.storage.set(COLLECTIONS.NOTIFICATIONS, n);
          }
        });
      } catch (e) {
        console.log(e);
      }

      this.splashScreen.hide();
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString(this._statusBarColor);
      this.networkService.initNetworkListener();
      this.backgroundMode.enable();
    });
  }

  onMenuItemClick() {
    this.menuCtrl.close();
  }

  private _arrayDiffByKey(key, ...arrays) {
    return [].concat(...arrays.map((arr, i) => {
        const others = arrays.slice(0);
        others.splice(i, 1);
        const unique = [...new Set([].concat(...others))];
        return arr.filter(x => !unique.some(y => x[key] === y[key]));
    }));
}
}
