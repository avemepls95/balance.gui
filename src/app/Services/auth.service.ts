import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { AppConfig } from '../app.config';
import { JwtHelper } from 'angular2-jwt';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TelegramToBalanceAuthDto } from '../Model/Dto/Auth/TelegramToBalanceAuthDto';
import { VkToBalanceAuthDto } from '../Model/Dto/Auth/VkToBalanceAuthDto';
import { LocalStorageManager } from '../LocalStorageManager';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient, public jwtHelper: JwtHelper) {
    // this.apiBaseUrl = AppConfig.settings.apiServer.url;
    // this.apiBaseUrl = 'http://localhost:8081/';
    this.apiBaseUrl = 'http://194.67.92.135:8081/';
  }

  loginViaTelegram(loginData: TelegramToBalanceAuthDto): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'auth/telegram ', loginData);
  }

  loginViaVk(loginData: VkToBalanceAuthDto): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'auth/vk', loginData);
  }

  setToken(token) {
    localStorage.setItem(LocalStorageManager.tokenKey, token)
  }

  public removeCurrentToken() {
    localStorage.removeItem(LocalStorageManager.tokenKey);
  }

  public getToken(): string {
    return localStorage.getItem(LocalStorageManager.tokenKey);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (token == null)
      return false;

    return !this.jwtHelper.isTokenExpired(token);
  }
}
