import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/layout/layout.module';

import { ProfilePage } from './profile.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild([{ path: '', component: ProfilePage }])
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
