import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { TelegramAuthDto } from '../Model/Dto/TelegramAuthDto'
import { VkAuthDto } from '../Model/Dto/VkAuthDto';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelper) {
    // this.apiBaseUrl = AppConfig.settings.apiServer.url;
    this.apiBaseUrl = 'http://localhost:8081/';
  }

  loginViaTelegram(loginData: TelegramAuthDto) {
    this.http.post(this.apiBaseUrl + 'auth/telegram', loginData).subscribe((response: any) => {
      localStorage.setItem('token', response.data.token)
      this.router.navigate(['/main']);
    });
  }

  loginViaVk(loginData: VkAuthDto) {
    this.http.post(this.apiBaseUrl + 'auth/vk', loginData).subscribe((response) => {
      this.router.navigate(['/main']);
    });
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (token == null)
      return false;
    
    return !this.jwtHelper.isTokenExpired(token);
  }
}
