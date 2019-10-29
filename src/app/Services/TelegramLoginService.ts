import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramLoginService {
  init() {
    window['loginViaTelegram'] = loginData => this.loginViaTelegram(loginData);
  }
  private loginViaTelegram(loginData: TelegramLoginData) {
    // If the login should trigger view changes, run it within the NgZone.
    this.ngZone.run(() => process(loginRequest));
  }
}
