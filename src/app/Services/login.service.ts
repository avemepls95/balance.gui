import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { TelegramAuthDto } from '../Model/Dto/TelegramAuthDto'
import { VkAuthDto } from '../Model/Dto/VkAuthDto';
import { Router } from '@angular/router';
import { AuthMethod } from '../Model/AuthMethod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public static AuthMethod: AuthMethod = AuthMethod.Unauthorized;
  private apiBaseUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiBaseUrl = AppConfig.settings.apiServer.url;
  }

  loginViaTelegram(loginData: TelegramAuthDto) {
    this.http.post(this.apiBaseUrl + 'auth/telegram', loginData).subscribe((response) => {
      LoginService.AuthMethod = AuthMethod.Telegram;
    });
    this.router.navigate(['/main']);
  }

  loginViaVk(loginData: VkAuthDto) {
    this.http.post(this.apiBaseUrl + 'auth/vk', loginData).subscribe((response) => {
      LoginService.AuthMethod = AuthMethod.Vk;
    });
    this.router.navigate(['/main']);
  }
}
