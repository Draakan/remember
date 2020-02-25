import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Output() search = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  public searchWord(e) {
    const { value } = e.target;

    this.search.emit(value.trim());
  }

  public onCancelClick() {
    this.cancel.emit(true);
  }

}
