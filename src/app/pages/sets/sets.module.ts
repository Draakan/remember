import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'src/app/layout/layout.module';
import { FormsModule } from '@angular/forms';

import { SetsPage } from './sets.page';
import { SetModalComponent } from './components/set-modal/set-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    RouterModule.forChild([{ path: '', component: SetsPage }])
  ],
  declarations: [
    SetsPage,
    SetModalComponent,
  ],
  entryComponents: [
    SetModalComponent,
  ]
})
export class SetsPageModule {}
