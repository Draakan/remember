import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { LayoutModule } from './layout/layout.module';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailComponent } from './components/detail/detail.component';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard, AngularFireAuthGuardModule } from '@angular/fire/auth-guard';

// config
import { firebaseConfig } from './configs';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    LoginComponent,
    RegisterComponent,
    DetailComponent,
  ],
  entryComponents: [
    ModalComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    TextToSpeech,
    BackgroundMode,
    ForegroundService,
    AngularFireAuthGuard,
    Dialogs,
    SpinnerDialog,
    Toast,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
