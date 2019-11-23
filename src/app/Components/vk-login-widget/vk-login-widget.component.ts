import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ParamsMapper } from 'src/app/Model/Utils/ParamsMapper';

@Component({
  selector: 'app-vk-login-widget',
  template: `    
<div #script style.display="none">
  <ng-content></ng-content>
</div>`,
  styleUrls: ['./vk-login-widget.component.css']
})
export class VkLoginWidgetComponent implements AfterViewInit {

  @ViewChild('script', { static: true }) script: ElementRef;

  constructor(private loginService: AuthService) { }

  convertToScript() {
    const element = this.script.nativeElement;
    
    const script1 = document.createElement('script');
    script1.type= 'text/javascript';
    script1.text = 'VK.init({ apiId: 7211443 });';

    const div = document.createElement('div');
    div.setAttribute('id', 'vk_auth');

    const script2 = document.createElement('script');
    script2.type= 'text/javascript';
    script2.text = 'VK.Widgets.Auth("vk_auth", { "onAuth": function(data) { loginViaVk(data); } });';

    element.parentElement.replaceChild(script1, element);

    script1.parentElement.append(div);
    script1.parentElement.append(script2);
  }

  ngAfterViewInit() {
    window['loginViaVk'] = loginData => this.loginViaVk(loginData);
    this.convertToScript();
  }

  private loginViaVk(loginData) {
    this.loginService.loginViaVk(ParamsMapper.getVkAuthDto(loginData));
  }
}
