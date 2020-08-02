import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ThemeService {
  private _ticketsTheme = new Subject<boolean>();
  isTicketsTheme = this._ticketsTheme.asObservable();

  setTicketsTheme(isTicketsTheme: boolean): void {
    this._ticketsTheme.next(isTicketsTheme);
  }
}