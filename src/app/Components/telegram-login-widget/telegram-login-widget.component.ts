import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ParamsMapper } from 'src/app/Model/Utils/ParamsMapper'

@Component({
  selector: 'app-telegram-login-widget',
  template: `    
<div #script style.display="none">
  <ng-content></ng-content>
</div>`,
  styleUrls: ['./telegram-login-widget.component.css']
})
export class TelegramLoginWidget implements AfterViewInit {

  @ViewChild('script', { static: true }) script: ElementRef;

  constructor(private loginService: AuthService) { }

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'BalanceCommunicationLocalDevBot');
    script.setAttribute('data-size', 'large');
    // Callback function in global scope
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);
  }

  ngAfterViewInit() {
    window['loginViaTelegram'] = loginData => this.loginViaTelegram(loginData);
    this.convertToScript();
  }

  private loginViaTelegram(loginData) {
    this.loginService.loginViaTelegram(ParamsMapper.getTelegramAuthDto(loginData));
  }
}