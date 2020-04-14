import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from 'src/app/layout/layout.module';
import { DictionaryPage } from './dictionary.page';
import { WordItemComponent } from './components/word-item/word-item.component';
import { SearchComponent } from './components/search/search.component';
import { HideOnscrollModule } from 'ionic-hide-onscroll';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    HideOnscrollModule,
    SpinnerModule,
    RouterModule.forChild([{ path: '', component: DictionaryPage }])
  ],
  declarations: [
    DictionaryPage,
    WordItemComponent,
    SearchComponent,
  ]
})
export class DictionaryModule {}
