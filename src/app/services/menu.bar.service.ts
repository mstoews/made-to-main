import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuBarService {
  showBar: boolean;
  public uploadMenuState = new EventEmitter<any>();
  setBar() {
    if (this.showBar === undefined || this.showBar === true) {
      this.showBar = false;
    } else {
      this.showBar = true;
    }

    this.uploadMenuState.emit(this.showBar);
  }
  public getBarState(): boolean {
    return this.showBar;
  }
}

