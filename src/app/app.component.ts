import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { NotificationService } from './services/notification/notification.service';
import { LoaderService } from './services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private _statusBarColor: string = '#ec5252';

  constructor(
    public loaderService: LoaderService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationService: NotificationService,
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(_ => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString(this._statusBarColor);
      this.splashScreen.hide();
      this.notificationService.initNotificationListener();
      this.backgroundMode.enable();
      this.backgroundMode.moveToForeground();
      this.backgroundMode.disableBatteryOptimizations();
    });
  }
}
