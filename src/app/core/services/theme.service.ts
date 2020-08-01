import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ThemeService {
  private _darkTheme = new Subject<boolean>();
  isTasksTheme = this._darkTheme.asObservable();

  setDarkTheme(isTasksTheme: boolean): void {
    this._darkTheme.next(isTasksTheme);
  }
}