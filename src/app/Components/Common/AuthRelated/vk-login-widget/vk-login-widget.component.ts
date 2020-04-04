import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CommonDtoMapper } from 'src/app/Model/Utils/CommonDtoMapper';
import { FromVkAuthDto } from 'src/app/Model/Dto/Auth/FromVkAuthDto';
import { LocalStorageManager } from 'src/app/LocalStorageManager';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vk-login-widget',
  template: `    
<div #script style.display="none">
  <ng-content></ng-content>
</div>`,
  styleUrls: ['./vk-login-widget.component.css']
})
export class VkLoginWidgetComponent implements AfterViewInit {

  @Output()
  isAuthError = new EventEmitter<boolean>();

  @Output()
  loginStarted = new EventEmitter();
  @Output()
  loginEnded = new EventEmitter();
  @Output()
  loginSuccessful = new EventEmitter<any>();

  @ViewChild('script', { static: true }) script: ElementRef;

  constructor(private loginService: AuthService, private router: Router) { }

  convertToScript() {
    const element = this.script.nativeElement;

    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.text = `VK.init({ apiId: ${environment.vkApiId} })`;

    const div = document.createElement('div');
    div.setAttribute('id', 'vk_auth');

    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.text = 'VK.Widgets.Auth("vk_auth", { "onAuth": function(data) { loginViaVk(data); } });';

    element.parentElement.replaceChild(script1, element);

    script1.parentElement.append(div);
    script1.parentElement.append(script2);
  }

  ngAfterViewInit() {
    window['loginViaVk'] = (loginData: FromVkAuthDto) => {
      LocalStorageManager.setUserData(loginData);
      this.loginViaVk(loginData)
    };
    this.convertToScript();
  }

  private loginViaVk(loginData: FromVkAuthDto) {
    this.loginStarted.emit();

    this.loginService.loginViaVk(CommonDtoMapper.getVkAuthDto(loginData))
      .pipe(
        finalize(() => {
          this.loginEnded.emit()
        })
      )
      .subscribe(
        (response: any) => {
          this.loginSuccessful.emit(response);
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.isAuthError.emit(true);
          }
        }
      );
  }
}
