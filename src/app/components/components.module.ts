import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';

import { ModalComponent } from './modal/modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
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
    IonicModule,
    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ModalComponent,
    LoginComponent,
    RegisterComponent,
    DetailComponent,
  ]
})
export class ComponentsModule { }
