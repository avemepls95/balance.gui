import { Component, AfterViewInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { GetDtoMapper } from 'src/app/Model/Utils/GetDtoMapper'
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CommonDtoMapper } from 'src/app/Model/Utils/CommonDtoMapper';

@Component({
  selector: 'app-telegram-login-widget',
  template: `    
<div #script style.display="none">
  <ng-content></ng-content>
</div>`,
  styleUrls: ['./telegram-login-widget.component.css']
})
export class TelegramLoginWidget implements AfterViewInit {

  @Output()
  isAuthError = new EventEmitter<boolean>();

  @Output()
  loginStarted = new EventEmitter();
  @Output()
  loginEnded = new EventEmitter();
  @Output()
  loginSuccessful = new EventEmitter();

  @ViewChild('script', { static: true }) script: ElementRef;

  constructor(private loginService: AuthService, private router: Router) { }

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
    this.loginStarted.emit();

    this.loginService.loginViaTelegram(CommonDtoMapper.getTelegramAuthDto(loginData))
      .pipe(
        finalize(() => {
          this.loginEnded.emit()
        })
      )
      .subscribe(
        (response: any) => {
          this.loginSuccessful.emit();
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.isAuthError.emit(true);
          }
        }
      );
  }
}