import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/layout/layout.module';
import { ChartsModule } from 'ng2-charts';

import { StatiscticsPage } from './statistics.page';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';

@NgModule({
  declarations: [StatiscticsPage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    SpinnerModule,
    RouterModule.forChild([{ path: '', component: StatiscticsPage }]),
    ChartsModule,
  ],
})
export class StatiscticsPageModule {}
