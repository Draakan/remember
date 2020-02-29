import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public preload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() { }

  get preload$() {
    return this.preload.asObservable();
  }

}
