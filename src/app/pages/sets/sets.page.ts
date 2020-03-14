import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Iterable } from 'src/app/models/iterable';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SetModalComponent } from './components/set-modal/set-modal.component';

@Component({
  selector: 'app-sets',
  templateUrl: 'sets.page.html',
  styleUrls: ['sets.page.scss']
})
export class SetsPage implements OnInit {

  public title: string = 'Sets';

  /* public iterableObject = new IterableObject('maksim', 25); */

  public sets: any[] = [
    { name: 'break', number: 9 },
    { name: 'bring', number: 3 },
    { name: 'call', number: 7 },
    { name: 'come', number: 9 },
    { name: 'cut', number: 2 },
    { name: 'get', number: 6 },
    { name: 'give', number: 5 },
    { name: 'go', number: 7 },
    { name: 'keep', number: 8 },
    { name: 'let', number: 10 },
    { name: 'look', number: 3 },
    { name: 'make', number: 4 },
    { name: 'pull', number: 5 },
    { name: 'put', number: 6 },
    { name: 'run', number: 9 },
    { name: 'set', number: 5 },
    { name: 'stand', number: 4 },
    { name: 'stay', number: 3 },
    { name: 'take', number: 2 },
    { name: 'turn', number: 3 },
  ];

  constructor(
    private loaderService: LoaderService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.loaderService.preload.next(false);
    /* for (const { key, value } of this.iterableObject) {
      console.log(key, value);
    } */
  }

  public async onSetClick(name: string) {
    const modal = await this.modalService.openComponent(SetModalComponent, { name });
  }

}

class IterableObject extends Iterable {
  constructor(public name: string, public age: number) {
    super();
  }
}
