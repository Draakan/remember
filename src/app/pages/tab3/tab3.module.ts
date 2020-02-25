import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/layout/layout.module';

import { Tab3Page } from './tab3.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
