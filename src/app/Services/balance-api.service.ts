import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceApiService {

  private apiBaseUrl: string;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = 'http://localhost:8081/';
  }

  getUsersSuggestion(query: string) : Observable<any> {
    return this.http.get(this.apiBaseUrl + 'users/search/?query=' + query);
  }
}
