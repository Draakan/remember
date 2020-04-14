import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class SpinnerModule { }
